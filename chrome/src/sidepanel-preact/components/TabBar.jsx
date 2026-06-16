/**
 * TabBar — vertical rail navigation on the right edge of the side panel.
 *
 * Design follows the Monica-style rail: stacked icon-over-label items, a
 * dotted divider separating primary from utility tabs, and a dark filled
 * capsule for the active item. SVG icons (not emoji) for crisp rendering at
 * any pixel density. The active profile lives at the bottom of the rail as
 * an avatar that opens a popover (see RailProfileMenu).
 *
 * Default tabs: Tasks, Memory, Skills, Agents, Registry, Settings.
 * Callers may pass `extraTabs` (e.g., the Chat tab) which are prepended.
 */

import { RailProfileMenu } from './RailProfileMenu.jsx';

const ICONS = {
  chat: (
    <path
      d="M3 5.5C3 4.12 4.12 3 5.5 3h9C15.88 3 17 4.12 17 5.5v6c0 1.38-1.12 2.5-2.5 2.5H8l-3.5 3v-3H5.5C4.12 14 3 12.88 3 11.5v-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  tasks: (
    <path
      d="M10 2.5l-5 8h3.5l-1 7 5-8H9l1-7z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  memory: (
    <path
      d="M4 4.5C4 3.67 4.67 3 5.5 3H15v13H5.5C4.67 16 4 15.33 4 14.5v-10zM4 14.5C4 13.67 4.67 13 5.5 13H15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  skills: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12.5 3a3.5 3.5 0 00-3 5.3L3.4 14.4a1.4 1.4 0 102 2L11.7 10A3.5 3.5 0 0016 6.5c0-.5-.1-1-.3-1.4l-2 2-1.8-1.8 2-2A3.5 3.5 0 0012.5 3z" />
    </g>
  ),
  agents: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <rect x="4" y="6" width="12" height="9" rx="2" />
      <path d="M10 3v3" strokeLinecap="round" />
      <circle cx="10" cy="3" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  registry: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M10 3l6 3v7l-6 3-6-3V6l6-3z" />
      <path d="M4 6l6 3 6-3M10 9v7" />
    </g>
  ),
  settings: (
    <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.3" />
      <path d="M10 2v2M10 16v2M18 10h-2M4 10H2M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4M15.5 15.5l-1.4-1.4M5.9 5.9L4.5 4.5" strokeLinecap="round" />
    </g>
  ),
};

const DEFAULT_TABS = Object.freeze([
  { id: "tasks", label: "Tasks" },
  { id: "memory", label: "Memory" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "Agents" },
  { id: "registry", label: "Registry" },
  { id: "settings", label: "Settings" },
]);

export const TABS = DEFAULT_TABS;

function RailItem({ tab, active, onSelect }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={tab.label}
      className={"bmx-rail__item " + (active ? "bmx-rail__item--active" : "")}
      onClick={() => onSelect(tab.id)}
    >
      <span className="bmx-rail__icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="20" height="20">
          {ICONS[tab.id] ?? null}
        </svg>
      </span>
      <span className="bmx-rail__label">{tab.label}</span>
    </button>
  );
}

export function TabBar({ active, onSelect, extraTabs = [], onManageProfiles }) {
  const all = [...extraTabs, ...DEFAULT_TABS];

  return (
    <nav className="bmx-rail" role="tablist" aria-label="Side panel navigation">
      <div className="bmx-rail__group">
        {all.map((tab) => (
          <RailItem
            key={tab.id}
            tab={tab}
            active={active === tab.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Spacer pushes the profile avatar to the bottom of the rail */}
      <div className="bmx-rail__spacer" aria-hidden="true" />
      <RailProfileMenu onManage={onManageProfiles} />
    </nav>
  );
}
