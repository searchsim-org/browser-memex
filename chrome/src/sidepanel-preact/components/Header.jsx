import { useState, useRef, useEffect } from 'preact/hooks';

export function Header({
  currentModel,
  availableModels,
  currentModelIndex,
  onModelSelect,
  onNewChat,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const historyRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (historyRef.current && !historyRef.current.contains(e.target) && !e.target.closest('.history-toggle-btn')) {
        setIsHistoryOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleModelSelect = (index) => {
    onModelSelect(index);
    setIsDropdownOpen(false);
  };

  const handleSelectSession = (id) => {
    onSelectSession(id);
    setIsHistoryOpen(false);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000 && d.getDate() === now.getDate()) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group sessions by date
  const grouped = {};
  (sessions || []).forEach(s => {
    const label = formatTime(s.updatedAt || s.createdAt);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(s);
  });

  return (
    <div class="header-wrapper">
      <div class="header">
        <div class="header-left">
          <div class="model-selector" ref={dropdownRef}>
            <button
              class="model-selector-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span class="model-dot" />
              <span class="current-model-name">
                {currentModel?.name || 'Select Model'}
              </span>
              <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div class="model-dropdown">
                <div class="model-list">
                  {availableModels.length === 0 ? (
                    <div class="model-item disabled">
                      No models configured
                    </div>
                  ) : (
                    availableModels.map((model, index) => (
                      <button
                        key={index}
                        class={`model-item ${index === currentModelIndex ? 'active' : ''}`}
                        onClick={() => handleModelSelect(index)}
                      >
                        <span class="model-item-dot" />
                        {model.name}
                        {index === currentModelIndex && (
                          <svg class="model-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div class="header-right">
          <button
            class={`icon-btn history-toggle-btn ${isHistoryOpen ? 'active' : ''}`}
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            title="Chat history"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          <button class="icon-btn" onClick={onNewChat} title="New chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {isHistoryOpen && (
        <div class="history-panel" ref={historyRef}>
          {Object.keys(grouped).length === 0 ? (
            <div class="history-empty">No previous chats</div>
          ) : (
            Object.entries(grouped).map(([label, items]) => (
              <div key={label} class="history-group">
                <div class="history-date">{label}</div>
                {items.map(s => (
                  <div
                    key={s.id}
                    class={`history-item ${s.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => handleSelectSession(s.id)}
                  >
                    <span class="history-title">{s.title}</span>
                    <button
                      class="history-delete"
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(s.id); }}
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
