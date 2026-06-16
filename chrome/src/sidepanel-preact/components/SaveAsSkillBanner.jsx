/**
 * SaveAsSkillBanner — Phase E.1 self-teaching surface.
 *
 * After a successful chat task the agent's trajectory is stashed on the
 * chat hook. This banner offers a one-click "Save this run as a skill"
 * action that turns the trajectory into a stored, named, reusable workflow
 * — which any other agent (via memex_skills_run) can then invoke. That's
 * the "agent taught itself how to use the skill, now it can teach other
 * agents" loop.
 */

import { useState } from 'preact/hooks';
import { useServicesRpc } from '../hooks/useServicesRpc.js';

export function SaveAsSkillBanner({ trajectory, onDismiss }) {
  const rpc = useServicesRpc();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [savedSkill, setSavedSkill] = useState(null);
  const [name, setName] = useState(trajectory?.title?.slice(0, 60) ?? 'New skill');
  const [editing, setEditing] = useState(false);

  if (!trajectory || savedSkill) {
    return savedSkill ? (
      <div className="bmx-save-banner bmx-save-banner--done">
        <span>Saved as skill: <strong>{savedSkill.name}</strong></span>
        <button type="button" onClick={onDismiss}>Dismiss</button>
      </div>
    ) : null;
  }

  const onSave = async () => {
    setBusy(true);
    setError(null);
    try {
      const proposal = await rpc.skills.proposeFromTrajectory(trajectory);
      const skill = await rpc.skills.confirmProposal(proposal, name.trim());
      setSavedSkill(skill);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bmx-save-banner">
      <div className="bmx-save-banner__main">
        <strong>Save this run as a skill?</strong>
        <p className="bmx-hint">
          {trajectory.steps?.length ?? 0} step(s) recorded. Once saved, any
          agent connected via MCP can re-run it via <code>memex_skills_run</code>.
        </p>
      </div>
      <div className="bmx-save-banner__actions">
        {editing ? (
          <input
            type="text"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="Skill name"
            autoFocus
          />
        ) : (
          <button type="button" onClick={() => setEditing(true)}>
            Name: {name}
          </button>
        )}
        <button
          type="button"
          className="bmx-btn bmx-btn--primary"
          onClick={onSave}
          disabled={busy || !name.trim()}
        >
          {busy ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onDismiss}>Not now</button>
      </div>
      {error && <div className="bmx-error">{error}</div>}
    </div>
  );
}
