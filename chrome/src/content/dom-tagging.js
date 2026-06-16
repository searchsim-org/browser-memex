/**
 * dom-tagging.js — Phase E.3 in-page tagger.
 *
 * Activated by a runtime message from the side panel:
 *   { type: 'bmx-tagging.start' }       → enable hover highlight + click-to-tag
 *   { type: 'bmx-tagging.stop'  }       → tear down
 *
 * Once active, every hover draws a translucent outline on the candidate
 * element; clicking it captures a stable selector + label and asks the
 * service worker to save the tag as a nugget (tier='profile', so it's
 * visible to every agent in the active profile).
 *
 * Pure DOM — no framework. Loaded eagerly in content_scripts at
 * document_end so it's available on every page the user browses.
 */

(function () {
  if (window.__bmxTaggingInstalled) return;
  window.__bmxTaggingInstalled = true;

  const OVERLAY_ID = '__bmx-tagging-overlay';
  const LABEL_ID = '__bmx-tagging-label';
  let active = false;
  let lastTarget = null;

  function ensureOverlay() {
    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      Object.assign(overlay.style, {
        position: 'fixed',
        pointerEvents: 'none',
        border: '2px solid #3b82f6',
        background: 'rgba(59, 130, 246, 0.12)',
        zIndex: '2147483646',
        boxSizing: 'border-box',
        display: 'none',
        borderRadius: '3px',
      });
      document.documentElement.appendChild(overlay);
    }
    let label = document.getElementById(LABEL_ID);
    if (!label) {
      label = document.createElement('div');
      label.id = LABEL_ID;
      Object.assign(label.style, {
        position: 'fixed',
        zIndex: '2147483647',
        padding: '4px 8px',
        background: '#18181b',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '11px',
        borderRadius: '4px',
        pointerEvents: 'none',
        display: 'none',
        whiteSpace: 'nowrap',
        maxWidth: '320px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      });
      document.documentElement.appendChild(label);
    }
    return { overlay, label };
  }

  function removeOverlay() {
    const overlay = document.getElementById(OVERLAY_ID);
    const label = document.getElementById(LABEL_ID);
    overlay?.remove();
    label?.remove();
  }

  function positionOverlay(target) {
    const { overlay, label } = ensureOverlay();
    if (!target || target === document.body || target === document.documentElement) {
      overlay.style.display = 'none';
      label.style.display = 'none';
      return;
    }
    const rect = target.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    label.textContent = describe(target);
    label.style.display = 'block';
    label.style.top = `${Math.max(0, rect.top - 24)}px`;
    label.style.left = `${rect.left}px`;
  }

  function describe(el) {
    if (!el) return '';
    const tag = el.tagName?.toLowerCase() ?? '';
    const id = el.id ? `#${el.id}` : '';
    const cls = el.className && typeof el.className === 'string'
      ? '.' + el.className.split(/\s+/).slice(0, 2).join('.')
      : '';
    const text = (el.innerText || el.textContent || '').trim().slice(0, 40);
    return `${tag}${id}${cls}${text ? ` — "${text}"` : ''}`;
  }

  /**
   * Build a reasonably stable CSS selector for an element. Prefers id, then
   * data-testid / aria-label, then nth-of-type path. Not bulletproof — the
   * agent re-resolves at run time and falls back to text matching.
   */
  function selectorFor(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.id) return `#${cssEscape(el.id)}`;
    if (el.getAttribute('data-testid')) {
      return `[data-testid="${cssEscape(el.getAttribute('data-testid'))}"]`;
    }
    if (el.getAttribute('aria-label')) {
      return `[aria-label="${cssEscape(el.getAttribute('aria-label'))}"]`;
    }
    // nth-of-type path up to <body>
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body && parts.length < 8) {
      const parent = node.parentElement;
      if (!parent) break;
      const sameTag = Array.from(parent.children).filter(
        (c) => c.tagName === node.tagName
      );
      const idx = sameTag.indexOf(node) + 1;
      parts.unshift(`${node.tagName.toLowerCase()}:nth-of-type(${idx})`);
      node = parent;
    }
    return parts.join(' > ') || el.tagName.toLowerCase();
  }

  function cssEscape(s) {
    return String(s).replace(/(["\\])/g, '\\$1');
  }

  function onMouseMove(e) {
    if (!active) return;
    if (e.target === lastTarget) return;
    lastTarget = e.target;
    positionOverlay(e.target);
  }

  function onClick(e) {
    if (!active) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    if (!target || target.nodeType !== 1) return;

    // Hide the hover overlay so it doesn't sit on top of the prompt.
    const o = document.getElementById(OVERLAY_ID);
    const l = document.getElementById(LABEL_ID);
    if (o) o.style.display = 'none';
    if (l) l.style.display = 'none';

    showTaggerPrompt(target).then((label) => {
      if (!label?.trim()) return stop();

      const selector = selectorFor(target);
      const text = (target.innerText || target.textContent || '').trim().slice(0, 200);

      try {
        chrome.runtime.sendMessage(
          {
            type: 'bmx-tagging.save',
            payload: {
              label: label.trim(),
              selector,
              text,
              url: window.location.href,
              pageTitle: document.title,
              tag: target.tagName?.toLowerCase() ?? null,
            },
          },
          () => stop()
        );
      } catch {
        stop();
      }
    });
  }

  /**
   * In-page tagger prompt rendered in a one-off host inside <html>.
   * Returns a Promise resolving to the entered label (or null on cancel).
   */
  function showTaggerPrompt(target) {
    return new Promise((resolve) => {
      const host = document.createElement('div');
      Object.assign(host.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '2147483647',
      });
      const shadow = host.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = PROMPT_CSS;
      shadow.appendChild(style);

      const overlay = document.createElement('div');
      overlay.className = 'bmx-overlay';
      overlay.innerHTML = `
        <div class="bmx-modal" role="dialog" aria-modal="true">
          <div class="bmx-modal__title">Tag this element</div>
          <p class="bmx-modal__message">Give it a label so an agent (or you) can find it later.</p>
          <div class="bmx-modal__preview"></div>
          <input class="bmx-modal__input" type="text" placeholder="e.g. checkout button, pricing table" />
          <div class="bmx-modal__actions">
            <button class="bmx-modal__btn" data-act="cancel">Cancel</button>
            <button class="bmx-modal__btn bmx-modal__btn--primary" data-act="ok">Save tag</button>
          </div>
        </div>
      `;
      overlay.querySelector('.bmx-modal__preview').textContent = describe(target);
      shadow.appendChild(overlay);
      document.documentElement.appendChild(host);

      const input = shadow.querySelector('.bmx-modal__input');
      input.focus();

      const close = (result) => {
        host.remove();
        resolve(result);
      };

      overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay) close(null);
      });
      shadow.querySelector("[data-act='cancel']").addEventListener('click', () => close(null));
      shadow.querySelector("[data-act='ok']").addEventListener('click', () => close(input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          close(input.value);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          close(null);
        }
      });
    });
  }

  const PROMPT_CSS = `
    :host { all: initial; }
    .bmx-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.32);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
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
    }
    .bmx-modal__title { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .bmx-modal__message { font-size: 13px; line-height: 1.45; margin: 0 0 8px; color: #3f3f46; }
    .bmx-modal__preview {
      font-size: 11px;
      font-family: ui-monospace, monospace;
      background: #f4f4f5;
      padding: 6px 8px;
      border-radius: 4px;
      margin-bottom: 12px;
      color: #3f3f46;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
    .bmx-modal__input:focus { border-color: #18181b; }
    .bmx-modal__actions { display: flex; justify-content: flex-end; gap: 6px; }
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
    .bmx-modal__btn--primary:hover { opacity: 0.92; }
    @media (prefers-color-scheme: dark) {
      .bmx-modal { background: #1f1f23; color: #f4f4f5; border-color: rgba(255,255,255,0.08); }
      .bmx-modal__message, .bmx-modal__preview { color: #a1a1aa; }
      .bmx-modal__preview { background: #0f0f12; }
      .bmx-modal__input { background: #0f0f12; color: #f4f4f5; border-color: rgba(255,255,255,0.12); }
      .bmx-modal__input:focus { border-color: #f4f4f5; }
      .bmx-modal__btn { background: #1f1f23; color: #f4f4f5; border-color: rgba(255,255,255,0.12); }
      .bmx-modal__btn:hover { background: #2a2a30; }
      .bmx-modal__btn--primary { background: #f4f4f5; color: #18181b; border-color: #f4f4f5; }
    }
  `;

  function start() {
    if (active) return;
    active = true;
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click', onClick, true);
    ensureOverlay();
  }

  function stop() {
    active = false;
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', onClick, true);
    removeOverlay();
    lastTarget = null;
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg || typeof msg.type !== 'string') return false;
    if (msg.type === 'bmx-tagging.start') start();
    else if (msg.type === 'bmx-tagging.stop') stop();
    return false;
  });
})();
