/**
 * DeveloperSection — detailed logging toggle, log list, export/clear.
 *
 * Moved out of the legacy chat-side SettingsModal as part of the cog-removal
 * pass; lives on the Settings tab.
 */

import { useState, useEffect } from 'preact/hooks';
import { showConfirm } from '../hooks/useDialog.js';

export function DeveloperSection() {
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('detailedLogging').then(({ detailedLogging }) => {
      setLoggingEnabled(!!detailedLogging);
    });
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLoading(true);
    chrome.runtime
      .sendMessage({ type: 'LIST_TASK_LOGS' })
      .then((res) => {
        setLogs(res?.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleToggle = (enabled) => {
    setLoggingEnabled(enabled);
    chrome.storage.local.set({ detailedLogging: enabled });
  };

  const handleExport = () => {
    setExporting(true);
    chrome.runtime
      .sendMessage({ type: 'EXPORT_TASK_LOGS' })
      .then((res) => {
        if (res?.data) {
          const blob = new Blob([res.data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `browser-memex-logs-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setExporting(false);
      })
      .catch(() => setExporting(false));
  };

  const handleClear = async () => {
    const ok = await showConfirm('Delete all stored logs?', {
      title: 'Clear logs',
      okLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    chrome.runtime.sendMessage({ type: 'CLEAR_TASK_LOGS' }).then(() => setLogs([]));
  };

  return (
    <section className="bmx-section">
      <h3>Developer</h3>
      <p className="bmx-hint">Detailed logging for debugging task runs.</p>

      <div class="settings-rows">
        <div class="settings-row">
          <div class="settings-row-info">
            <div class="settings-row-name">Detailed logging</div>
            <div class="settings-row-sub">Captures full step traces to local storage</div>
          </div>
          <label class="toggle-switch">
            <input
              type="checkbox"
              checked={loggingEnabled}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            <span class="toggle-slider" />
          </label>
        </div>
      </div>

      {loggingEnabled && (
        <>
          <div class="dev-log-summary">
            {loading ? 'Loading...' : `${logs.length} log(s) stored`}
          </div>

          {logs.length > 0 && (
            <div class="dev-log-list">
              {logs.slice(0, 15).map((l) => (
                <div key={l.folder} class="dev-log-item">
                  <div class="dev-log-task">
                    {l.task?.substring(0, 50) || '(no task)'}
                    {l.task?.length > 50 ? '...' : ''}
                  </div>
                  <div class="dev-log-meta">
                    <span class={`dev-log-status ${l.status}`}>{l.status}</span>
                    {l.duration && <span>{l.duration}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div class="settings-form-actions" style={{ marginTop: '8px' }}>
            <button
              class="btn btn-secondary btn-sm"
              onClick={handleExport}
              disabled={exporting || logs.length === 0}
            >
              {exporting ? 'Exporting...' : 'Export'}
            </button>
            <button
              class="btn btn-danger btn-sm"
              onClick={handleClear}
              disabled={logs.length === 0}
            >
              Clear
            </button>
          </div>
        </>
      )}
    </section>
  );
}
