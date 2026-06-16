/**
 * RegistryTab — browse curated MCP servers + copy install snippets.
 *
 * Pulls from @browser-memex/core/mcp-registry. Server-side detection of
 * which agent is targeted lives in the MCP server CLI (`llm-browser agents
 * install <id>`); this UI surfaces the catalog and produces JSON snippets
 * users can paste manually if they prefer.
 */

import { useMemo, useState } from "preact/hooks";
import {
  ALL_MCP_SERVERS,
  searchServers,
  buildConfigEntry,
} from "@browser-memex/core/mcp-registry";

export function RegistryTab() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const allTags = useMemo(() => {
    const s = new Set();
    for (const srv of ALL_MCP_SERVERS) for (const t of srv.tags ?? []) s.add(t);
    return [...s].sort();
  }, []);

  const filtered = useMemo(() => {
    let r = searchServers(query);
    if (tag) r = r.filter((s) => (s.tags ?? []).includes(tag));
    return r;
  }, [query, tag]);

  async function copyConfig(server) {
    const entry = buildConfigEntry(server);
    const json = JSON.stringify(
      { mcpServers: { [server.id]: entry } },
      null,
      2
    );
    await navigator.clipboard.writeText(json);
    setCopied(server.id);
    setTimeout(() => setCopied((c) => (c === server.id ? null : c)), 2000);
  }

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <h2>MCP Server Registry</h2>
        <span className="bmx-badge">{filtered.length} servers</span>
      </header>

      <p className="bmx-hint">
        Curated catalog of MCP servers your connected agents can use. Click
        “Copy config” and paste the snippet into your agent's <code>mcpServers</code> map.
      </p>

      <div className="bmx-search">
        <input
          type="search"
          placeholder="Filter servers…"
          value={query}
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
        <select className="bmx-select bmx-select--compact" value={tag} onChange={(e) => setTag(e.currentTarget.value)}>
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <ul className="bmx-list">
        {filtered.map((s) => {
          const isOpen = expanded === s.id;
          return (
            <li key={s.id} className="bmx-list__item">
              <div className="bmx-list__main">
                <div className="bmx-list__title">
                  {s.displayName}
                  {s.official && <span className="bmx-badge bmx-badge--ok"> official</span>}
                </div>
                <div className="bmx-list__meta">
                  <span>{s.vendor}</span>
                  <span>·</span>
                  <span>{s.transport}</span>
                  {(s.tags ?? []).map((t) => (
                    <span key={t} className="bmx-badge bmx-badge--muted">{t}</span>
                  ))}
                </div>
                <div className="bmx-list__hint">{s.description}</div>
              </div>
              <div className="bmx-list__actions">
                <button onClick={() => copyConfig(s)}>
                  {copied === s.id ? "Copied ✓" : "Copy config"}
                </button>
                <button onClick={() => setExpanded(isOpen ? null : s.id)}>
                  {isOpen ? "Hide" : "Show JSON"}
                </button>
                {s.homepage && (
                  <a href={s.homepage} target="_blank" rel="noreferrer noopener" className="bmx-btn">
                    Docs
                  </a>
                )}
              </div>
              {isOpen && (
                <pre className="bmx-pre">
                  {JSON.stringify({ mcpServers: { [s.id]: buildConfigEntry(s) } }, null, 2)}
                </pre>
              )}
              {(s.install.requiredEnv ?? []).length > 0 && (
                <div className="bmx-list__hint">
                  ⚠ Requires env vars: {s.install.requiredEnv.join(", ")}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
