/**
 * ModelsSection — provider API keys + custom OpenAI-compatible endpoints.
 *
 * Moved out of the legacy chat-side SettingsModal as part of the cog-removal
 * pass; now lives on the Agents tab because "what model is running the
 * agent?" is conceptually agent configuration.
 *
 * Self-managed: reads & writes config via the SAVE_CONFIG runtime message.
 * Mutations propagate to the chat model selector through the parent's
 * useConfig hook on the next loadConfig().
 */

import { useState } from 'preact/hooks';
import { PROVIDERS } from '../config/providers';
import { showToast } from '../hooks/useToast.js';
import { notifyConfigChanged } from '../hooks/useConfig.js';

export function ModelsSection({ config }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [localKeys, setLocalKeys] = useState({ ...config.providerKeys });
  const [keysDirty, setKeysDirty] = useState(false);
  const [newCustomModel, setNewCustomModel] = useState({
    name: '',
    baseUrl: '',
    modelId: '',
    apiKey: '',
  });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleKeyInput = (id, value) => {
    setLocalKeys({ ...localKeys, [id]: value });
    setKeysDirty(true);
  };

  const handleSaveKeys = async () => {
    await chrome.runtime.sendMessage({
      type: 'SAVE_CONFIG',
      payload: {
        providerKeys: localKeys,
        customModels: config.customModels,
        currentModelIndex: config.currentModelIndex,
        userSkills: config.userSkills,
      },
    });
    await config.loadConfig();
    notifyConfigChanged();
    setKeysDirty(false);
    showToast('API keys saved', { kind: 'success' });
  };

  const handleAddCustomModel = async () => {
    if (!newCustomModel.name || !newCustomModel.baseUrl || !newCustomModel.modelId) {
      showToast('Fill in name, base URL, and model ID', { kind: 'error' });
      return;
    }
    const nextCustom = [...config.customModels, { ...newCustomModel }];
    await chrome.runtime.sendMessage({
      type: 'SAVE_CONFIG',
      payload: {
        providerKeys: localKeys,
        customModels: nextCustom,
        currentModelIndex: config.currentModelIndex,
        userSkills: config.userSkills,
      },
    });
    await config.loadConfig();
    notifyConfigChanged();
    setNewCustomModel({ name: '', baseUrl: '', modelId: '', apiKey: '' });
    setShowCustomForm(false);
    showToast(`Added "${nextCustom[nextCustom.length - 1].name}"`, { kind: 'success' });
  };

  const handleRemoveCustom = async (index) => {
    const nextCustom = config.customModels.filter((_, i) => i !== index);
    await chrome.runtime.sendMessage({
      type: 'SAVE_CONFIG',
      payload: {
        providerKeys: localKeys,
        customModels: nextCustom,
        currentModelIndex: config.currentModelIndex,
        userSkills: config.userSkills,
      },
    });
    await config.loadConfig();
    notifyConfigChanged();
  };

  return (
    <section className="bmx-section">
      <h3>Model providers</h3>
      <p className="bmx-hint">API keys for the LLM that powers the chat.</p>

      <div class="settings-rows">
        {Object.entries(PROVIDERS).map(([id, provider]) => (
          <div key={id}>
            <div
              class={`settings-row ${selectedProvider === id ? 'selected' : ''}`}
              onClick={() => setSelectedProvider(selectedProvider === id ? null : id)}
            >
              <div class="settings-row-info">
                <div class="settings-row-name">{provider.name}</div>
                <div class={`settings-row-sub ${localKeys[id] ? 'ok' : ''}`}>
                  {localKeys[id] ? 'Configured' : 'Not configured'}
                </div>
              </div>
              {localKeys[id] ? (
                <span class="settings-row-check">&#10003;</span>
              ) : (
                <span class="settings-row-arrow">&#8250;</span>
              )}
            </div>
            {selectedProvider === id && (
              <div class="settings-key-input">
                <input
                  type="password"
                  value={localKeys[id] || ''}
                  onInput={(e) => handleKeyInput(id, e.target.value)}
                  placeholder={`${provider.name} API key...`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {keysDirty && (
        <div class="bmx-form__actions" style={{ marginTop: 8 }}>
          <button onClick={handleSaveKeys} className="bmx-btn bmx-btn--primary">
            Save API keys
          </button>
        </div>
      )}

      <div class="settings-section-label" style={{ marginTop: 16 }}>Custom endpoints</div>
      <p className="bmx-hint">OpenAI-compatible HTTP endpoints (Ollama, vLLM, etc.).</p>

      <div class="settings-rows">
        {config.customModels.map((model, i) => (
          <div key={i} class="settings-row">
            <div class="settings-row-info">
              <div class="settings-row-name">{model.name}</div>
              <div class="settings-row-sub ok">{model.baseUrl}</div>
            </div>
            <button class="settings-row-delete" onClick={() => handleRemoveCustom(i)}>
              &times;
            </button>
          </div>
        ))}

        {!showCustomForm ? (
          <div class="settings-row add-row" onClick={() => setShowCustomForm(true)}>
            <div class="settings-row-info">
              <div class="settings-row-name">+ Add custom model</div>
              <div class="settings-row-sub">OpenAI-compatible endpoint</div>
            </div>
            <span class="settings-row-arrow">&#8250;</span>
          </div>
        ) : (
          <div class="settings-inline-form">
            <p className="bmx-hint" style={{ margin: '0 0 4px' }}>
              OpenAI-compatible endpoint. The host alone is fine
              (e.g. <code>https://llms.example.edu</code> or
              <code>http://localhost:11434</code>) — we'll append
              <code>/v1/chat/completions</code> automatically.
            </p>
            <input
              type="text"
              placeholder="Display name — e.g. Innkube Llama-3"
              value={newCustomModel.name}
              onInput={(e) => setNewCustomModel({ ...newCustomModel, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Base URL — host, host/v1, or full /v1/chat/completions"
              value={newCustomModel.baseUrl}
              onInput={(e) => setNewCustomModel({ ...newCustomModel, baseUrl: e.target.value })}
            />
            <input
              type="text"
              placeholder="Model ID — the exact string the server expects"
              value={newCustomModel.modelId}
              onInput={(e) => setNewCustomModel({ ...newCustomModel, modelId: e.target.value })}
            />
            <input
              type="password"
              placeholder="API key (optional — leave blank for unauthenticated)"
              value={newCustomModel.apiKey}
              onInput={(e) => setNewCustomModel({ ...newCustomModel, apiKey: e.target.value })}
            />
            <div class="settings-form-actions">
              <button class="btn btn-secondary btn-sm" onClick={() => setShowCustomForm(false)}>
                Cancel
              </button>
              <button class="btn btn-primary btn-sm" onClick={handleAddCustomModel}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
