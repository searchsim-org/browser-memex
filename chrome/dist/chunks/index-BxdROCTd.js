var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _WorkflowEngine_instances, runTask_fn, runAction_fn;
const STAGE_KIND = Object.freeze({
  RUN_TASK: "run_task",
  RUN_ACTION: "run_action",
  CONDITIONAL: "conditional"
});
const STAGE_RESULT = Object.freeze({
  SUCCESS: "success",
  FAILURE: "failure",
  SKIPPED: "skipped"
});
const TEMPLATE_RE = /\$\{([^}]+)\}/g;
function resolveExpression(expr, context) {
  const parts = String(expr).split(".");
  if (parts.length < 2) return void 0;
  const root = parts[0];
  const rest = parts.slice(1);
  let cursor;
  switch (root) {
    case "inputs":
      cursor = context == null ? void 0 : context.inputs;
      break;
    case "steps":
      cursor = context == null ? void 0 : context.stageOutputs;
      break;
    case "vars":
      cursor = context == null ? void 0 : context.variables;
      break;
    default:
      return void 0;
  }
  for (const k of rest) {
    if (cursor == null) return void 0;
    cursor = cursor[k];
  }
  return cursor;
}
function interpolate(template, context) {
  if (typeof template !== "string") return template;
  const matches = [...template.matchAll(TEMPLATE_RE)];
  if (matches.length === 0) return template;
  if (matches.length === 1 && matches[0][0] === template.trim()) {
    return resolveExpression(matches[0][1].trim(), context);
  }
  return template.replace(TEMPLATE_RE, (_full, expr) => {
    const v = resolveExpression(expr.trim(), context);
    if (v === void 0 || v === null) return "";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  });
}
function resolveValue(value, context) {
  if (Array.isArray(value)) return value.map((v) => resolveValue(v, context));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = resolveValue(v, context);
    }
    return out;
  }
  if (typeof value === "string") return interpolate(value, context);
  return value;
}
function evaluateCondition(expression, context) {
  if (typeof expression !== "string" || expression.trim().length === 0) return false;
  const trimmed = expression.trim();
  const OP_RE = /^(.*?)\s*(==|!=|>=|<=|>|<)\s*(.*)$/;
  const m = trimmed.match(OP_RE);
  if (!m) {
    const v = interpolate(trimmed, context);
    return Boolean(v);
  }
  const left = interpolate(m[1].trim(), context);
  const op = m[2];
  const rightRaw = m[3].trim();
  let right;
  try {
    right = JSON.parse(rightRaw);
  } catch {
    right = rightRaw.replace(/^['"]|['"]$/g, "");
  }
  switch (op) {
    case "==":
      return left == right;
    case "!=":
      return left != right;
    case ">":
      return Number(left) > Number(right);
    case "<":
      return Number(left) < Number(right);
    case ">=":
      return Number(left) >= Number(right);
    case "<=":
      return Number(left) <= Number(right);
    default:
      return false;
  }
}
class WorkflowEngine {
  /**
   * @param {object} opts
   * @param {object} opts.dispatcher
   *   Must implement:
   *     - dispatchTask(task, ctx)    → Promise<{ success, result, ... }>
   *     - dispatchAction(actionId, params, ctx) → Promise<{ success, result, ... }>
   *   The engine's caller wires this to AgentDispatcher (8.4) or a test double.
   * @param {(name: string, payload: object) => Promise<void>} [opts.notify]
   *   Optional callback for stage-level events; useful for UI live updates.
   */
  constructor({ dispatcher, notify }) {
    __privateAdd(this, _WorkflowEngine_instances);
    if (!dispatcher || typeof dispatcher.dispatchTask !== "function") {
      throw new Error("WorkflowEngine: dispatcher.dispatchTask required");
    }
    if (typeof dispatcher.dispatchAction !== "function") {
      throw new Error("WorkflowEngine: dispatcher.dispatchAction required");
    }
    this.dispatcher = dispatcher;
    this.notify = typeof notify === "function" ? notify : async () => {
    };
  }
  /**
   * Run the workflow.
   *
   * @param {object[]} stages — WorkflowStage[]
   * @param {object} [inputs] — caller-provided inputs
   * @param {number} [now]    — clock injection; defaults to Date.now()
   */
  async run(stages, inputs = {}, now = Date.now()) {
    var _a, _b;
    if (!Array.isArray(stages) || stages.length === 0) {
      return {
        success: false,
        stages: [],
        context: { inputs, stageOutputs: {}, variables: {} },
        error: "workflow has no stages"
      };
    }
    const context = {
      inputs: { ...inputs },
      stageOutputs: {},
      variables: {}
    };
    const stageById = new Map(stages.map((s) => [s.id, s]));
    const results = [];
    let cursor = 0;
    let overallOk = true;
    let halted = false;
    while (cursor < stages.length && !halted) {
      const stage = stages[cursor];
      const startedAt = now + cursor;
      await this.notify("stage:start", { stageId: stage.id });
      const resolved = resolveValue(stage.params ?? {}, context);
      let stageResult;
      try {
        switch (stage.kind) {
          case STAGE_KIND.RUN_TASK:
            stageResult = await __privateMethod(this, _WorkflowEngine_instances, runTask_fn).call(this, stage, resolved);
            break;
          case STAGE_KIND.RUN_ACTION:
            stageResult = await __privateMethod(this, _WorkflowEngine_instances, runAction_fn).call(this, stage, resolved);
            break;
          case STAGE_KIND.CONDITIONAL: {
            const matched = evaluateCondition(resolved.expression, context);
            const nextId = matched ? resolved.thenStageId : resolved.elseStageId;
            stageResult = { success: true, result: { matched, jumpTo: nextId ?? null } };
            break;
          }
          default:
            throw new Error(`unknown stage.kind '${stage.kind}'`);
        }
      } catch (e) {
        stageResult = { success: false, error: (e == null ? void 0 : e.message) ?? String(e) };
      }
      const endedAt = startedAt + 1;
      if (stageResult.success) {
        context.stageOutputs[stage.id] = stageResult.result;
        if (stage.outputAs) {
          context.variables[stage.outputAs] = stageResult.result;
        }
        results.push({
          stageId: stage.id,
          status: STAGE_RESULT.SUCCESS,
          output: stageResult.result,
          startedAt,
          endedAt
        });
        await this.notify("stage:success", { stageId: stage.id });
      } else {
        results.push({
          stageId: stage.id,
          status: STAGE_RESULT.FAILURE,
          error: stageResult.error,
          startedAt,
          endedAt
        });
        await this.notify("stage:failure", { stageId: stage.id, error: stageResult.error });
        if (!stage.continueOnError) {
          overallOk = false;
          halted = true;
          break;
        }
      }
      if (stage.kind === STAGE_KIND.CONDITIONAL && stageResult.success) {
        const jumpTo = (_a = stageResult.result) == null ? void 0 : _a.jumpTo;
        if (jumpTo && stageById.has(jumpTo)) {
          cursor = stages.findIndex((s) => s.id === jumpTo);
          continue;
        }
      }
      cursor++;
    }
    return {
      success: overallOk,
      stages: results,
      context,
      error: overallOk ? void 0 : `workflow halted at ${(_b = results[results.length - 1]) == null ? void 0 : _b.stageId}`
    };
  }
}
_WorkflowEngine_instances = new WeakSet();
runTask_fn = async function(stage, params) {
  const task = {
    kind: "one_shot",
    title: params.title ?? `Stage ${stage.id}`,
    payload: params.payload ?? {},
    capability: params.capability ?? "read_with_network",
    creator: params.creator ?? "workflow",
    routing: stage.agentId ? { agentId: stage.agentId } : null
  };
  const r = await this.dispatcher.dispatchTask(task, {});
  return { success: Boolean(r == null ? void 0 : r.success), result: r == null ? void 0 : r.result, error: r == null ? void 0 : r.error };
};
runAction_fn = async function(_stage, params) {
  const actionId = params.actionId;
  const actionParams = params.params ?? {};
  if (typeof actionId !== "string") {
    return { success: false, error: "RUN_ACTION: params.actionId required" };
  }
  const r = await this.dispatcher.dispatchAction(actionId, actionParams, {});
  return { success: Boolean(r == null ? void 0 : r.success), result: r == null ? void 0 : r.result, error: r == null ? void 0 : r.error };
};
export {
  STAGE_KIND,
  STAGE_RESULT,
  WorkflowEngine,
  evaluateCondition,
  interpolate,
  resolveExpression,
  resolveValue
};
//# sourceMappingURL=index-BxdROCTd.js.map
