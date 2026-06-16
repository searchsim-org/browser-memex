import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import { showToast } from '../hooks/useToast.js';

const TEXT_LIKE_EXTS = ['.txt', '.md', '.markdown', '.json', '.csv', '.tsv', '.yaml', '.yml', '.log', '.html', '.htm', '.xml'];
const MAX_TEXT_FILE_BYTES = 256 * 1024; // 256 KB — guardrail against pasting huge logs

function isTextLike(file) {
  if (file.type.startsWith('text/')) return true;
  if (file.type === 'application/json') return true;
  const name = (file.name || '').toLowerCase();
  return TEXT_LIKE_EXTS.some((ext) => name.endsWith(ext));
}

export function InputArea({
  isRunning,
  attachedImages,
  onSend,
  onStop,
  onAddImage,
  onRemoveImage,
  hasModels,
  suggestedText,
  onClearSuggestion,
}) {
  const [text, setText] = useState('');
  const [background, setBackground] = useState(false);
  const [attachError, setAttachError] = useState(null);
  const fileInputRef = useRef(null);
  const toggleBackground = useCallback(() => {
    setBackground(prev => !prev);
  }, []);

  // When suggestedText changes, populate the textarea
  useEffect(() => {
    if (suggestedText) {
      setText(suggestedText);
      onClearSuggestion();
    }
  }, [suggestedText, onClearSuggestion]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (!text.trim() || isRunning) return;
    if (!hasModels) {
      showToast('Configure a model in the Agents tab first', { kind: 'error' });
      return;
    }
    onSend(text, { background });
    setText('');
    setBackground(false);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    setAttachError(null);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        readImageFile(file);
      } else if (isTextLike(file)) {
        readTextFile(file);
      } else {
        setAttachError(`Unsupported file type: ${file.name || file.type}`);
      }
    }
  };

  const readTextFile = (file) => {
    if (file.size > MAX_TEXT_FILE_BYTES) {
      setAttachError(`${file.name}: too large (max ${MAX_TEXT_FILE_BYTES / 1024} KB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target.result ?? '');
      // Prepend the file as a labeled code block to the text area
      setText((prev) => {
        const header = `\n\n--- file: ${file.name} (${file.size} bytes) ---\n`;
        return (prev || '') + header + content;
      });
    };
    reader.readAsText(file);
  };

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
    // Reset so the same file can be re-picked
    e.target.value = '';
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) readImageFile(file);
          break;
        }
      }
    }
  };

  const readImageFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onAddImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      class={`input-container ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {attachedImages.length > 0 && (
        <div class="image-preview">
          {attachedImages.map((img, i) => (
            <div key={i} class="image-preview-item">
              <img src={img} alt={`Preview ${i + 1}`} />
              <button
                class="remove-image-btn"
                onClick={() => onRemoveImage(i)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {attachError && <div class="input-attach-error">{attachError}</div>}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.txt,.md,.markdown,.json,.csv,.tsv,.yaml,.yml,.log,.html,.htm,.xml,text/*,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div class="input-row">
        {!isRunning && (
          <button
            class="attach-btn"
            onClick={handlePickFiles}
            title="Attach images or text files"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
        )}

        {!isRunning && (
          <div class="bg-inline-wrap" data-tip={background ? 'Background' : 'Foreground'}>
            <button
              class={`bg-inline-btn ${background ? 'active' : ''}`}
              onClick={toggleBackground}
            >
              {background ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="5" width="15" height="11" rx="2" />
                  <rect x="8" y="2" width="15" height="11" rx="2" opacity="0.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              )}
            </button>
          </div>
        )}

        <textarea
          ref={inputRef}
          class="input"
          placeholder="What would you like me to do?"
          value={text}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          rows={1}
        />

        {isRunning ? (
          <button class="stop-btn" onClick={onStop} title="Stop task">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            class="send-btn"
            onClick={handleSubmit}
            disabled={!text.trim()}
            title={background ? 'Run in background' : 'Send'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
