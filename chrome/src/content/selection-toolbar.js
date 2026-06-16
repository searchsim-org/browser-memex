/**
 * selection-toolbar.js — in-page action pill for text selections.
 *
 * Whenever the user highlights non-trivial text on a page, a small floating
 * pill appears just above the selection with the Monica-style action set,
 * tailored to BrowserMemex:
 *
 *   💬  Send to chat         — open side panel, prefill input with selection
 *   💾  Save to memory       — write a SemanticFact nugget right now
 *   ⚡  Turn into a skill    — open Skills tab with selection as starter
 *   🌐  Translate            — open chat with "Translate: …"
 *   🏷️  Tag                  — save as a labelled DOM/text reference
 *   ⋮   Open side panel       — escape hatch
 *
 * Implementation notes:
 *   - Toolbar lives in a Shadow DOM root attached to <html>, so page CSS
 *     can't break it and our styles can't leak into the page.
 *   - Anchored to the selection's bounding rect; repositions on scroll.
 *   - Hidden when selection clears, the user clicks outside, or Escape is
 *     pressed.
 *   - Disabled on internal pages (chrome://, about:, the extension itself)
 *     and inside our own UI elements (the in-page tag overlay, the
 *     visual indicators).
 *
 * Runtime messages to the service worker (all fire-and-forget):
 *   bmx-selection.chat        { text, sourceUrl, pageTitle }
 *   bmx-selection.memorize    { text, sourceUrl, pageTitle }
 *   bmx-selection.skillify    { text, sourceUrl, pageTitle }
 *   bmx-selection.translate   { text, sourceUrl, pageTitle }
 *   bmx-selection.tag         { text, label, sourceUrl, pageTitle }
 *   bmx-selection.openPanel
 */

(function () {
  if (window.__bmxSelectionToolbarInstalled) return;
  window.__bmxSelectionToolbarInstalled = true;

  // Bail early on contexts where a selection toolbar would be obnoxious or
  // unsafe. About / extension / file / data URIs are out.
  const proto = window.location.protocol;
  if (!["http:", "https:"].includes(proto)) return;

  const MIN_SELECTION_LENGTH = 3;
  const MAX_SELECTION_LENGTH = 4000;
  const SHOW_DELAY_MS = 120;

  let host = null;
  let root = null;
  let toolbar = null;
  let showTimer = null;
  let lastSelectionText = "";

  function ensureRoot() {
    if (host) return root;
    host = document.createElement("div");
    host.id = "__bmx-selection-host";
    Object.assign(host.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "0",
      height: "0",
      zIndex: "2147483647",
      pointerEvents: "none",
    });
    document.documentElement.appendChild(host);
    root = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = CSS;
    root.appendChild(style);

    toolbar = document.createElement("div");
    toolbar.className = "bmx-pill";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "BrowserMemex selection actions");
    toolbar.innerHTML = TOOLBAR_HTML;
    root.appendChild(toolbar);

    wireButtons();
    return root;
  }

  // Selection cache. We snapshot the selection on `mousedown` (before the
  // browser collapses it when focus moves) and consume it on `click` (which
  // Chrome counts as a primary user gesture for chrome.sidePanel.open).
  // Caching this way preserves both the text AND the gesture chain.
  let pendingText = "";

  function wireButtons() {
    toolbar.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("mousedown", (e) => {
        // Don't collapse the selection or steal focus from the page.
        e.preventDefault();
        e.stopPropagation();
        pendingText = getSelectionText();
      });
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const action = btn.getAttribute("data-action");
        if (!pendingText && action !== "openPanel") {
          // Fall back to the live selection in case mousedown didn't fire
          // (e.g., keyboard activation).
          pendingText = getSelectionText();
          if (!pendingText && action !== "openPanel") return;
        }
        handleAction(action, pendingText);
        pendingText = "";
        hideToolbar();
      });
    });
  }

  function handleAction(action, text) {
    const payload = {
      text,
      sourceUrl: window.location.href,
      pageTitle: document.title,
    };

    if (action === "tag") {
      // In-page shadow-DOM prompt instead of window.prompt
      showInPagePrompt({
        title: "Tag this selection",
        message: "Label so an agent can find it later",
        defaultValue: text.slice(0, 40),
        placeholder: "e.g. pricing table, sign-in button",
        okLabel: "Save tag",
      }).then((label) => {
        if (!label?.trim()) return;
        sendRuntime("bmx-selection.tag", { ...payload, label: label.trim() });
        flashOk("Tagged");
      });
      return;
    }

    if (action === "openPanel") {
      sendRuntime("bmx-selection.openPanel", {});
      return;
    }

    const map = {
      chat: "bmx-selection.chat",
      memorize: "bmx-selection.memorize",
      skillify: "bmx-selection.skillify",
      translate: "bmx-selection.translate",
    };
    const type = map[action];
    if (!type) return;
    sendRuntime(type, payload);
    flashOk(
      action === "chat"
        ? "Sent to chat"
        : action === "memorize"
        ? "Saved to memory"
        : action === "skillify"
        ? "Drafting skill…"
        : "Translating…"
    );
  }

  /**
   * Send a runtime message and inspect the response. The SW sets
   * `needsManualOpen: true` on its reply when it couldn't open the side
   * panel in the current gesture context (Firefox). We surface that as a
   * helpful in-page toast instead of opening a new tab.
   */
  function sendRuntime(type, args) {
    try {
      chrome.runtime.sendMessage({ type, args }, (response) => {
        if (chrome.runtime.lastError) {
          // No SW or no listener; nothing to surface.
          return;
        }
        if (response?.result?.needsManualOpen) {
          flashInfo("Open the sidebar to continue — it's been queued.");
        }
      });
    } catch {
      /* SW may not be reachable; ignore */
    }
  }

  function flashOk(message) {
    flash(message, 1200, "ok");
  }

  function flashInfo(message) {
    flash(message, 2800, "info");
  }

  function flash(message, durationMs, variant) {
    ensureRoot();
    const el = document.createElement("div");
    el.className = `bmx-pill__flash bmx-pill__flash--${variant}`;
    el.textContent = message;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add("bmx-pill__flash--in"));
    setTimeout(() => {
      el.classList.remove("bmx-pill__flash--in");
      setTimeout(() => el.remove(), 200);
    }, durationMs);
  }

  /**
   * In-page prompt modal rendered inside the shadow DOM. Returns a Promise
   * resolving to the entered string (or null on cancel). Replaces
   * window.prompt for the "Tag selection" action.
   */
  function showInPagePrompt({ title, message, defaultValue = "", placeholder = "", okLabel = "OK", cancelLabel = "Cancel" }) {
    ensureRoot();
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "bmx-modal-overlay";
      overlay.innerHTML = `
        <div class="bmx-modal" role="dialog" aria-modal="true">
          ${title ? `<div class="bmx-modal__title"></div>` : ""}
          <p class="bmx-modal__message"></p>
          <input class="bmx-modal__input" type="text" />
          <div class="bmx-modal__actions">
            <button class="bmx-modal__btn" data-act="cancel"></button>
            <button class="bmx-modal__btn bmx-modal__btn--primary" data-act="ok"></button>
          </div>
        </div>
      `;
      // Use textContent rather than innerHTML for any user-controlled text.
      if (title) overlay.querySelector(".bmx-modal__title").textContent = title;
      overlay.querySelector(".bmx-modal__message").textContent = message ?? "";
      const input = overlay.querySelector(".bmx-modal__input");
      input.value = defaultValue;
      input.placeholder = placeholder;
      overlay.querySelector("[data-act='cancel']").textContent = cancelLabel;
      overlay.querySelector("[data-act='ok']").textContent = okLabel;
      root.appendChild(overlay);
      input.focus();
      input.select();

      const close = (result) => {
        overlay.remove();
        resolve(result);
      };

      overlay.addEventListener("mousedown", (e) => {
        if (e.target === overlay) close(null);
      });
      overlay.querySelector("[data-act='cancel']").addEventListener("click", () => close(null));
      overlay.querySelector("[data-act='ok']").addEventListener("click", () => close(input.value));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          close(input.value);
        } else if (e.key === "Escape") {
          e.preventDefault();
          close(null);
        }
      });
    });
  }

  function getSelectionText() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return "";
    const t = sel.toString().trim();
    if (t.length < MIN_SELECTION_LENGTH) return "";
    if (t.length > MAX_SELECTION_LENGTH) return t.slice(0, MAX_SELECTION_LENGTH);
    return t;
  }

  function getSelectionRect() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) return null;
    return rect;
  }

  function positionToolbar(rect) {
    ensureRoot();
    const margin = 8;
    // Force layout so we can read the toolbar's own width
    toolbar.style.visibility = "hidden";
    toolbar.style.display = "flex";
    const tw = toolbar.offsetWidth;
    const th = toolbar.offsetHeight;

    let top = rect.top - th - margin;
    if (top < 4) top = rect.bottom + margin;
    let left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(4, Math.min(left, window.innerWidth - tw - 4));

    toolbar.style.top = `${Math.round(top)}px`;
    toolbar.style.left = `${Math.round(left)}px`;
    toolbar.style.visibility = "visible";
  }

  function showToolbar() {
    ensureRoot();
    const text = getSelectionText();
    if (!text) return hideToolbar();
    const rect = getSelectionRect();
    if (!rect) return hideToolbar();
    lastSelectionText = text;
    positionToolbar(rect);
  }

  function hideToolbar() {
    if (toolbar) toolbar.style.display = "none";
    lastSelectionText = "";
  }

  function scheduleShow() {
    if (showTimer) clearTimeout(showTimer);
    showTimer = setTimeout(() => {
      showTimer = null;
      showToolbar();
    }, SHOW_DELAY_MS);
  }

  document.addEventListener(
    "selectionchange",
    () => {
      const text = getSelectionText();
      if (!text) {
        hideToolbar();
        return;
      }
      // Debounce: only show after the selection settles.
      scheduleShow();
    },
    { passive: true }
  );

  document.addEventListener(
    "mousedown",
    (e) => {
      // Click inside the toolbar (Shadow DOM crosses composedPath) — keep
      // the toolbar; otherwise let the browser collapse the selection.
      if (!toolbar) return;
      const path = e.composedPath ? e.composedPath() : [];
      if (path.includes(host)) return;
    },
    { capture: true, passive: true }
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") hideToolbar();
    },
    { passive: true }
  );

  window.addEventListener("scroll", () => hideToolbar(), { passive: true });
  window.addEventListener("blur", () => hideToolbar(), { passive: true });

  // ---- Markup + styles ----

  const TOOLBAR_HTML = `
    <button data-action="chat" title="Send to chat" aria-label="Send to chat">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </button>
    <button data-action="memorize" title="Save to memory" aria-label="Save to memory">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </button>
    <button data-action="skillify" title="Turn into a skill" aria-label="Turn into a skill">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </button>
    <button data-action="translate" title="Translate" aria-label="Translate">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 8h14M9 4v4M5 12c4 4 6 4 10 0M14 14l4 8M22 22l-4-8" />
      </svg>
    </button>
    <button data-action="tag" title="Tag selection" aria-label="Tag selection">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    </button>
    <span class="bmx-pill__divider" aria-hidden="true"></span>
    <button data-action="openPanel" class="bmx-pill__brand" title="Open BrowserMemex" aria-label="Open BrowserMemex">
      <img src="${chrome.runtime.getURL('icons/icon-48.png')}" alt="" />
    </button>
  `;

  const CSS = `
    :host { all: initial; }
    .bmx-pill {
      position: fixed;
      display: none;
      align-items: center;
      gap: 2px;
      padding: 4px 6px;
      background: #ffffff;
      color: #18181b;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 999px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      pointer-events: auto;
      user-select: none;
      -webkit-user-select: none;
    }
    .bmx-pill button {
      all: unset;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #3f3f46;
      transition: background-color 80ms ease, color 80ms ease;
    }
    .bmx-pill button:hover {
      background: #f4f4f5;
      color: #18181b;
    }
    .bmx-pill button:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }
    .bmx-pill__divider {
      width: 1px;
      height: 16px;
      background: rgba(0,0,0,0.1);
      margin: 0 4px;
    }
    .bmx-pill__brand {
      width: 30px !important;
      height: 30px !important;
      background: #ffffff;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04);
      margin-left: 2px;
      padding: 0;
      overflow: hidden;
    }
    .bmx-pill__brand:hover {
      background: #f4f4f5 !important;
      transform: scale(1.04);
    }
    .bmx-pill__brand img {
      width: 18px;
      height: 18px;
      display: block;
      object-fit: contain;
      pointer-events: none;
    }
    .bmx-pill__flash {
      position: fixed;
      top: 12px;
      left: 50%;
      transform: translate(-50%, -8px);
      background: #18181b;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      padding: 6px 10px;
      border-radius: 6px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 120ms ease, transform 120ms ease;
    }
    .bmx-pill__flash--in {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    .bmx-pill__flash--info {
      background: #1d4ed8;
    }

    /* In-page prompt modal */
    .bmx-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.32);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
      animation: bmxOverlayIn 120ms ease-out;
    }
    .bmx-modal {
      width: 100%;
      max-width: 380px;
      background: #ffffff;
      color: #18181b;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 10px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.22);
      padding: 16px 18px 14px;
      animation: bmxModalIn 140ms ease-out;
    }
    .bmx-modal__title {
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .bmx-modal__message {
      font-size: 13px;
      line-height: 1.45;
      margin: 0 0 12px;
      color: #3f3f46;
    }
    .bmx-modal__input {
      width: 100%;
      font-size: 13px;
      padding: 8px 10px;
      border: 1px solid rgba(0,0,0,0.12);
      border-radius: 6px;
      background: #ffffff;
      color: #18181b;
      margin-bottom: 12px;
      outline: none;
      box-sizing: border-box;
    }
    .bmx-modal__input:focus {
      border-color: #18181b;
    }
    .bmx-modal__actions {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
    }
    .bmx-modal__btn {
      all: unset;
      font-size: 12px;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.08);
      background: #ffffff;
      color: #18181b;
      text-align: center;
    }
    .bmx-modal__btn:hover { background: #f4f4f5; }
    .bmx-modal__btn--primary {
      background: #18181b;
      color: #ffffff;
      border-color: #18181b;
    }
    .bmx-modal__btn--primary:hover { opacity: 0.92; background: #18181b; }

    @keyframes bmxOverlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes bmxModalIn {
      from { opacity: 0; transform: translateY(6px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @media (prefers-color-scheme: dark) {
      .bmx-pill {
        background: #1f1f23;
        color: #f4f4f5;
        border-color: rgba(255,255,255,0.08);
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      }
      .bmx-pill button { color: #d4d4d8; }
      .bmx-pill button:hover { background: #2a2a30; color: #ffffff; }
      .bmx-pill__divider { background: rgba(255,255,255,0.12); }
      .bmx-pill__brand {
        background: #ffffff;
        border-color: rgba(255,255,255,0.15);
      }
      .bmx-pill__brand:hover { background: #f4f4f5 !important; }
      .bmx-modal {
        background: #1f1f23;
        color: #f4f4f5;
        border-color: rgba(255,255,255,0.08);
      }
      .bmx-modal__message { color: #a1a1aa; }
      .bmx-modal__input {
        background: #0f0f12;
        color: #f4f4f5;
        border-color: rgba(255,255,255,0.12);
      }
      .bmx-modal__input:focus { border-color: #f4f4f5; }
      .bmx-modal__btn {
        background: #1f1f23;
        color: #f4f4f5;
        border-color: rgba(255,255,255,0.12);
      }
      .bmx-modal__btn:hover { background: #2a2a30; }
      .bmx-modal__btn--primary {
        background: #f4f4f5;
        color: #18181b;
        border-color: #f4f4f5;
      }
      .bmx-modal__btn--primary:hover { background: #f4f4f5; opacity: 0.92; }
    }
  `;
})();
