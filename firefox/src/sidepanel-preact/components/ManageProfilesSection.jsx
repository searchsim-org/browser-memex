/**
 * ManageProfilesSection — full profile CRUD for the Settings tab.
 *
 * Quick-switch lives in the rail avatar popover; this section covers the
 * heavier operations: rename, duplicate, delete, export (JSON envelope).
 *
 * Profiles are the workspace identity in BrowserMemex — switching one
 * swaps the active policy, privacy, skills, tasks, and memory scope.
 */

import { useState, useEffect, useCallback } from 'preact/hooks';
import { showConfirm, showPrompt } from '../hooks/useDialog.js';
import { showToast } from '../hooks/useToast.js';

function initialsFor(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function ManageProfilesSection({ rpc, onChange }) {
  const [profiles, setProfiles] = useState([]);
  const [active, setActive] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [list, a] = await Promise.all([
        rpc.profiles.list(),
        rpc.profiles.getActive(),
      ]);
      setProfiles(list);
      setActive(a);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [rpc]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleCreate = useCallback(async () => {
    const name = await showPrompt('Name for the new profile', '', {
      title: 'New profile',
      placeholder: 'e.g. Work, Personal, Research',
      okLabel: 'Create',
    });
    if (!name?.trim()) return;
    try {
      await rpc.profiles.create({ name: name.trim() });
      await refresh();
      onChange?.();
    } catch (e) {
      setError(e.message);
    }
  }, [rpc, refresh, onChange]);

  const handleDuplicate = useCallback(
    async (p) => {
      const newName = await showPrompt(`Duplicate "${p.name}" as`, `${p.name} (copy)`, {
        title: 'Duplicate profile',
        okLabel: 'Duplicate',
      });
      if (!newName?.trim()) return;
      try {
        await rpc.profiles.duplicate(p.id, newName.trim());
        await refresh();
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, refresh]
  );

  const handleDelete = useCallback(
    async (p) => {
      const ok = await showConfirm(
        `Delete profile "${p.name}"?\n\nTasks, skills, and memory tied to this profile will become orphaned.`,
        { title: 'Delete profile', okLabel: 'Delete', destructive: true }
      );
      if (!ok) return;
      try {
        await rpc.profiles.delete(p.id);
        await refresh();
        onChange?.();
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, refresh, onChange]
  );

  const handleSwitch = useCallback(
    async (id) => {
      try {
        await rpc.profiles.setActive(id);
        await refresh();
        onChange?.();
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, refresh, onChange]
  );

  const handleExport = useCallback(
    async (p) => {
      const fresh = await rpc.profiles.get(p.id);
      const envelope = {
        type: 'browser-memex.profile.v1',
        exportedAt: Date.now(),
        profile: fresh,
      };
      try {
        await navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
        setError(null);
        setEditingId(null);
        showToast(`Profile "${p.name}" copied to clipboard`, { kind: 'success' });
      } catch (e) {
        setError(`Couldn't copy to clipboard: ${e.message}`);
      }
    },
    [rpc]
  );

  const handleStartRename = (p) => {
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const handleCommitRename = useCallback(
    async (p) => {
      const trimmed = editingName.trim();
      if (!trimmed || trimmed === p.name) {
        setEditingId(null);
        return;
      }
      try {
        await rpc.profiles.update(p.id, { name: trimmed });
        setEditingId(null);
        await refresh();
        onChange?.();
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, editingName, refresh, onChange]
  );

  return (
    <section className="bmx-section">
      <h3>Profiles</h3>
      <p className="bmx-hint">
        A profile is a workspace — its own routing policy, privacy, skills, tasks,
        and memory. Switching profiles swaps every per-profile thing at once.
      </p>
      {error && <div className="bmx-error">{error}</div>}

      <ul className="bmx-profile-list">
        {profiles.map((p) => {
          const isActive = active?.id === p.id;
          return (
            <li key={p.id} className={`bmx-profile-list__item ${isActive ? 'bmx-profile-list__item--active' : ''}`}>
              <span
                className="bmx-profile-list__avatar"
                aria-hidden="true"
              >
                {initialsFor(p.name)}
              </span>
              <div className="bmx-profile-list__main">
                {editingId === p.id ? (
                  <input
                    type="text"
                    autoFocus
                    value={editingName}
                    onInput={(e) => setEditingName(e.currentTarget.value)}
                    onBlur={() => handleCommitRename(p)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommitRename(p);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="bmx-profile-list__name"
                    onClick={() => handleSwitch(p.id)}
                    title={isActive ? 'Active profile' : 'Switch to this profile'}
                  >
                    {p.name}
                    {isActive && <span className="bmx-badge bmx-badge--ok"> active</span>}
                  </button>
                )}
              </div>
              <div className="bmx-profile-list__actions">
                <button onClick={() => handleStartRename(p)} title="Rename">Rename</button>
                <button onClick={() => handleDuplicate(p)} title="Duplicate">Duplicate</button>
                <button onClick={() => handleExport(p)} title="Copy JSON envelope to clipboard">Export</button>
                <button
                  onClick={() => handleDelete(p)}
                  disabled={isActive || profiles.length <= 1}
                  title={isActive ? 'Switch profile first' : 'Delete profile'}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="bmx-form__actions" style={{ marginTop: 8 }}>
        <button onClick={handleCreate} className="bmx-btn bmx-btn--primary">
          + New profile
        </button>
      </div>
    </section>
  );
}
