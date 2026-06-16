/**
 * Toolbar popup (Phase 7.5).
 *
 * A compact picker styled after the Zapier Agents popup:
 *   - Header: logo + "Quick tasks" title + pin (opens the side panel)
 *   - Picker list: most recently updated skills, each row openable as a
 *     one-shot task; a "+ New task" row at the bottom expands a free-form
 *     textarea + Send.
 *   - Footer: active profile name + BrowserMemex wordmark.
 *
 * Hand-rolled (no framework) so the popup stays a tiny bundle.
 */

const $ = (sel) => document.querySelector(sel);

const PALETTE = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#84a04a", // olive
  "#ec4899", // pink
  "#f59e0b", // amber
  "#06b6d4", // cyan
  "#ef4444", // red
];

function colorForName(name) {
  let h = 5381;
  for (let i = 0; i < name.length; i++) h = (h * 33) ^ name.charCodeAt(i);
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function initialsFor(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rpc(type, args) {
  return new Promise((resolve, reject) => {
    const target =
      typeof browser !== "undefined" && browser.runtime ? browser : chrome;
    target.runtime.sendMessage({ type, args }, (response) => {
      if (target.runtime.lastError) {
        reject(new Error(target.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error(`no response for ${type}`));
        return;
      }
      if (response.ok) resolve(response.result);
      else {
        const e = new Error(response.error || `${type} failed`);
        e.notReady = !!response.notReady;
        reject(e);
      }
    });
  });
}

async function openSidePanel() {
  const target =
    typeof browser !== "undefined" && browser.sidePanel
      ? browser
      : typeof chrome !== "undefined"
      ? chrome
      : null;
  if (!target) return;
  try {
    if (target.sidePanel?.open) {
      const [tab] = await target.tabs.query({
        active: true,
        currentWindow: true,
      });
      await target.sidePanel.open({ windowId: tab?.windowId });
    } else if (target.sidebarAction?.open) {
      await target.sidebarAction.open();
    }
    window.close();
  } catch (e) {
    setStatus("Couldn't open the panel: " + (e?.message ?? e), "error");
  }
}

function setStatus(msg, kind) {
  const el = $("#qa-status");
  if (!el) return;
  el.textContent = msg ?? "";
  el.className = kind ? `qa-status qa-status--${kind}` : "qa-status";
}

async function loadSkills() {
  try {
    const list = await rpc("services.skills.list", { limit: 5 });
    return Array.isArray(list) ? list.slice(0, 5) : [];
  } catch (e) {
    if (e.notReady) throw e;
    return [];
  }
}

async function loadProfileName() {
  try {
    const profile = await rpc("services.profiles.getActive");
    return profile?.name ?? "Default";
  } catch {
    return "Default";
  }
}

async function createTask(text, opts = {}) {
  const target =
    typeof browser !== "undefined" && browser.tabs ? browser : chrome;
  const [tab] = await new Promise((resolve) => {
    target.tabs.query({ active: true, currentWindow: true }, resolve);
  });
  await rpc("services.tasks.create", {
    kind: "one_shot",
    title: opts.title ?? (text.length > 60 ? text.slice(0, 57) + "…" : text),
    description: text,
    payload: {
      instruction: text,
      url: tab?.url ?? "",
      skillId: opts.skillId,
    },
    capability: opts.capability ?? "read_with_network",
    creator: "user",
  });
}

function renderHeader() {
  return `
    <header class="qa-header">
      <div class="qa-header__left">
        <img class="qa-logo" src="../../icons/icon-32.png" alt="" />
        <h1 class="qa-title">Quick tasks</h1>
      </div>
      <button type="button" id="qa-pin" class="qa-icon-btn" title="Open side panel" aria-label="Open side panel">
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M9.5 1.5l5 5-2 .5-3 3 .5 2-1.5 1.5L4.5 9 1 14h-.5V13.5L5.5 10 1.5 6 3 4.5l2 .5 3-3 .5-2 1-1.5z"
                fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>
      </button>
    </header>
  `;
}

function renderSkillRow(skill) {
  const color = colorForName(skill.name);
  const initials = initialsFor(skill.name);
  return `
    <li class="qa-item" data-skill-id="${escapeHtml(skill.id)}" data-skill-name="${escapeHtml(
    skill.name
  )}">
      <span class="qa-item__icon" style="background:${color}">${escapeHtml(initials)}</span>
      <span class="qa-item__name">${escapeHtml(skill.name)}</span>
      <button type="button" class="qa-item__run" data-run-id="${escapeHtml(skill.id)}" title="Run now" aria-label="Run now">▶</button>
      <button type="button" class="qa-item__menu" aria-label="More" tabindex="-1">⋮</button>
    </li>
  `;
}

function renderNewTaskRow() {
  return `
    <li class="qa-item qa-item--new" id="qa-new">
      <span class="qa-item__plus" aria-hidden="true">+</span>
      <span class="qa-item__name">New task</span>
    </li>
  `;
}

function renderFooter(profileName) {
  const initials = initialsFor(profileName);
  return `
    <footer class="qa-footer">
      <div class="qa-user">
        <span class="qa-user__avatar">${escapeHtml(initials)}</span>
        <span class="qa-user__name">${escapeHtml(profileName)}</span>
      </div>
      <span class="qa-brand">BrowserMemex</span>
    </footer>
  `;
}

function renderComposer(prefill = "") {
  return `
    <div class="qa-composer" id="qa-composer">
      <textarea id="qa-input" rows="3" placeholder="What should the agent do?" autofocus>${escapeHtml(
        prefill
      )}</textarea>
      <div class="qa-composer__actions">
        <button type="button" id="qa-cancel" class="qa-btn">Cancel</button>
        <button type="button" id="qa-send" class="qa-btn qa-btn--primary">Send</button>
      </div>
      <div id="qa-status" class="qa-status"></div>
    </div>
  `;
}

function renderShell(skills, profileName, banner) {
  const listItems = skills.map(renderSkillRow).join("") + renderNewTaskRow();
  return `
    <div class="qa-popup">
      ${renderHeader()}
      ${banner ? `<div class="qa-banner">${escapeHtml(banner)}</div>` : ""}
      <ul class="qa-list">
        ${listItems}
      </ul>
      <div id="qa-composer-slot"></div>
      ${renderFooter(profileName)}
    </div>
  `;
}

function attachListHandlers() {
  $("#qa-pin").addEventListener("click", openSidePanel);
  document.querySelectorAll(".qa-item[data-skill-id]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest(".qa-item__menu")) return;
      if (e.target.closest(".qa-item__run")) return;
      const name = el.getAttribute("data-skill-name");
      const id = el.getAttribute("data-skill-id");
      openComposer({ skillName: name, skillId: id });
    });
  });
  document.querySelectorAll(".qa-item__run").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-run-id");
      btn.disabled = true;
      try {
        // Don't await — skills can drive a real browser session and may take
        // minutes. Fire-and-forget then open the side panel so the user can
        // watch progress.
        rpc("services.skills.run", { id, inputs: {} }).catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("[popup] skill.run failed:", err?.message ?? err);
        });
        openSidePanel();
      } catch (err) {
        setStatus("Couldn't run: " + (err?.message ?? err), "error");
        btn.disabled = false;
      }
    });
  });
  document.querySelectorAll(".qa-item__menu").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSidePanel();
    });
  });
  const newRow = $("#qa-new");
  if (newRow) {
    newRow.addEventListener("click", () => openComposer({}));
  }
}

function openComposer({ skillName, skillId }) {
  const prefill = skillName ? `Run "${skillName}": ` : "";
  $("#qa-composer-slot").innerHTML = renderComposer(prefill);
  const input = $("#qa-input");
  input.focus();
  if (prefill) input.setSelectionRange(prefill.length, prefill.length);

  $("#qa-cancel").addEventListener("click", closeComposer);
  $("#qa-send").addEventListener("click", () => submitComposer(skillId));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeComposer();
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submitComposer(skillId);
    }
  });
}

function closeComposer() {
  $("#qa-composer-slot").innerHTML = "";
}

async function submitComposer(skillId) {
  const text = $("#qa-input").value.trim();
  if (!text) {
    setStatus("Type something first.", "error");
    return;
  }
  $("#qa-send").disabled = true;
  setStatus("Creating task…", "loading");
  try {
    await createTask(text, { skillId });
    setStatus("Task created. Opening panel…", "success");
    setTimeout(openSidePanel, 500);
  } catch (e) {
    const detail = e?.message ?? String(e);
    setStatus(e?.notReady ? "Services initializing — try again in a moment." : "Failed: " + detail, "error");
    $("#qa-send").disabled = false;
  }
}

async function bootPopup() {
  const root = document.getElementById("popup-root");
  root.innerHTML = `<div class="qa-popup qa-popup--loading">
    ${renderHeader()}
    <div class="qa-loading">Loading…</div>
  </div>`;

  let skills = [];
  let profileName = "Default";
  let banner = null;
  try {
    [skills, profileName] = await Promise.all([loadSkills(), loadProfileName()]);
  } catch (e) {
    if (e.notReady) {
      banner = "Services starting up — quick tasks will appear shortly.";
    }
  }

  root.innerHTML = renderShell(skills, profileName, banner);
  attachListHandlers();
}

document.addEventListener("DOMContentLoaded", bootPopup);
