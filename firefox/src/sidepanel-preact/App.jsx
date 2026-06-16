import { useState, useCallback, useEffect } from 'preact/hooks';
import { useConfig } from './hooks/useConfig';
import { useChat } from './hooks/useChat';
import { useChatHistory } from './hooks/useChatHistory';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { InputArea } from './components/InputArea';
import { PlanModal } from './components/PlanModal';
import { EmptyState } from './components/EmptyState';
import { SaveAsSkillBanner } from './components/SaveAsSkillBanner';
import { TabBar, TABS } from './components/TabBar';
import { DialogHost } from './components/DialogHost';
import { ToastHost } from './components/ToastHost';
import { TasksTab } from './tabs/TasksTab';
import { MemoryTab } from './tabs/MemoryTab';
import { SkillsTab } from './tabs/SkillsTab';
import { AgentsTab } from './tabs/AgentsTab';
import { RegistryTab } from './tabs/RegistryTab';
import { SettingsTab } from './tabs/SettingsTab';
import { OnboardingWizard } from './components/OnboardingWizard';
import { useTheme } from './hooks/useTheme';

const ACTIVE_TAB_STORAGE_KEY = 'browser-memex.activeTab';

function loadActiveTab() {
  try {
    return localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || 'chat';
  } catch {
    return 'chat';
  }
}

function saveActiveTab(id) {
  try {
    localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}

const ONBOARDED_KEY = 'browser-memex.onboardedAt';

function loadOnboarded() {
  try {
    return Boolean(localStorage.getItem(ONBOARDED_KEY));
  } catch {
    return false;
  }
}

export function App() {
  useTheme();
  const [activeTab, setActiveTab] = useState(loadActiveTab);
  const [suggestedText, setSuggestedText] = useState('');
  const [skillDraft, setSkillDraft] = useState(null);
  const [onboarded, setOnboarded] = useState(loadOnboarded);
  const config = useConfig();
  const chat = useChat();
  const history = useChatHistory();

  // Listen for in-page selection-toolbar dispatches.
  useEffect(() => {
    const onMessage = (msg) => {
      if (!msg || typeof msg.type !== 'string') return;
      if (msg.type === 'SET_PREFILL' && typeof msg.text === 'string') {
        setActiveTab('chat');
        setSuggestedText(msg.text);
      } else if (msg.type === 'SKILL_DRAFT' && msg.draft) {
        setActiveTab('skills');
        setSkillDraft(msg.draft);
      }
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, []);

  // On mount, check chrome.storage for a pending prefill or skill draft.
  // Used when the side panel opens fresh (e.g., Firefox tab fallback) and
  // missed the live runtime broadcast.
  useEffect(() => {
    const TEN_MIN = 10 * 60 * 1000;
    const now = Date.now();
    chrome.storage?.local
      .get(['bmx.pending-prefill', 'bmx.pending-skill-draft'])
      .then((res) => {
        const pf = res?.['bmx.pending-prefill'];
        if (pf?.text && now - (pf.ts ?? 0) < TEN_MIN) {
          setActiveTab('chat');
          setSuggestedText(pf.text);
          chrome.storage.local.remove('bmx.pending-prefill').catch(() => {});
        }
        const sd = res?.['bmx.pending-skill-draft'];
        if (sd?.draft && now - (sd.ts ?? 0) < TEN_MIN) {
          setActiveTab('skills');
          setSkillDraft(sd.draft);
          chrome.storage.local.remove('bmx.pending-skill-draft').catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const finishOnboarding = useCallback(() => {
    try { localStorage.setItem(ONBOARDED_KEY, String(Date.now())); } catch { /* ignore */ }
    setOnboarded(true);
    setActiveTab('tasks');
  }, []);

  useEffect(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);

  const handleNewChat = useCallback(() => {
    history.newSession(chat.messages);
    chat.clearChat();
  }, [chat.messages, chat.clearChat, history.newSession]);

  const handleSelectSession = useCallback((sessionId) => {
    if (chat.messages.length > 0) {
      history.saveSession(chat.messages);
    }
    const messages = history.restoreSession(sessionId);
    if (messages) chat.restoreMessages(messages);
  }, [chat.messages, history.saveSession, history.restoreSession, chat.restoreMessages]);

  if (config.isLoading) {
    return (
      <div class="loading-container">
        <div class="loading-spinner" />
      </div>
    );
  }

  if (!onboarded) {
    return (
      <div class="app">
        <OnboardingWizard onFinish={finishOnboarding} onSkip={finishOnboarding} />
      </div>
    );
  }

  return (
    <div class="app">
      <div class="bmx-shell">
        <div class="bmx-main">
          <div class="bmx-tab-container">
            {activeTab === 'chat' && (
              <ChatPanel
                chat={chat}
                config={config}
                history={history}
                handleNewChat={handleNewChat}
                handleSelectSession={handleSelectSession}
                suggestedText={suggestedText}
                setSuggestedText={setSuggestedText}
              />
            )}
            {activeTab === 'tasks' && <TasksTab />}
            {activeTab === 'memory' && <MemoryTab />}
            {activeTab === 'skills' && (
              <SkillsTab
                initialDraft={skillDraft}
                onDraftConsumed={() => setSkillDraft(null)}
              />
            )}
            {activeTab === 'agents' && <AgentsTab />}
            {activeTab === 'registry' && <RegistryTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
        <TabBar
          active={activeTab}
          onSelect={setActiveTab}
          extraTabs={[{ id: 'chat', label: 'Chat' }]}
          onManageProfiles={() => setActiveTab('settings')}
        />
      </div>

      {chat.pendingPlan && (
        <PlanModal
          plan={chat.pendingPlan}
          onApprove={chat.approvePlan}
          onCancel={chat.cancelPlan}
        />
      )}

      <DialogHost />
      <ToastHost />
    </div>
  );
}

function ChatPanel({
  chat,
  config,
  history,
  handleNewChat,
  handleSelectSession,
  suggestedText,
  setSuggestedText,
}) {
  const hasMessages = chat.messages.length > 0;
  return (
    <>
      <Header
        currentModel={config.currentModel}
        availableModels={config.availableModels}
        currentModelIndex={config.currentModelIndex}
        onModelSelect={config.selectModel}
        onNewChat={handleNewChat}
        sessions={history.sessions}
        activeSessionId={history.activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={history.deleteSession}
      />

      <div class="messages-container">
        {!hasMessages ? (
          <EmptyState onSelectExample={setSuggestedText} />
        ) : (
          <MessageList
            messages={chat.messages}
            pendingStep={chat.pendingStep}
            currentSteps={chat.currentSteps}
          />
        )}
        {chat.lastTrajectory && (
          <SaveAsSkillBanner
            trajectory={chat.lastTrajectory}
            onDismiss={chat.dismissLastTrajectory}
          />
        )}
      </div>

      <InputArea
        isRunning={chat.isRunning}
        attachedImages={chat.attachedImages}
        onSend={chat.sendMessage}
        onStop={chat.stopTask}
        onAddImage={chat.addImage}
        onRemoveImage={chat.removeImage}
        hasModels={config.availableModels.length > 0}
        suggestedText={suggestedText}
        onClearSuggestion={() => setSuggestedText('')}
      />
    </>
  );
}
