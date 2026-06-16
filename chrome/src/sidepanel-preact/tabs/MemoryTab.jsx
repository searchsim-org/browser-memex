/**
 * MemoryTab — search and inspect WebNugget memory.
 */

import { useState, useEffect, useCallback } from "preact/hooks";
import { useServicesRpc } from "../hooks/useServicesRpc.js";
import { useProfileChange } from "../hooks/useProfileChange.js";

export function MemoryTab() {
  const rpc = useServicesRpc();
  const [count, setCount] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [view, setView] = useState("active");
  const [error, setError] = useState(null);

  const refreshCount = useCallback(() => {
    rpc.memory.count().then(setCount).catch((e) => setError(e.message));
  }, [rpc]);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);
  useProfileChange(() => {
    refreshCount();
    setResults([]);
    setQuery("");
  });

  const search = useCallback(
    async (e) => {
      e?.preventDefault?.();
      try {
        const hits = await rpc.memory.query(query.trim(), {
          time: Date.now(),
          view,
          topK: 50,
        });
        setResults(hits);
      } catch (err) {
        setError(err.message);
      }
    },
    [rpc, query, view]
  );

  const startTagging = useCallback(async () => {
    try {
      const target =
        typeof globalThis.browser !== 'undefined' && globalThis.browser?.tabs
          ? globalThis.browser
          : chrome;
      const [tab] = await new Promise((resolve) =>
        target.tabs.query({ active: true, currentWindow: true }, resolve)
      );
      if (!tab?.id) return;
      target.tabs.sendMessage(tab.id, { type: 'bmx-tagging.start' });
    } catch (e) {
      setError(e.message);
    }
  }, []);

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <h2>Memory</h2>
        <div className="bmx-tab__header-actions">
          {count !== null && <span className="bmx-badge">{count} nuggets</span>}
          <button onClick={startTagging} className="bmx-btn" title="Click an element on the active tab to tag it">
            Tag element
          </button>
        </div>
      </header>
      {error && <div className="bmx-error">{error}</div>}

      <form className="bmx-search bmx-search--with-filter" onSubmit={search}>
        <div className="bmx-search__input-wrap">
          <svg className="bmx-search__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search facts…"
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}
          />
        </div>
        <select
          className="bmx-select bmx-select--compact"
          value={view}
          onChange={(e) => setView(e.currentTarget.value)}
          aria-label="Filter view"
        >
          <option value="active">Active only</option>
          <option value="active_plus_contested">Include contested</option>
        </select>
        <button type="submit" className="bmx-btn bmx-btn--primary">Search</button>
      </form>

      {results.length === 0 ? (
        <div className="bmx-empty bmx-empty--card">
          <svg className="bmx-empty__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <p>{query ? "No matching nuggets." : "Type a query and press Search."}</p>
        </div>
      ) : (
        <ul className="bmx-list">
          {results.map(({ nugget, score }) => (
            <NuggetRow key={nugget.id} nugget={nugget} score={score} rpc={rpc} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NuggetRow({ nugget, score, rpc }) {
  const [provenance, setProvenance] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);

  const toggleProvenance = useCallback(async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (provenance) return;
    setLoadingProv(true);
    try {
      const rows = await rpc.memory.provenance(nugget.id);
      setProvenance(rows || []);
    } catch {
      setProvenance([]);
    } finally {
      setLoadingProv(false);
    }
  }, [rpc, nugget.id, provenance, open]);

  return (
    <li className={`bmx-list__item bmx-status--${nugget.epistemic.status.toLowerCase()}`}>
      <div className="bmx-list__title">
        {nugget.fact.subject} — {nugget.fact.predicate} — <strong>{String(nugget.fact.object)}</strong>
      </div>
      <div className="bmx-list__meta">
        <span>{nugget.epistemic.status}</span>
        <span>·</span>
        <span>scope: {nugget.validity.scope}</span>
        {nugget.validity.location && (
          <>
            <span>·</span>
            <span>from {nugget.validity.location}</span>
          </>
        )}
        <span>·</span>
        <span>score: {score.toFixed(2)}</span>
      </div>
      <div className="bmx-list__hint">
        Valid {new Date(nugget.validity.start).toLocaleDateString()} →{" "}
        {nugget.validity.end ? new Date(nugget.validity.end).toLocaleDateString() : "∞"}
      </div>
      <button
        type="button"
        className={`bmx-list__toggle ${open ? "is-open" : ""}`}
        onClick={toggleProvenance}
        aria-expanded={open}
      >
        <svg className="bmx-list__toggle-caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg>
        Sources
      </button>
      {open && (
        <div className="bmx-provenance">
          {loadingProv && <div className="bmx-hint">Loading sources…</div>}
          {!loadingProv && provenance?.length === 0 && (
            <div className="bmx-hint">No recorded sources.</div>
          )}
          {!loadingProv && provenance?.length > 0 && (
            <ul className="bmx-provenance__list">
              {provenance.map((p, i) => (
                <li key={i} className="bmx-provenance__item">
                  <a
                    href={p.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="bmx-provenance__url"
                    title={p.sourceUrl}
                  >
                    {p.pageTitle || p.sourceUrl}
                  </a>
                  <div className="bmx-provenance__meta">
                    {p.agentId && <span>via {p.agentId}</span>}
                    {p.extractedAt && (
                      <>
                        {p.agentId && <span> · </span>}
                        <span>{new Date(p.extractedAt).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
