import { useState, useEffect, useCallback } from 'preact/hooks';

const STORAGE_KEY = 'chatSessions';
const MAX_SESSIONS = 30;

/**
 * Manages chat session history in chrome.storage.local.
 * Each session: { id, title, messages, createdAt, updatedAt }
 */
export function useChatHistory() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Load sessions on mount
  useEffect(() => {
    chrome.storage.local.get(STORAGE_KEY).then(({ chatSessions }) => {
      const list = chatSessions || [];
      setSessions(list);
    });
  }, []);

  const persist = (list) => {
    chrome.storage.local.set({ [STORAGE_KEY]: list });
  };

  // Save current messages to the active session (or create a new one)
  const saveSession = useCallback((messages) => {
    if (!messages || messages.length === 0) return;

    setSessions(prev => {
      const firstUserMsg = messages.find(m => m.type === 'user');
      const title = firstUserMsg
        ? firstUserMsg.text.substring(0, 60) + (firstUserMsg.text.length > 60 ? '...' : '')
        : 'New Chat';
      const now = Date.now();

      let updated;
      if (activeSessionId) {
        // Update existing session
        updated = prev.map(s =>
          s.id === activeSessionId
            ? { ...s, title, messages, updatedAt: now }
            : s
        );
      } else {
        // Create new session
        const newSession = { id: now, title, messages, createdAt: now, updatedAt: now };
        setActiveSessionId(now);
        updated = [newSession, ...prev].slice(0, MAX_SESSIONS);
      }

      persist(updated);
      return updated;
    });
  }, [activeSessionId]);

  // Start a new chat — save current first, then reset
  const newSession = useCallback((currentMessages) => {
    if (currentMessages && currentMessages.length > 0) {
      // Save current before starting new
      const firstUserMsg = currentMessages.find(m => m.type === 'user');
      const title = firstUserMsg
        ? firstUserMsg.text.substring(0, 60) + (firstUserMsg.text.length > 60 ? '...' : '')
        : 'New Chat';
      const now = Date.now();

      setSessions(prev => {
        let updated;
        if (activeSessionId) {
          updated = prev.map(s =>
            s.id === activeSessionId
              ? { ...s, title, messages: currentMessages, updatedAt: now }
              : s
          );
        } else {
          updated = [{ id: now, title, messages: currentMessages, createdAt: now, updatedAt: now }, ...prev].slice(0, MAX_SESSIONS);
        }
        persist(updated);
        return updated;
      });
    }

    setActiveSessionId(null);
  }, [activeSessionId]);

  // Restore a previous session
  const restoreSession = useCallback((sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      return session.messages;
    }
    return null;
  }, [sessions]);

  // Delete a session
  const deleteSession = useCallback((sessionId) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      persist(updated);
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
      return updated;
    });
  }, [activeSessionId]);

  return {
    sessions,
    activeSessionId,
    saveSession,
    newSession,
    restoreSession,
    deleteSession,
  };
}
