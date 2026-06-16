/**
 * ToastHost — single-mount toast renderer. Pinned to the bottom-center of
 * the side panel; multiple toasts stack vertically.
 */

import { useState, useEffect } from 'preact/hooks';
import { subscribeToasts } from '../hooks/useToast.js';

export function ToastHost() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.durationMs);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div class="bmx-toast-host" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} class={`bmx-toast bmx-toast--${t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
