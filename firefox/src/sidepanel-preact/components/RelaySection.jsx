/**
 * RelaySection — configure the WebSocket relay the extension dials to talk
 * to MCP clients (Claude Code, Cursor, the CLI).
 *
 * Defaults to ws://localhost:7862 — the relay auto-started by the local MCP
 * server. Override the URL when the relay runs on a different machine
 * (e.g., Mac drives the tablet's browser over LAN / Tailscale).
 *
 * Visual aim matches the rest of Settings: a single .bmx-section card with
 * one status row + one editable field + one help line. No clutter.
 */

import { useState, useEffect, useCallback } from 'preact/hooks';
import { showToast } from '../hooks/useToast.js';

const STATE_LABEL = {
  connected: 'Connected',
  connecting: 'Connecting…',
  disconnected: 'Not connected',
};

function isRemoteHost(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.toLowerCase();
    return h !== 'localhost' && h !== '127.0.0.1' && h !== '::1' && h !== '[::1]';
  } catch {
    return false;
  }
}

export function RelaySection() {
  const [status, setStatus] = useState({ url: '', state: 'disconnected', defaultUrl: '' });
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const s = await chrome.runtime.sendMessage({ type: 'GET_RELAY_STATUS' });
      if (s) {
        setStatus(s);
        setDraft((prev) => (prev === '' ? s.url : prev));
      }
    } catch {
      /* service worker asleep — next refresh will catch up */
    }
  }, []);

  useEffect(() => {
    refresh();
    // Light polling so the pill reflects reality without manual reload.
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [refresh]);

  const dirty = draft.trim() !== '' && draft.trim() !== status.url;
  const isDefault = !status.url || status.url === status.defaultUrl;
  const draftIsRemote = isRemoteHost(draft || status.url);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'SET_RELAY_URL',
        payload: { url: draft.trim() },
      });
      if (!res?.success) {
        setError(res?.error || 'Could not save relay URL');
        showToast(res?.error || 'Could not save relay URL', { kind: 'error' });
        return;
      }
      setStatus({ url: res.url, state: res.state, defaultUrl: res.defaultUrl });
      setDraft(res.url);
      showToast('Relay URL saved', { kind: 'success' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await chrome.runtime.sendMessage({
        type: 'SET_RELAY_URL',
        payload: { url: '' },
      });
      if (res?.success) {
        setStatus({ url: res.url, state: res.state, defaultUrl: res.defaultUrl });
        setDraft(res.url);
        showToast('Reverted to default relay', { kind: 'success' });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bmx-section">
      <h3>MCP relay</h3>
      <p className="bmx-hint">
        The WebSocket the extension listens on for tasks from Claude Code,
        Cursor, or the CLI. Change this to pair with a relay on another
        machine over LAN or Tailscale.
      </p>

      <div className="relay-status-row">
        <span className={`relay-pill relay-pill--${status.state}`}>
          <span className="relay-pill__dot" />
          {STATE_LABEL[status.state] ?? 'Unknown'}
        </span>
        <code className="relay-status-url" title={status.url}>{status.url || '—'}</code>
        <button
          type="button"
          className="bmx-btn relay-refresh-btn"
          onClick={refresh}
          aria-label="Refresh relay status"
          title="Refresh"
        >
          &#8635;
        </button>
      </div>

      <label className="relay-field">
        <span className="relay-field__label">Relay URL</span>
        <input
          type="text"
          spellcheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          value={draft}
          placeholder={status.defaultUrl || 'ws://localhost:7862'}
          onInput={(e) => setDraft(e.currentTarget.value)}
          className="relay-input"
        />
      </label>

      {draftIsRemote && (
        <p className="relay-warning">
          Heads up — the relay has no auth and the <code>ws://</code> traffic
          is unencrypted. Only point this at a remote host over a trusted
          network (LAN, Tailscale, VPN).
        </p>
      )}
      {error && <p className="bmx-error" style={{ marginTop: 6 }}>{error}</p>}

      <div className="bmx-form__actions">
        {!isDefault && (
          <button
            type="button"
            className="bmx-btn"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to default
          </button>
        )}
        <button
          type="button"
          className="bmx-btn bmx-btn--primary"
          onClick={handleSave}
          disabled={!dirty || saving}
        >
          {saving ? 'Saving…' : 'Save & reconnect'}
        </button>
      </div>
    </section>
  );
}
