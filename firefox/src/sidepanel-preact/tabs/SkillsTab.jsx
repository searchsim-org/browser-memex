/**
 * SkillsTab — library + create + export/import.
 */

import { useState, useEffect, useCallback } from "preact/hooks";
import { useServicesRpc } from "../hooks/useServicesRpc.js";
import { useProfileChange } from "../hooks/useProfileChange.js";
import { useConfig } from "../hooks/useConfig.js";
import { DomainHintsSection } from "../components/DomainHintsSection.jsx";
import { showConfirm } from "../hooks/useDialog.js";
import { showToast } from "../hooks/useToast.js";

export function SkillsTab({ initialDraft, onDraftConsumed } = {}) {
  const rpc = useServicesRpc();
  const config = useConfig();
  const [skills, setSkills] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);
  const [importPaste, setImportPaste] = useState("");

  // When the selection toolbar fires "Turn into a skill" we open the form
  // with the selection prefilled as the description.
  useEffect(() => {
    if (initialDraft) {
      setDraft(initialDraft);
      setShowCreate(true);
      onDraftConsumed?.();
    }
  }, [initialDraft]);

  const refresh = useCallback(async () => {
    try {
      const list = await rpc.skills.list({ limit: 100 });
      setSkills(list);
    } catch (e) {
      setError(e.message);
    }
  }, [rpc]);

  useEffect(() => {
    refresh();
  }, [refresh]);
  useProfileChange(refresh);

  const onCreate = useCallback(
    async (spec) => {
      try {
        await rpc.skills.create(spec);
        setShowCreate(false);
        await refresh();
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, refresh]
  );

  const onExport = useCallback(
    async (id) => {
      try {
        const envelope = await rpc.skills.exportSkill(id);
        await navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
        showToast("Skill envelope copied to clipboard", { kind: "success" });
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc]
  );

  const onImport = useCallback(async () => {
    try {
      const envelope = JSON.parse(importPaste);
      await rpc.skills.importEnvelope(envelope);
      setImportPaste("");
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }, [rpc, importPaste, refresh]);

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <h2>Skills</h2>
        <button onClick={() => setShowCreate(true)} className="bmx-btn bmx-btn--primary">
          + New skill
        </button>
      </header>
      {error && <div className="bmx-error">{error}</div>}
      {showCreate && (
        <CreateSkillForm
          onCreate={onCreate}
          onCancel={() => { setShowCreate(false); setDraft(null); }}
          draft={draft}
        />
      )}

      <section className="bmx-section">
        <h3>Import from clipboard</h3>
        <textarea
          rows={4}
          placeholder='Paste a "browser-memex.skill.v1" envelope here'
          value={importPaste}
          onInput={(e) => setImportPaste(e.currentTarget.value)}
        />
        <button onClick={onImport} disabled={!importPaste.trim()}>Import</button>
      </section>

      {skills.length === 0 ? (
        <div className="bmx-empty">No skills yet.</div>
      ) : (
        <ul className="bmx-list">
          {skills.map((s) => (
            <li key={s.id} className={`bmx-list__item bmx-status--${s.status}`}>
              <div className="bmx-list__main">
                <div className="bmx-list__title">{s.name}</div>
                <div className="bmx-list__meta">
                  <span>v{s.version}</span>
                  <span>·</span>
                  <span>{s.steps.length} step(s)</span>
                  <span>·</span>
                  <span>{Math.round((s.provenance.successRate ?? 0) * 100)}% success ({s.provenance.confirmedRuns})</span>
                </div>
                {s.description && <div className="bmx-list__hint">{s.description}</div>}
              </div>
              <div className="bmx-list__actions">
                <button onClick={() => onExport(s.id)}>Export</button>
                {s.status === "active" ? (
                  <button onClick={() => rpc.skills.archive(s.id).then(refresh)}>Archive</button>
                ) : (
                  <button onClick={() => rpc.skills.update(s.id, { status: "active" }).then(refresh)}>
                    Unarchive
                  </button>
                )}
                <button
                  onClick={async () => {
                    const ok = await showConfirm(`Delete skill "${s.name}"?`, {
                      title: "Delete skill",
                      okLabel: "Delete",
                      destructive: true,
                    });
                    if (ok) await rpc.skills.delete(s.id).then(refresh);
                  }}
                >Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!config.isLoading && <DomainHintsSection config={config} />}
    </div>
  );
}

function CreateSkillForm({ onCreate, onCancel, draft }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(draft?.description ?? "");
  const [capability, setCapability] = useState("read_with_network");
  const [domains, setDomains] = useState(() => {
    if (!draft?.sourceUrl) return "";
    try { return new URL(draft.sourceUrl).hostname; } catch { return ""; }
  });

  function submit(e) {
    e.preventDefault();
    onCreate({
      name: name.trim(),
      description: description.trim(),
      capability,
      domains: domains.split(",").map((d) => d.trim()).filter(Boolean),
      steps: [{ id: "step-1", kind: "run_task", params: {} }],
    });
  }

  return (
    <form className="bmx-form" onSubmit={submit}>
      <label>
        Name
        <input value={name} onInput={(e) => setName(e.currentTarget.value)} required />
      </label>
      <label>
        Description
        <textarea
          rows={3}
          value={description}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
      </label>
      <label>
        Capability
        <select className="bmx-select" value={capability} onChange={(e) => setCapability(e.currentTarget.value)}>
          <option value="read_only">Read only</option>
          <option value="read_with_network">Read + network</option>
          <option value="write_dom">Write DOM</option>
          <option value="write_network">Write network</option>
          <option value="destructive">Destructive (always confirms)</option>
        </select>
      </label>
      <label>
        Authorized domains (comma-separated)
        <input value={domains} onInput={(e) => setDomains(e.currentTarget.value)} placeholder="example.com, api.example.com" />
      </label>
      <div className="bmx-form__actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="bmx-btn bmx-btn--primary">Create</button>
      </div>
    </form>
  );
}
