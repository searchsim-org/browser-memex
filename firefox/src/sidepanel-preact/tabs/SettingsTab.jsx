/**
 * SettingsTab — routing rules + privacy controls + diagnostics.
 *
 * Routing rules are stored under chrome.storage.local under
 * `browser-memex.policy`. The service worker reads this when constructing
 * the Router; changes take effect on the next service-worker boot.
 *
 * Privacy controls toggle per-domain memory capture flags.
 */

import { useState, useEffect, useCallback } from "preact/hooks";
import { useTheme } from "../hooks/useTheme.js";
import { useServicesRpc } from "../hooks/useServicesRpc.js";
import { useProfileChange } from "../hooks/useProfileChange.js";
import { DeveloperSection } from "../components/DeveloperSection.jsx";
import { ManageProfilesSection } from "../components/ManageProfilesSection.jsx";
import { RelaySection } from "../components/RelaySection.jsx";

const DEFAULT_POLICY = {
  rules: [],
  fallback: "claude-code",
  overrides: [],
  llmFallbackEnabled: false,
};

const DEFAULT_PRIVACY = { memoryEnabled: true, disabledDomains: [] };

export function SettingsTab() {
  const rpc = useServicesRpc();
  const { pref: themePref, setTheme } = useTheme();
  const [activeProfile, setActiveProfile] = useState(null);
  const [policyJson, setPolicyJson] = useState(JSON.stringify(DEFAULT_POLICY, null, 2));
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [domainsText, setDomainsText] = useState("");
  const [status, setStatus] = useState(null);

  const loadActive = useCallback(async () => {
    const p = await rpc.profiles.getActive();
    setActiveProfile(p);
    setPolicyJson(JSON.stringify(p.policy ?? DEFAULT_POLICY, null, 2));
    const pv = p.privacy ?? DEFAULT_PRIVACY;
    setPrivacy(pv);
    setDomainsText((pv.disabledDomains ?? []).join("\n"));
  }, [rpc]);

  useEffect(() => {
    loadActive().catch((e) => setStatus(`Error: ${e.message}`));
  }, [loadActive]);
  useProfileChange(loadActive);

  const savePolicy = useCallback(async () => {
    try {
      const parsed = JSON.parse(policyJson);
      if (!Array.isArray(parsed.rules)) throw new Error("policy.rules must be an array");
      if (typeof parsed.fallback !== "string") throw new Error("policy.fallback must be a string");
      await rpc.profiles.update(activeProfile.id, { policy: parsed });
      await loadActive();
      setStatus("Policy saved for this profile. Applies on next service-worker reload.");
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  }, [policyJson, rpc, activeProfile, loadActive]);

  const savePrivacy = useCallback(async () => {
    const domains = domainsText.split("\n").map((d) => d.trim()).filter(Boolean);
    const next = { ...privacy, disabledDomains: domains };
    await rpc.profiles.update(activeProfile.id, { privacy: next });
    setPrivacy(next);
    setStatus("Privacy settings saved for this profile.");
  }, [privacy, domainsText, rpc, activeProfile]);

  return (
    <div className="bmx-tab">
      <header className="bmx-tab__header">
        <h2>Settings</h2>
        {activeProfile && (
          <span className="bmx-badge bmx-badge--muted">
            Profile: {activeProfile.name}
          </span>
        )}
      </header>
      {status && <div className={status.startsWith("Error") ? "bmx-error" : "bmx-success"}>{status}</div>}

      <ManageProfilesSection rpc={rpc} onChange={loadActive} />

      <section className="bmx-section">
        <h3>Routing policy</h3>
        <p className="bmx-hint">
          Edit the Router policy as JSON. Format: <code>{`{ rules, fallback, overrides?, llmFallbackEnabled? }`}</code>
        </p>
        <textarea
          rows={14}
          spellcheck={false}
          value={policyJson}
          onInput={(e) => setPolicyJson(e.currentTarget.value)}
          style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}
        />
        <div className="bmx-form__actions">
          <button onClick={() => setPolicyJson(JSON.stringify(DEFAULT_POLICY, null, 2))}>Reset</button>
          <button onClick={savePolicy} className="bmx-btn bmx-btn--primary">Save policy</button>
        </div>
      </section>

      <section className="bmx-section">
        <h3>Privacy</h3>
        <label className="bmx-toggle">
          <input
            type="checkbox"
            checked={privacy.memoryEnabled}
            onChange={(e) => setPrivacy({ ...privacy, memoryEnabled: e.currentTarget.checked })}
          />
          Capture memory while agents browse
        </label>
        <label>
          Disabled domains (one per line) — memory is never captured on these hosts
          <textarea
            rows={5}
            value={domainsText}
            placeholder="bank.example.com&#10;health.example.com"
            onInput={(e) => setDomainsText(e.currentTarget.value)}
          />
        </label>
        <div className="bmx-form__actions">
          <button onClick={savePrivacy} className="bmx-btn bmx-btn--primary">Save privacy</button>
        </div>
      </section>

      <section className="bmx-section">
        <h3>Appearance</h3>
        <label>
          Theme
          <select className="bmx-select" value={themePref} onChange={(e) => setTheme(e.currentTarget.value)}>
            <option value="auto">Match system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </section>

      <RelaySection />

      <DeveloperSection />

      <section className="bmx-section">
        <h3>Diagnostics</h3>
        <p className="bmx-hint">
          See <code>docs/dev/</code> for storage layer details. To export a diagnostic bundle,
          use <code>llm-browser logs &lt;session_id&gt;</code> from the MCP server CLI.
        </p>
      </section>
    </div>
  );
}
