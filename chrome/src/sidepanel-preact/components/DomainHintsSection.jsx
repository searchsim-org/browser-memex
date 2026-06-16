/**
 * DomainHintsSection — per-domain tips for the chat agent + the learned
 * memory derived from prior task outcomes.
 *
 * Moved out of the legacy chat-side SettingsModal as part of the cog-removal
 * pass; lives on the Skills tab alongside the formal skill library.
 */

import { useState, useEffect } from 'preact/hooks';
import { showConfirm } from '../hooks/useDialog.js';
import { showToast } from '../hooks/useToast.js';
import { notifyConfigChanged } from '../hooks/useConfig.js';

export function DomainHintsSection({ config }) {
  const [skillForm, setSkillForm] = useState({
    domain: '',
    skill: '',
    isOpen: false,
    editIndex: -1,
  });
  const [memStats, setMemStats] = useState(null);
  const [memSkills, setMemSkills] = useState([]);

  useEffect(() => {
    Promise.all([
      chrome.runtime.sendMessage({ type: 'GET_MEMORY_STATS' }),
      chrome.runtime.sendMessage({ type: 'GET_LEARNED_SKILLS' }),
    ])
      .then(([s, sk]) => {
        setMemStats(s);
        setMemSkills(sk || []);
      })
      .catch(() => {});
  }, []);

  const persistUserSkills = async (nextSkills) => {
    await chrome.runtime.sendMessage({
      type: 'SAVE_CONFIG',
      payload: {
        providerKeys: config.providerKeys,
        customModels: config.customModels,
        currentModelIndex: config.currentModelIndex,
        userSkills: nextSkills,
      },
    });
    await config.loadConfig();
    notifyConfigChanged();
  };

  const handleAdd = async () => {
    if (!skillForm.domain || !skillForm.skill) {
      showToast('Please fill in both domain and tips/guidance', { kind: 'error' });
      return;
    }
    const newSkill = { domain: skillForm.domain.toLowerCase(), skill: skillForm.skill };
    let next;
    if (skillForm.editIndex >= 0) {
      next = config.userSkills.map((s, i) => (i === skillForm.editIndex ? newSkill : s));
    } else {
      const existingIndex = config.userSkills.findIndex((s) => s.domain === newSkill.domain);
      next = [...config.userSkills];
      if (existingIndex >= 0) next[existingIndex] = newSkill;
      else next.push(newSkill);
    }
    await persistUserSkills(next);
    setSkillForm({ domain: '', skill: '', isOpen: false, editIndex: -1 });
  };

  const handleEdit = (index) => {
    const skill = config.userSkills[index];
    setSkillForm({ domain: skill.domain, skill: skill.skill, isOpen: true, editIndex: index });
  };

  const handleRemove = async (index) => {
    await persistUserSkills(config.userSkills.filter((_, i) => i !== index));
  };

  const handleClearHistory = async () => {
    const ok = await showConfirm('Clear all task history?', {
      title: 'Clear task history',
      okLabel: 'Clear',
      destructive: true,
    });
    if (!ok) return;
    chrome.runtime.sendMessage({ type: 'CLEAR_TASK_HISTORY' }).then(() => {
      chrome.runtime.sendMessage({ type: 'GET_MEMORY_STATS' }).then((s) => setMemStats(s));
    });
  };

  const handleDeleteMemSkill = (domain) => {
    chrome.runtime.sendMessage({ type: 'DELETE_LEARNED_SKILL', payload: { domain } }).then(() => {
      chrome.runtime.sendMessage({ type: 'GET_LEARNED_SKILLS' }).then((sk) => setMemSkills(sk || []));
    });
  };

  return (
    <>
      <section className="bmx-section">
        <h3>Domain hints</h3>
        <p className="bmx-hint">Tips to help the chat agent navigate specific websites.</p>

        <div class="settings-rows">
          {config.userSkills.map((skill, i) => (
            <div key={i} class="settings-row">
              <div class="settings-row-info">
                <div class="settings-row-name">{skill.domain}</div>
                <div class="settings-row-sub">{skill.skill.substring(0, 60)}...</div>
              </div>
              <div class="settings-row-actions">
                <button class="settings-row-action" onClick={() => handleEdit(i)}>Edit</button>
                <button class="settings-row-delete" onClick={() => handleRemove(i)}>&times;</button>
              </div>
            </div>
          ))}

          {config.builtInSkills.map((skill, i) => (
            <div key={`b-${i}`} class="settings-row builtin">
              <div class="settings-row-info">
                <div class="settings-row-name">
                  {skill.domain} <span class="settings-badge">built-in</span>
                </div>
                <div class="settings-row-sub">{skill.skill.substring(0, 60)}...</div>
              </div>
            </div>
          ))}

          {!skillForm.isOpen ? (
            <div
              class="settings-row add-row"
              onClick={() =>
                setSkillForm({ domain: '', skill: '', isOpen: true, editIndex: -1 })
              }
            >
              <div class="settings-row-name">+ Add domain hint</div>
              <span class="settings-row-arrow">&#8250;</span>
            </div>
          ) : (
            <div class="settings-inline-form">
              <input
                type="text"
                placeholder="Domain (e.g., github.com)"
                value={skillForm.domain}
                onInput={(e) => setSkillForm({ ...skillForm, domain: e.target.value })}
              />
              <textarea
                placeholder="Tips and guidance..."
                value={skillForm.skill}
                onInput={(e) => setSkillForm({ ...skillForm, skill: e.target.value })}
                rows={3}
              />
              <div class="settings-form-actions">
                <button
                  class="btn btn-secondary btn-sm"
                  onClick={() => setSkillForm({ ...skillForm, isOpen: false })}
                >
                  Cancel
                </button>
                <button class="btn btn-primary btn-sm" onClick={handleAdd}>
                  {skillForm.editIndex >= 0 ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="bmx-section">
        <h3>Learned memory</h3>
        <p className="bmx-hint">Auto-generated from task history.</p>

        {memStats && (
          <div class="memory-stats-row">
            <div class="memory-stat">
              <span class="memory-stat-val">{memStats.totalTasks}</span> tasks
            </div>
            <div class="memory-stat">
              <span class="memory-stat-val">{memStats.totalDomains}</span> domains
            </div>
            <div class="memory-stat">
              <span class="memory-stat-val">{memStats.learnedSkillCount}</span> skills
            </div>
          </div>
        )}

        <div class="settings-rows">
          {memSkills.map((s) => (
            <div key={s.domain} class="settings-row">
              <div class="settings-row-info">
                <div class="settings-row-name">
                  {s.domain} <span class="settings-badge">{s.successRate}</span>
                </div>
                <div class="settings-row-sub">{s.skill.substring(0, 80)}...</div>
              </div>
              <button class="settings-row-delete" onClick={() => handleDeleteMemSkill(s.domain)}>
                &times;
              </button>
            </div>
          ))}
        </div>

        {memStats?.totalTasks > 0 && (
          <button
            class="btn btn-secondary btn-sm"
            style={{ marginTop: '8px' }}
            onClick={handleClearHistory}
          >
            Clear task history
          </button>
        )}
      </section>
    </>
  );
}
