import { S, a, b, c, f, g, h, i, k, v } from "../service-worker.js";
function proposeSkillFromTrajectory(trajectory) {
  var _a, _b, _c, _d;
  if (!trajectory || !Array.isArray(trajectory.steps) || trajectory.steps.length === 0) {
    throw new Error("proposeSkillFromTrajectory: trajectory.steps must be a non-empty array");
  }
  const inputs = [];
  const seen = /* @__PURE__ */ new Set();
  function addInput(name, type, description) {
    if (seen.has(name)) return;
    seen.add(name);
    inputs.push({ name, type, description });
  }
  for (const s of trajectory.steps) {
    if (((_a = s == null ? void 0 : s.args) == null ? void 0 : _a.url) || ((_b = s == null ? void 0 : s.args) == null ? void 0 : _b.startingUrl)) {
      addInput("startingUrl", "string", "URL to navigate to before the skill runs");
      break;
    }
  }
  const QUERY_FIELDS = /* @__PURE__ */ new Set(["q", "query", "search", "prompt", "instruction", "text"]);
  for (const s of trajectory.steps) {
    if (!(s == null ? void 0 : s.args) || typeof s.args !== "object") continue;
    for (const key of Object.keys(s.args)) {
      if (QUERY_FIELDS.has(key) && typeof s.args[key] === "string") {
        addInput(key, "string", `Free-text "${key}" supplied to step ${s.toolName ?? "?"}`);
      }
    }
  }
  const stages = trajectory.steps.map((s, i2) => ({
    id: `step-${i2 + 1}`,
    kind: "run_task",
    params: {
      title: (s == null ? void 0 : s.toolName) ? `${s.toolName} (step ${i2 + 1})` : `Step ${i2 + 1}`,
      payload: {
        toolName: s == null ? void 0 : s.toolName,
        // Keep the concrete args; the dispatcher decides which to override
        // from inputs at run time. The most common substitutions get
        // ${inputs.*} markers so the workflow engine interpolates.
        args: generalizeArgs((s == null ? void 0 : s.args) ?? {}, seen)
      },
      capability: "read_with_network",
      creator: "skill"
    }
  }));
  const suggestedName = trajectory.title ? String(trajectory.title).slice(0, 80) : `Skill from ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`;
  return {
    suggestedName,
    explanation: `Distilled from one demonstration on ${(/* @__PURE__ */ new Date()).toISOString()} — ${trajectory.steps.length} step(s). Inputs: ${inputs.map((i2) => i2.name).join(", ") || "(none)"}.`,
    sourceTaskIds: trajectory.taskId ? [trajectory.taskId] : [],
    template: trajectory,
    successCount: 1,
    firstSeenAt: ((_c = trajectory.steps[0]) == null ? void 0 : _c.timestamp) ?? Date.now(),
    lastSeenAt: ((_d = trajectory.steps[trajectory.steps.length - 1]) == null ? void 0 : _d.timestamp) ?? Date.now(),
    inputs,
    steps: stages
  };
}
function generalizeArgs(args, knownInputs) {
  const out = {};
  for (const [k2, v2] of Object.entries(args)) {
    if ((k2 === "url" || k2 === "startingUrl") && typeof v2 === "string" && knownInputs.has("startingUrl")) {
      out[k2] = "${inputs.startingUrl}";
    } else if (typeof v2 === "string" && knownInputs.has(k2) && ["q", "query", "search", "prompt", "instruction", "text"].includes(k2)) {
      out[k2] = `\${inputs.${k2}}`;
    } else {
      out[k2] = v2;
    }
  }
  return out;
}
export {
  S as SKILLS_SCHEMA_VERSION,
  a as SKILL_STATUS,
  b as SkillSqliteStore,
  c as SkillStore,
  f as canonicalize,
  g as exportSkill,
  h as fnv1a64,
  i as importSkillEnvelope,
  proposeSkillFromTrajectory,
  k as signSkill,
  v as verifySkill
};
//# sourceMappingURL=index-DIeGsudJ.js.map
