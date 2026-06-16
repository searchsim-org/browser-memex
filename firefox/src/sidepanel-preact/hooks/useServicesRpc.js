/**
 * useServicesRpc — typed client for the side-panel ↔ service-worker RPC
 * surface installed by `src/background/services-rpc.js`.
 *
 * Returns a stable object of method functions; each call posts a message
 * and resolves with the result (or rejects with an Error). Methods are
 * grouped by namespace for readability.
 */

import { useMemo } from "preact/hooks";

function callRpc(type, args) {
  return new Promise((resolve, reject) => {
    /* global chrome */
    const target =
      typeof globalThis.browser !== "undefined" && globalThis.browser?.runtime
        ? globalThis.browser
        : chrome;
    target.runtime.sendMessage({ type, args }, (response) => {
      if (target.runtime.lastError) {
        reject(new Error(target.runtime.lastError.message));
        return;
      }
      if (!response) {
        reject(new Error(`No response for ${type}`));
        return;
      }
      if (response.ok) resolve(response.result);
      else reject(new Error(response.error || `RPC ${type} failed`));
    });
  });
}

export function useServicesRpc() {
  return useMemo(
    () => ({
      tasks: {
        list: (args) => callRpc("services.tasks.list", args),
        get: (id) => callRpc("services.tasks.get", { id }),
        create: (spec) => callRpc("services.tasks.create", spec),
        cancel: (id) => callRpc("services.tasks.cancel", { id }),
        pause: (id) => callRpc("services.tasks.pause", { id }),
        resume: (id) => callRpc("services.tasks.resume", { id }),
        runs: (id, limit) => callRpc("services.tasks.runs", { id, limit }),
        trackerSamples: (id, limit) =>
          callRpc("services.tasks.trackerSamples", { id, limit }),
      },
      memory: {
        query: (text, options) => callRpc("services.memory.query", { text, options }),
        get: (id) => callRpc("services.memory.get", { id }),
        count: () => callRpc("services.memory.count"),
        provenance: (id) => callRpc("services.memory.provenance", { id }),
        promote: (id, tier) => callRpc("services.memory.promote", { id, tier }),
      },
      skills: {
        list: (args) => callRpc("services.skills.list", args),
        get: (id) => callRpc("services.skills.get", { id }),
        getByName: (name) => callRpc("services.skills.getByName", { name }),
        create: (spec) => callRpc("services.skills.create", spec),
        update: (id, patch) => callRpc("services.skills.update", { id, patch }),
        archive: (id) => callRpc("services.skills.archive", { id }),
        delete: (id) => callRpc("services.skills.delete", { id }),
        runs: (id, limit) => callRpc("services.skills.runs", { id, limit }),
        exportSkill: (id) => callRpc("services.skills.export", { id }),
        importEnvelope: (envelope) =>
          callRpc("services.skills.import", { envelope }),
        run: (id, inputs) => callRpc("services.skills.run", { id, inputs }),
        proposeFromTrajectory: (trajectory) =>
          callRpc("services.skills.proposeFromTrajectory", { trajectory }),
        confirmProposal: (proposal, name, description) =>
          callRpc("services.skills.confirmProposal", { proposal, name, description }),
      },
      agents: {
        availability: () => callRpc("services.agents.availability"),
        invalidateAvailability: () =>
          callRpc("services.agents.invalidateAvailability"),
      },
      tabContext: {
        collect: (opts) => callRpc("services.tabContext.collect", opts ?? {}),
      },
      profiles: {
        list: () => callRpc("services.profiles.list"),
        get: (id) => callRpc("services.profiles.get", { id }),
        getActive: () => callRpc("services.profiles.getActive"),
        setActive: (id) => callRpc("services.profiles.setActive", { id }),
        create: (spec) => callRpc("services.profiles.create", spec),
        update: (id, patch) => callRpc("services.profiles.update", { id, patch }),
        delete: (id) => callRpc("services.profiles.delete", { id }),
        duplicate: (id, newName) =>
          callRpc("services.profiles.duplicate", { id, newName }),
      },
    }),
    []
  );
}
