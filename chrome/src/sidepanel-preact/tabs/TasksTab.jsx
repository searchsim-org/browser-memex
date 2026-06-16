/**
 * TasksTab — list, create, inspect tasks.
 *
 * Connects to services via useServicesRpc. List refreshes on mount and after
 * any mutating action (create / cancel / pause / resume).
 */

import { useState, useEffect, useCallback } from "preact/hooks";
import { useServicesRpc } from "../hooks/useServicesRpc.js";
import { useProfileChange } from "../hooks/useProfileChange.js";

const TASK_KINDS = [
  { id: "one_shot", label: "One-shot" },
  { id: "scheduled", label: "Scheduled" },
  { id: "recurring", label: "Recurring (every N hours)" },
  { id: "watcher", label: "Watcher (notify on condition)" },
  { id: "tracker", label: "Tracker (record values)" },
];

const CAPABILITIES = [
  { id: "read_only", label: "Read only" },
  { id: "read_with_network", label: "Read + network" },
  { id: "write_dom", label: "Write DOM" },
  { id: "write_network", label: "Write network (prompt)" },
  { id: "destructive", label: "Destructive (always prompt)" },
];

export function TasksTab() {
  const rpc = useServicesRpc();
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const list = await rpc.tasks.list({ limit: 100 });
      setTasks(list);
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
        await rpc.tasks.create(spec);
        setShowCreate(false);
        await refresh();
      } catch (e) {
        setError(e.message);
      }
    },
    [rpc, refresh]
  );

  if (selected) {
    return <TaskDetail taskId={selected} onClose={() => setSelected(null)} rpc={rpc} />;
  }

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <h2>Tasks</h2>
        <button type="button" onClick={() => setShowCreate(true)} className="bmx-btn bmx-btn--primary">
          + New task
        </button>
      </header>
      {error && <div className="bmx-error">{error}</div>}
      {showCreate && <CreateTaskForm onCreate={onCreate} onCancel={() => setShowCreate(false)} />}
      <TaskList tasks={tasks} onSelect={setSelected} onRefresh={refresh} rpc={rpc} />
    </div>
  );
}

function TaskList({ tasks, onSelect, onRefresh, rpc }) {
  if (tasks.length === 0) {
    return (
      <div className="bmx-empty">
        <p>No tasks yet. Use “+ New task” above to schedule one.</p>
      </div>
    );
  }
  return (
    <ul className="bmx-list">
      {tasks.map((t) => (
        <li key={t.id} className={`bmx-list__item bmx-status--${t.status}`}>
          <button className="bmx-list__main" onClick={() => onSelect(t.id)}>
            <div className="bmx-list__title">{t.title}</div>
            <div className="bmx-list__meta">
              <span>{t.kind}</span>
              <span>·</span>
              <span>{t.status}</span>
              {t.nextRunAt && (
                <>
                  <span>·</span>
                  <span>next: {new Date(t.nextRunAt).toLocaleString()}</span>
                </>
              )}
            </div>
          </button>
          <div className="bmx-list__actions">
            {t.status === "pending" && (
              <button onClick={() => rpc.tasks.pause(t.id).then(onRefresh)}>Pause</button>
            )}
            {t.status === "paused" && (
              <button onClick={() => rpc.tasks.resume(t.id).then(onRefresh)}>Resume</button>
            )}
            {t.status !== "completed" && t.status !== "cancelled" && (
              <button onClick={() => rpc.tasks.cancel(t.id).then(onRefresh)}>Cancel</button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function CreateTaskForm({ onCreate, onCancel }) {
  const rpc = useServicesRpc();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("one_shot");
  const [url, setUrl] = useState("");
  const [capability, setCapability] = useState("read_with_network");
  const [intervalHours, setIntervalHours] = useState(1);
  const [includeOpenTabs, setIncludeOpenTabs] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const payload = { url: url.trim(), instruction: description.trim() };
    if (includeOpenTabs) {
      try {
        const openTabs = await rpc.tabContext.collect({ maxTabs: 25 });
        payload.openTabs = openTabs;
      } catch (err) {
        // If collection fails, proceed without context rather than block the task
        payload.openTabsError = err.message;
      }
    }
    const spec = {
      kind,
      title: title.trim() || "Untitled task",
      description: description.trim() || null,
      payload,
      capability,
      creator: "user",
    };
    if (["recurring", "watcher", "tracker"].includes(kind)) {
      spec.schedule = {
        kind: "interval",
        everyMs: Math.max(1, Number(intervalHours)) * 60 * 60 * 1000,
      };
    }
    if (kind === "watcher") {
      spec.watcher = { kind: "value_changed" };
    }
    setSubmitting(false);
    onCreate(spec);
  }

  return (
    <form className="bmx-form" onSubmit={submit}>
      <label>
        Title
        <input value={title} onInput={(e) => setTitle(e.currentTarget.value)} required />
      </label>
      <label>
        Description / instruction
        <textarea
          rows={3}
          value={description}
          onInput={(e) => setDescription(e.currentTarget.value)}
        />
      </label>
      <label>
        URL
        <input type="url" value={url} onInput={(e) => setUrl(e.currentTarget.value)} />
      </label>
      <label>
        Kind
        <select className="bmx-select" value={kind} onChange={(e) => setKind(e.currentTarget.value)}>
          {TASK_KINDS.map((k) => (
            <option key={k.id} value={k.id}>{k.label}</option>
          ))}
        </select>
      </label>
      {["recurring", "watcher", "tracker"].includes(kind) && (
        <label>
          Every N hours
          <input
            type="number"
            min={1}
            value={intervalHours}
            onInput={(e) => setIntervalHours(e.currentTarget.value)}
          />
        </label>
      )}
      <label>
        Capability
        <select className="bmx-select" value={capability} onChange={(e) => setCapability(e.currentTarget.value)}>
          {CAPABILITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </label>
      <label className="bmx-toggle">
        <input
          type="checkbox"
          checked={includeOpenTabs}
          onChange={(e) => setIncludeOpenTabs(e.currentTarget.checked)}
        />
        Include my open tabs as context
        <span className="bmx-list__hint">
          Sends a sanitized list of currently-open tabs (incognito and
          blocked-host tabs excluded; URL credentials stripped)
        </span>
      </label>
      <div className="bmx-form__actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" className="bmx-btn bmx-btn--primary" disabled={submitting}>
          {submitting ? "Creating…" : "Create"}
        </button>
      </div>
    </form>
  );
}

function TaskDetail({ taskId, onClose, rpc }) {
  const [task, setTask] = useState(null);
  const [runs, setRuns] = useState([]);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = await rpc.tasks.get(taskId);
      if (cancelled) return;
      setTask(t);
      const r = await rpc.tasks.runs(taskId, 50);
      if (cancelled) return;
      setRuns(r);
      if (t?.kind === "tracker") {
        const s = await rpc.tasks.trackerSamples(taskId, 50);
        if (!cancelled) setSamples(s);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [taskId, rpc]);

  if (!task) return <div className="bmx-empty">Loading…</div>;

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <button type="button" onClick={onClose} className="bmx-btn">← Back</button>
        <h2>{task.title}</h2>
      </header>
      <dl className="bmx-detail">
        <dt>Kind</dt><dd>{task.kind}</dd>
        <dt>Status</dt><dd>{task.status}</dd>
        <dt>Runs</dt><dd>{task.runCount} (failures: {task.failureCount})</dd>
        <dt>Created</dt><dd>{new Date(task.createdAt).toLocaleString()}</dd>
        {task.nextRunAt && <><dt>Next run</dt><dd>{new Date(task.nextRunAt).toLocaleString()}</dd></>}
      </dl>

      {samples.length > 0 && (
        <section className="bmx-section">
          <h3>Tracker samples</h3>
          <ul className="bmx-list">
            {samples.map((s) => (
              <li key={s.id} className="bmx-list__item">
                <span>{new Date(s.recordedAt).toLocaleString()}</span>
                <span>{s.value ?? s.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bmx-section">
        <h3>Run history</h3>
        <ul className="bmx-list">
          {runs.map((r) => (
            <li key={r.id} className={`bmx-list__item bmx-status--${r.status}`}>
              <div>
                <div>{new Date(r.startedAt).toLocaleString()}</div>
                <div className="bmx-list__meta">
                  {r.status} {r.routing?.chosenAgentId && `· ${r.routing.chosenAgentId}`}
                  {r.cost?.usd != null && ` · $${r.cost.usd.toFixed(4)}`}
                </div>
                {r.error && <div className="bmx-error-inline">{r.error}</div>}
                {r.routing?.explanation && <div className="bmx-list__hint">{r.routing.explanation}</div>}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
