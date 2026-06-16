/**
 * DialogHost — single-mount modal renderer for `showAlert / showConfirm /
 * showPrompt` calls. Listens to the dialog bus in hooks/useDialog.js.
 *
 * Keyboard: Enter confirms (where applicable), Escape cancels.
 * A11y: focus traps to the dialog while open, role=dialog + aria-modal.
 */

import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { subscribeDialog } from '../hooks/useDialog.js';

export function DialogHost() {
  const [req, setReq] = useState(null);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const okBtnRef = useRef(null);

  const close = useCallback(
    (result) => {
      if (!req) return;
      req.resolve(result);
      setReq(null);
      setValue('');
    },
    [req]
  );

  useEffect(() => {
    return subscribeDialog((next) => {
      setReq(next);
      setValue(next?.defaultValue ?? '');
    });
  }, []);

  useEffect(() => {
    if (!req) return undefined;
    const t = setTimeout(() => {
      if (req.kind === 'prompt') inputRef.current?.focus();
      else okBtnRef.current?.focus();
    }, 20);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(req.kind === 'alert' ? undefined : req.kind === 'confirm' ? false : null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [req, close]);

  if (!req) return null;

  const onOk = () => {
    if (req.kind === 'alert') close(undefined);
    else if (req.kind === 'confirm') close(true);
    else close(value);
  };
  const onCancel = () => {
    close(req.kind === 'confirm' ? false : null);
  };

  const okLabel = req.opts?.okLabel ?? (req.kind === 'alert' ? 'OK' : req.kind === 'confirm' ? 'Confirm' : 'Save');
  const cancelLabel = req.opts?.cancelLabel ?? 'Cancel';
  const isDestructive = !!req.opts?.destructive;

  return (
    <div
      class="bmx-dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={req.opts?.title ?? 'Dialog'}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div class="bmx-dialog">
        {req.opts?.title && <div class="bmx-dialog__title">{req.opts.title}</div>}
        <p class="bmx-dialog__message">{req.message}</p>
        {req.kind === 'prompt' && (
          <input
            ref={inputRef}
            type="text"
            class="bmx-dialog__input"
            value={value}
            placeholder={req.opts?.placeholder ?? ''}
            onInput={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                close(value);
              }
            }}
          />
        )}
        <div class="bmx-dialog__actions">
          {req.kind !== 'alert' && (
            <button type="button" class="bmx-btn" onClick={onCancel}>
              {cancelLabel}
            </button>
          )}
          <button
            ref={okBtnRef}
            type="button"
            class={`bmx-btn bmx-btn--primary ${isDestructive ? 'bmx-btn--danger' : ''}`}
            onClick={onOk}
          >
            {okLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
