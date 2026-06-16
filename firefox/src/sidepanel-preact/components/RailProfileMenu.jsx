/**
 * RailProfileMenu — bottom-of-rail avatar with profile-switcher popover.
 *
 * Renders a 28px colored circle showing the active profile's initial.
 * Clicking opens a popover anchored above the avatar with:
 *   - the active profile + a stats line (skills · tasks · nuggets)
 *   - the other profiles, one-click to switch
 *   - "+ New profile" and "Manage profiles…" actions
 *
 * Designed to live inside `.bmx-rail` after the utility-tabs group, so it
 * mirrors the Monica reference (avatar pinned at the bottom of the rail).
 */

import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { useServicesRpc } from '../hooks/useServicesRpc.js';
import { showPrompt } from '../hooks/useDialog.js';

/** Profile avatars all use the side-panel accent (teal). Identity is
 *  conveyed via initials rather than per-profile colour so the rail stays
 *  on-palette regardless of how the user names their profiles. */
function initialsFor(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function RailProfileMenu({ onManage }) {
  const rpc = useServicesRpc();
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [active, setActive] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const rootRef = useRef(null);

  const loadProfiles = useCallback(async () => {
    try {
      const [list, a] = await Promise.all([rpc.profiles.list(), rpc.profiles.getActive()]);
      setProfiles(list);
      setActive(a);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [rpc]);

  const loadStats = useCallback(async () => {
    try {
      const [skills, tasks, nuggetCount] = await Promise.all([
        rpc.skills.list({ limit: 200 }).catch(() => []),
        rpc.tasks.list({ limit: 200 }).catch(() => []),
        rpc.memory.count().catch(() => 0),
      ]);
      setStats({
        skills: Array.isArray(skills) ? skills.length : 0,
        tasks: Array.isArray(tasks) ? tasks.length : 0,
        nuggets: typeof nuggetCount === 'number' ? nuggetCount : 0,
      });
    } catch {
      setStats(null);
    }
  }, [rpc]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    if (open) loadStats();
  }, [open, loadStats]);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleSwitch = useCallback(
    async (id) => {
      if (!id || id === active?.id) {
        setOpen(false);
        return;
      }
      try {
        await rpc.profiles.setActive(id);
        setOpen(false);
        await loadProfiles();
        // Force a soft reload of tab content. The simplest signal is a
        // CustomEvent that other components listen to (see useProfileChange).
        window.dispatchEvent(new CustomEvent('browser-memex.profile-changed', { detail: { id } }));
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, active, loadProfiles]
  );

  const handleCreate = useCallback(async () => {
    const name = await showPrompt('Name for this profile', '', {
      title: 'New profile',
      placeholder: 'e.g. Work, Personal, Research',
      okLabel: 'Create',
    });
    if (!name?.trim()) return;
    try {
      const created = await rpc.profiles.create({ name: name.trim() });
      await loadProfiles();
      await handleSwitch(created.id);
    } catch (e) {
      setError(e.message);
    }
  }, [rpc, loadProfiles, handleSwitch]);

  // Render a placeholder while profile boots; never block the rail.
  if (!active) {
    return (
      <div className="bmx-rail__profile" ref={rootRef}>
        <span
          className="bmx-rail__avatar bmx-rail__avatar--loading"
          aria-label="Loading profile"
          title="Loading profile"
        >
          ?
        </span>
      </div>
    );
  }

  return (
    <div className="bmx-rail__profile" ref={rootRef}>
      <button
        type="button"
        className={`bmx-rail__avatar ${open ? 'bmx-rail__avatar--open' : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`${active.name} — switch profile`}
        onClick={() => setOpen((o) => !o)}
      >
        {initialsFor(active.name)}
      </button>

      {open && (
        <div className="bmx-profile-popover" role="menu">
          <div className="bmx-profile-popover__header">
            <span
              className="bmx-profile-popover__big-avatar"
              aria-hidden="true"
            >
              {initialsFor(active.name)}
            </span>
            <div className="bmx-profile-popover__heading">
              <div className="bmx-profile-popover__name">{active.name}</div>
              {stats && (
                <div className="bmx-profile-popover__stats">
                  {stats.skills} skills · {stats.tasks} tasks · {stats.nuggets} nuggets
                </div>
              )}
            </div>
          </div>

          {error && <div className="bmx-error" style={{ margin: '6px 10px' }}>{error}</div>}

          <ul className="bmx-profile-popover__list" role="none">
            {profiles.map((p) => (
              <li key={p.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={p.id === active.id}
                  className={
                    "bmx-profile-popover__item " +
                    (p.id === active.id ? "bmx-profile-popover__item--active" : "")
                  }
                  onClick={() => handleSwitch(p.id)}
                >
                  <span
                    className="bmx-profile-popover__row-avatar"
                    aria-hidden="true"
                  >
                    {initialsFor(p.name)}
                  </span>
                  <span className="bmx-profile-popover__row-name">{p.name}</span>
                  {p.id === active.id && (
                    <span className="bmx-profile-popover__check" aria-hidden="true">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="bmx-profile-popover__divider" />

          <button
            type="button"
            className="bmx-profile-popover__item bmx-profile-popover__item--ghost"
            onClick={handleCreate}
          >
            <span className="bmx-profile-popover__row-avatar bmx-profile-popover__row-avatar--plus">+</span>
            <span className="bmx-profile-popover__row-name">New profile</span>
          </button>

          {typeof onManage === 'function' && (
            <button
              type="button"
              className="bmx-profile-popover__item bmx-profile-popover__item--ghost"
              onClick={() => {
                setOpen(false);
                onManage();
              }}
            >
              <span className="bmx-profile-popover__row-avatar bmx-profile-popover__row-avatar--ghost">⚙</span>
              <span className="bmx-profile-popover__row-name">Manage profiles…</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
