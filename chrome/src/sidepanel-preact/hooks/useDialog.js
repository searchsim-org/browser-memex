/**
 * Dialog primitives — promise-returning replacements for the native
 * `window.alert` / `window.confirm` / `window.prompt`.
 *
 * Side-panel code calls `showAlert / showConfirm / showPrompt` which emit a
 * dialog request on a module-level bus. `<DialogHost />` (mounted once at
 * App root) subscribes and renders the modal. The Promise resolves with
 * the user's response.
 *
 * Resolutions:
 *   alert   → resolves `undefined` when user closes
 *   confirm → resolves `true` on confirm, `false` on cancel / overlay click
 *   prompt  → resolves the entered text on confirm, `null` on cancel
 */
let _subscriber = null;

function emit(req) {
  if (typeof _subscriber === "function") _subscriber(req);
  else req.resolve(req.kind === "confirm" ? false : null);
}

/** Internal: DialogHost calls this to subscribe to dialog requests. */
export function subscribeDialog(cb) {
  _subscriber = cb;
  return () => {
    if (_subscriber === cb) _subscriber = null;
  };
}

export function showAlert(message, opts = {}) {
  return new Promise((resolve) => {
    emit({ kind: "alert", message, opts, resolve });
  });
}

export function showConfirm(message, opts = {}) {
  return new Promise((resolve) => {
    emit({ kind: "confirm", message, opts, resolve });
  });
}

/**
 * @param {string} message
 * @param {string} [defaultValue]
 * @param {object} [opts] - { okLabel, cancelLabel, placeholder, title }
 */
export function showPrompt(message, defaultValue = "", opts = {}) {
  return new Promise((resolve) => {
    emit({ kind: "prompt", message, defaultValue, opts, resolve });
  });
}
