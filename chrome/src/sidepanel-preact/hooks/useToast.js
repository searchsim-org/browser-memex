/**
 * Toasts — short, non-blocking confirmations (replaces `alert(…)` calls
 * used for "X copied to clipboard" / "Saved" etc.).
 *
 * showToast(message, { kind, durationMs })
 *   kind: 'info' | 'success' | 'error'  (default 'info')
 *   durationMs: number                    (default 2400)
 *
 * <ToastHost /> mounted at App root listens to the bus and renders.
 */
let _subscriber = null;
let _idCounter = 0;

function emit(toast) {
  if (typeof _subscriber === "function") _subscriber(toast);
}

export function subscribeToasts(cb) {
  _subscriber = cb;
  return () => {
    if (_subscriber === cb) _subscriber = null;
  };
}

export function showToast(message, opts = {}) {
  _idCounter += 1;
  emit({
    id: _idCounter,
    message,
    kind: opts.kind ?? "info",
    durationMs: opts.durationMs ?? 2400,
  });
}
