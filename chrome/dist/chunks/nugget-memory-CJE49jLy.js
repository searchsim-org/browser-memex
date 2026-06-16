import { p as presetForUrl, V as VALIDITY_PRESET, d as activeProfileId, e as bootProfiles, j as isBooted, s as services } from "../service-worker.js";
const UI_SIGNAL = Object.freeze({
  /** "Updated 2 hours ago" — observed at extractedAt. Fact was true as of extractedAt - secondsAgo. */
  LAST_UPDATED: "last_updated",
  /** Dashboard time-range selector ("Last 7 days"). Provides explicit start, optionally end. */
  TIME_RANGE: "time_range",
  /** A discrete event with a known date (sprint deadline, release date). */
  EVENT_DATE: "event_date",
  /** Version banner ("v2.3.1 — March 15, 2026"). */
  VERSION_BANNER: "version_banner",
  /** Explicit start without end ("since 2019", "active from Jan 1"). */
  SINCE: "since",
  /** Explicit end ("until 2024", "expires Dec 31"). */
  UNTIL: "until"
});
function inferValidity({
  extractedAt,
  sourceUrl,
  uiSignals = [],
  override
}) {
  if (!Number.isFinite(extractedAt)) {
    throw new Error("inferValidity: extractedAt must be a finite number (Unix ms)");
  }
  const preset = presetForUrl(sourceUrl);
  const location = safeHost(sourceUrl);
  if (override && Number.isFinite(override.start)) {
    return {
      start: override.start,
      end: override.end === void 0 ? defaultEnd(override.start, preset) : override.end,
      sourceType: preset.name,
      location
    };
  }
  const since = uiSignals.find((s) => s.kind === UI_SIGNAL.SINCE);
  const until = uiSignals.find((s) => s.kind === UI_SIGNAL.UNTIL);
  if (since || until) {
    const start = since ? Number(since.startMs) : extractedAt;
    const end = until ? Number(until.endMs) : defaultEnd(start, preset);
    return { start, end, sourceType: preset.name, location };
  }
  const range = uiSignals.find((s) => s.kind === UI_SIGNAL.TIME_RANGE);
  if (range && Number.isFinite(range.startMs)) {
    const end = Number.isFinite(range.endMs) ? range.endMs : defaultEnd(range.startMs, preset);
    return { start: range.startMs, end, sourceType: preset.name, location };
  }
  const version = uiSignals.find((s) => s.kind === UI_SIGNAL.VERSION_BANNER);
  if (version && Number.isFinite(version.startMs)) {
    return {
      start: version.startMs,
      end: defaultEnd(version.startMs, preset),
      sourceType: preset.name,
      location
    };
  }
  const eventDate = uiSignals.find((s) => s.kind === UI_SIGNAL.EVENT_DATE);
  if (eventDate && Number.isFinite(eventDate.dateMs)) {
    return {
      start: eventDate.dateMs,
      end: defaultEnd(eventDate.dateMs, preset),
      sourceType: preset.name,
      location
    };
  }
  const lastUpdated = uiSignals.find((s) => s.kind === UI_SIGNAL.LAST_UPDATED);
  if (lastUpdated && Number.isFinite(lastUpdated.secondsAgo)) {
    const start = extractedAt - lastUpdated.secondsAgo * 1e3;
    return { start, end: defaultEnd(start, preset), sourceType: preset.name, location };
  }
  return {
    start: extractedAt,
    end: defaultEnd(extractedAt, preset),
    sourceType: preset.name,
    location
  };
}
function defaultEnd(start, preset) {
  if (preset === VALIDITY_PRESET.UNKNOWN) {
    return start + VALIDITY_PRESET.UNKNOWN.durationMs;
  }
  return start + preset.durationMs;
}
function safeHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}
async function getNuggetStore(timeoutMs = 5e3) {
  if (isBooted()) return services().nuggetStore;
  const start = Date.now();
  while (!isBooted() && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!isBooted()) return null;
  return services().nuggetStore;
}
async function getActivePrivacy() {
  try {
    const { profileStore } = await bootProfiles();
    const profile = await profileStore.getActive(Date.now());
    return (profile == null ? void 0 : profile.privacy) ?? { memoryEnabled: true, disabledDomains: [] };
  } catch {
    return { memoryEnabled: true, disabledDomains: [] };
  }
}
function isHostBlocked(hostname, disabledDomains) {
  if (!Array.isArray(disabledDomains) || disabledDomains.length === 0) return false;
  const lower = String(hostname || "").toLowerCase();
  return disabledDomains.some((d) => {
    const dd = String(d || "").toLowerCase();
    if (!dd) return false;
    return lower === dd || lower.endsWith(`.${dd}`);
  });
}
function isInternalUrl(url) {
  try {
    const u = new URL(url);
    return ![
      "http:",
      "https:",
      "ftp:"
    ].includes(u.protocol);
  } catch {
    return true;
  }
}
function redactCredentials(url) {
  try {
    const u = new URL(url);
    if (u.username || u.password) {
      u.username = "";
      u.password = "";
    }
    return u.toString();
  } catch {
    return url;
  }
}
async function captureFact(extraction) {
  if (!(extraction == null ? void 0 : extraction.fact) || !(extraction == null ? void 0 : extraction.sourceUrl)) {
    return { dropped: "missing fact or sourceUrl" };
  }
  const privacy = await getActivePrivacy();
  if ((privacy == null ? void 0 : privacy.memoryEnabled) === false) {
    return { dropped: "memory disabled for active profile" };
  }
  if (isInternalUrl(extraction.sourceUrl)) {
    return { dropped: "internal URL" };
  }
  let host;
  try {
    host = new URL(extraction.sourceUrl).hostname;
  } catch {
    return { dropped: "unparseable URL" };
  }
  if (isHostBlocked(host, privacy == null ? void 0 : privacy.disabledDomains)) {
    return { dropped: `host blocked: ${host}` };
  }
  const safeUrl = redactCredentials(extraction.sourceUrl);
  const store = await getNuggetStore();
  if (!store) return null;
  const extractedAt = extraction.extractedAt ?? Date.now();
  const validity = inferValidity({
    extractedAt,
    sourceUrl: safeUrl,
    uiSignals: extraction.uiSignals ?? []
  });
  validity.scope = extraction.scope ?? `host:${host}`;
  const candidate = {
    kind: extraction.kind ?? "SemanticFact",
    fact: extraction.fact,
    canonicalText: extraction.canonicalText ?? `${extraction.fact.subject} ${extraction.fact.predicate} ${extraction.fact.object}`,
    validity,
    provenance: [
      {
        sourceUrl: safeUrl,
        domElementRef: extraction.domElementRef ?? null,
        pageTitle: extraction.pageTitle ?? null,
        screenshotHash: extraction.screenshotHash ?? null,
        extractedAt,
        extractionSessionId: extraction.extractionSessionId ?? null,
        agentId: extraction.agentId
      }
    ],
    createdAt: Date.now(),
    tier: extraction.tier ?? "profile",
    ownerSessionId: extraction.extractionSessionId ?? null,
    ownerAgentId: extraction.agentId
  };
  try {
    return store.insert(candidate, activeProfileId());
  } catch (e) {
    return { dropped: `insert failed: ${(e == null ? void 0 : e.message) ?? e}` };
  }
}
async function captureTaskCompletion({ taskTitle, sourceUrl, agentId, sessionId }) {
  if (!sourceUrl || !taskTitle) return { dropped: "missing fields" };
  return captureFact({
    kind: "SemanticFact",
    fact: {
      subject: sourceUrl,
      predicate: "task_completed",
      object: taskTitle
    },
    sourceUrl,
    extractedAt: Date.now(),
    agentId: agentId ?? "browser-memex",
    extractionSessionId: sessionId ?? null
  });
}
async function queryFacts(text, options = {}) {
  const store = await getNuggetStore();
  if (!store) return [];
  return store.query(text, { ...options, profileId: activeProfileId() });
}
async function getFact(id) {
  const store = await getNuggetStore();
  if (!store) return null;
  return store.get(id);
}
async function countFacts() {
  const store = await getNuggetStore();
  if (!store) return 0;
  return store.count(activeProfileId());
}
const insertFact = captureFact;
export {
  captureFact,
  captureTaskCompletion,
  countFacts,
  getFact,
  insertFact,
  queryFacts
};
//# sourceMappingURL=nugget-memory-CJE49jLy.js.map
