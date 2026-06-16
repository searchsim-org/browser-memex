/**
 * AgentsTab — show installed/configured agents from the AvailabilitySnapshot.
 *
 * The actual `agents detect` / `agents install` CLI lives in the MCP server
 * (Node) and can't run inside the service worker (no filesystem). The side
 * panel surfaces the cached snapshot and a refresh button that invalidates
 * the cache; users do install/uninstall via the CLI for now.
 */

import { useState, useEffect, useCallback } from "preact/hooks";
import { useServicesRpc } from "../hooks/useServicesRpc.js";
import { useConfig } from "../hooks/useConfig.js";
import { ModelsSection } from "../components/ModelsSection.jsx";
import { ConnectAgentWizard } from "../components/ConnectAgentWizard.jsx";

const AGENT_DISPLAY = {
  "claude-code": { name: "Claude Code", vendor: "Anthropic" },
  cursor: { name: "Cursor", vendor: "Anysphere" },
  codex: { name: "Codex CLI", vendor: "OpenAI" },
  "gemini-cli": { name: "Gemini CLI", vendor: "Google" },
  vscode: { name: "Visual Studio Code", vendor: "Microsoft" },
  windsurf: { name: "Windsurf", vendor: "Codeium" },
  cline: { name: "Cline", vendor: "Cline" },
  "roo-code": { name: "Roo Code", vendor: "Roo Veterinary Inc." },
  amp: { name: "Amp", vendor: "Sourcegraph" },
};

const ALL_IDS = Object.keys(AGENT_DISPLAY);

export function AgentsTab() {
  const rpc = useServicesRpc();
  const config = useConfig();
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectingAgentId, setConnectingAgentId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const a = await rpc.agents.availability();
      setAvailability(a);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [rpc]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    await rpc.agents.invalidateAvailability();
    await load();
  }, [rpc, load]);

  if (loading && !availability) {
    return <div className="bmx-empty">Loading agents…</div>;
  }

  const installed = new Set(availability?.installed ?? []);
  const configured = new Set(availability?.configured ?? []);

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <h2>Agents</h2>
        <button onClick={refresh} className="bmx-btn">Refresh</button>
      </header>
      {error && <div className="bmx-error">{error}</div>}

      {!config.isLoading && <ModelsSection config={config} />}

      <section className="bmx-section">
        <h3>Coding agents</h3>
        <p className="bmx-hint">
          External AI coding tools BrowserMemex can connect to. Detection runs via the MCP server.
          Install BrowserMemex into an agent with <code>llm-browser agents install &lt;id&gt;</code>.
        </p>

        <ul className="bmx-list">
          {ALL_IDS.map((id) => {
            const meta = AGENT_DISPLAY[id];
            const isInstalled = installed.has(id);
            const isConfigured = configured.has(id);
            return (
              <li key={id} className="bmx-list__item">
                <div className="bmx-list__main">
                  <div className="bmx-list__title">
                    {meta.name}
                    {isInstalled && <span className="bmx-badge bmx-badge--ok"> installed</span>}
                    {isConfigured && <span className="bmx-badge bmx-badge--ok"> configured</span>}
                    {!isInstalled && <span className="bmx-badge bmx-badge--muted"> not detected</span>}
                  </div>
                  <div className="bmx-list__meta">{meta.vendor}</div>
                </div>
                <div className="bmx-list__actions">
                  <button
                    className="bmx-btn"
                    onClick={() => setConnectingAgentId(id)}
                  >
                    Connect
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {connectingAgentId && (
        <ConnectAgentWizard
          agentId={connectingAgentId}
          onClose={() => setConnectingAgentId(null)}
        />
      )}
    </div>
  );
}
