/**
 * OnboardingWizard — first-run experience.
 *
 * Three short steps:
 *   1. Pick installed agents (from AvailabilitySnapshot)
 *   2. Configure privacy (memory capture + blocked hosts)
 *   3. Done — link to Tasks tab
 *
 * Shown once; "browser-memex.onboardedAt" is written to chrome.storage.local
 * the first time the wizard finishes. Users can re-run from Settings.
 */

import { useState, useEffect } from "preact/hooks";
import { useServicesRpc } from "../hooks/useServicesRpc.js";
import { t } from "@browser-memex/core/i18n";

export function OnboardingWizard({ onFinish, onSkip }) {
  const rpc = useServicesRpc();
  const [step, setStep] = useState(0);
  const [availability, setAvailability] = useState(null);
  const [chosenAgents, setChosenAgents] = useState(new Set());
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [blockedDomains, setBlockedDomains] = useState("");
  const [profileName, setProfileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    rpc.profiles.getActive().then((p) => {
      setProfileName(p?.name || "");
    }).catch(() => {});
    rpc.agents.availability().then((a) => {
      setAvailability(a);
      setChosenAgents(new Set(a?.installed ?? []));
    }).catch(() => {
      setAvailability({ installed: [], configured: [] });
    });
  }, [rpc]);

  function toggle(id) {
    setChosenAgents((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function finish() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const profile = await rpc.profiles.getActive();
      const domains = blockedDomains
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean);
      const patch = {
        activeAgents: [...chosenAgents],
        privacy: { memoryEnabled, disabledDomains: domains },
      };
      if (profileName.trim() && profileName.trim() !== profile.name) {
        patch.name = profileName.trim();
      }
      await rpc.profiles.update(profile.id, patch);
      onFinish();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bmx-onboarding" role="dialog" aria-labelledby="bmx-onboarding-title">
      <div className="bmx-onboarding__card">
        <h2 id="bmx-onboarding-title">{t("onboarding.welcome")}</h2>
        <p className="bmx-hint">{t("onboarding.intro")}</p>

        <div className="bmx-onboarding__stepdots" aria-label="Setup progress">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={
                "bmx-onboarding__dot " +
                (i === step ? "bmx-onboarding__dot--active" : "")
              }
              aria-current={i === step ? "step" : undefined}
            />
          ))}
        </div>

        {step === 0 && (
          <section>
            <h3>{t("onboarding.step1")}</h3>
            {!availability ? (
              <p className="bmx-hint">{t("common.loading")}</p>
            ) : (
              <ul className="bmx-list">
                {(availability.installed ?? []).map((id) => (
                  <li key={id} className="bmx-list__item">
                    <label className="bmx-toggle">
                      <input
                        type="checkbox"
                        checked={chosenAgents.has(id)}
                        onChange={() => toggle(id)}
                      />
                      <span>{id}</span>
                    </label>
                  </li>
                ))}
                {(availability.installed ?? []).length === 0 && (
                  <li className="bmx-empty">
                    No agents detected yet. You can install BrowserMemex into an
                    agent's MCP config later via{" "}
                    <code>llm-browser agents install &lt;id&gt;</code>.
                  </li>
                )}
              </ul>
            )}
          </section>
        )}

        {step === 1 && (
          <section>
            <h3>{t("onboarding.step2")}</h3>
            <p className="bmx-hint">
              List one host per line. Subdomains are included. Example:
              <br />
              <code>bank.com</code> blocks <code>login.bank.com</code> too.
            </p>
            <textarea
              rows={6}
              value={blockedDomains}
              onInput={(e) => setBlockedDomains(e.currentTarget.value)}
              placeholder="bank.example.com&#10;health.example.com"
              aria-label="Blocked domains"
            />
          </section>
        )}

        {step === 2 && (
          <section>
            <h3>{t("onboarding.step3")}</h3>
            <label>
              Name this workspace (a "profile" — you can switch between several
              from the avatar at the bottom-right)
              <input
                type="text"
                value={profileName}
                onInput={(e) => setProfileName(e.currentTarget.value)}
                placeholder="Default"
              />
            </label>
            <label className="bmx-toggle" style={{ marginTop: 12 }}>
              <input
                type="checkbox"
                checked={memoryEnabled}
                onChange={(e) => setMemoryEnabled(e.currentTarget.checked)}
              />
              {t("settings.captureMemory")}
            </label>
            <p className="bmx-hint">
              All memory stays on your device. The disabled-domain list from the
              previous step always overrides this.
            </p>
            <p className="bmx-hint" style={{ marginTop: 12 }}>
              <strong>Connect a coding agent</strong> once you're done — open the
              Agents tab and click "Connect" next to Claude Code / Cursor /
              Codex / Gemini CLI / whatever you use. Your memex follows you
              across all of them.
            </p>
          </section>
        )}

        <div className="bmx-form__actions">
          <button type="button" onClick={onSkip} className="bmx-btn">
            {t("onboarding.skip")}
          </button>
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="bmx-btn">
              {t("onboarding.back")}
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="bmx-btn bmx-btn--primary"
            >
              {t("onboarding.next")}
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="bmx-btn bmx-btn--primary"
              disabled={submitting}
            >
              {submitting ? t("common.loading") : t("onboarding.finish")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
