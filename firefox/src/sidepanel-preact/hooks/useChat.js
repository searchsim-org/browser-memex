import { useState, useEffect, useCallback, useRef } from 'preact/hooks';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [attachedImages, setAttachedImages] = useState([]);
  const [sessionTabGroupId, setSessionTabGroupId] = useState(null);
  const [pendingPlan, setPendingPlan] = useState(null);
  // Phase E.1: the most recent successful run's trajectory, available for
  // "Save as skill" until the user starts another task.
  const [lastTrajectory, setLastTrajectory] = useState(null);

  // Steps tracking for current task
  const [pendingStep, setPendingStep] = useState(null);
  const [currentSteps, setCurrentSteps] = useState([]);
  const currentStepsRef = useRef([]);

  // Streaming state
  const streamingTextRef = useRef('');
  const [streamingMessageId, setStreamingMessageId] = useState(null);

  // Listen for messages from service worker
  useEffect(() => {
    const listener = (message) => {
      switch (message.type) {
        case 'TASK_UPDATE':
          handleTaskUpdate(message.update);
          break;
        case 'TASK_COMPLETE':
          handleTaskComplete(message.result, message.trajectory);
          break;
        case 'TASK_ERROR':
          handleTaskError(message.error);
          break;
        case 'PLAN_APPROVAL_REQUIRED':
          setPendingPlan(message.plan);
          break;
        case 'SESSION_GROUP_UPDATE':
          setSessionTabGroupId(message.tabGroupId);
          break;
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);

  const handleTaskUpdate = useCallback((update) => {
    if (update.status === 'thinking') {
      // Show thinking indicator - add a thinking message
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking');
        return [...filtered, { id: Date.now(), type: 'thinking' }];
      });
      setStreamingMessageId(null);
      streamingTextRef.current = '';
    } else if (update.status === 'streaming' && update.text) {
      // Remove thinking indicator and update streaming message
      streamingTextRef.current = update.text;
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking');
        const existingStreamingIndex = filtered.findIndex(m => m.type === 'streaming');

        if (existingStreamingIndex >= 0) {
          const updated = [...filtered];
          updated[existingStreamingIndex] = {
            ...updated[existingStreamingIndex],
            text: update.text,
          };
          return updated;
        } else {
          const msgId = Date.now();
          setStreamingMessageId(msgId);
          return [...filtered, {
            id: msgId,
            type: 'streaming',
            text: update.text,
          }];
        }
      });
    } else if (update.status === 'executing') {
      // Remove thinking indicator, store pending step
      setMessages(prev => prev.filter(m => m.type !== 'thinking'));
      setPendingStep({ tool: update.tool, input: update.input });
    } else if (update.status === 'executed') {
      // Add completed step to ref and state (state triggers re-render for live counter)
      const newSteps = [...currentStepsRef.current, {
        tool: update.tool,
        input: pendingStep?.input || update.input,
        result: update.result,
      }];
      currentStepsRef.current = newSteps;
      setCurrentSteps(newSteps);
      setPendingStep(null);
    } else if (update.status === 'message' && update.text) {
      // Finalize message with its steps
      const stepsForMessage = [...currentStepsRef.current];
      currentStepsRef.current = [];
      setCurrentSteps([]);
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking' && m.type !== 'streaming');
        return [...filtered, {
          id: Date.now(),
          type: 'assistant',
          text: update.text,
          steps: stepsForMessage, // Attach steps to this message
        }];
      });
      setStreamingMessageId(null);
      streamingTextRef.current = '';
    }
  }, [pendingStep]);

  const handleTaskComplete = useCallback((result, trajectory) => {
    setIsRunning(false);
    setStreamingMessageId(null);
    streamingTextRef.current = '';
    // Stash the trajectory if the run was successful and has any steps; the
    // chat UI surfaces a "Save this run as a skill" affordance.
    if (result?.success && trajectory && trajectory.steps?.length > 0) {
      setLastTrajectory(trajectory);
    } else {
      setLastTrajectory(null);
    }

    // Flush any accumulated steps that weren't attached to a message
    const orphanedSteps = [...currentStepsRef.current];
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);

    setMessages(prev => {
      let filtered = prev.filter(m => m.type !== 'thinking' && m.type !== 'streaming');
      // Show orphaned steps as a completed steps block
      if (orphanedSteps.length > 0) {
        filtered = [...filtered, {
          id: Date.now(),
          type: 'assistant',
          text: '',
          steps: orphanedSteps,
        }];
      }
      if (result.message && !result.success) {
        filtered = [...filtered, {
          id: Date.now() + 1,
          type: 'system',
          text: result.message,
        }];
      }
      return filtered;
    });
  }, []);

  const handleTaskError = useCallback((error) => {
    setIsRunning(false);
    setStreamingMessageId(null);
    streamingTextRef.current = '';

    // Flush any accumulated steps that weren't attached to a message
    const orphanedSteps = [...currentStepsRef.current];
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);

    setMessages(prev => {
      let filtered = prev.filter(m => m.type !== 'thinking' && m.type !== 'streaming');
      // Show orphaned steps as a completed steps block
      if (orphanedSteps.length > 0) {
        filtered = [...filtered, {
          id: Date.now(),
          type: 'assistant',
          text: '',
          steps: orphanedSteps,
        }];
      }
      return [...filtered, {
        id: Date.now() + 1,
        type: 'error',
        text: `Error: ${error}`,
      }];
    });
  }, []);

  const sendMessage = useCallback(async (text, { background = false } = {}) => {
    if (!text.trim() || isRunning) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text,
      images: [...attachedImages],
      background,
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear attached images and reset steps
    const imagesToSend = [...attachedImages];
    setAttachedImages([]);
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);

    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        text: 'No active tab found',
      }]);
      return;
    }

    setIsRunning(true);

    try {
      await chrome.runtime.sendMessage({
        type: 'START_TASK',
        payload: {
          tabId: tab.id,
          task: text,
          askBeforeActing: false,
          images: imagesToSend,
          tabGroupId: sessionTabGroupId,
          background,
        },
      });
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        text: `Error: ${error.message}`,
      }]);
      setIsRunning(false);
    }
  }, [isRunning, attachedImages, sessionTabGroupId]);

  const stopTask = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'STOP_TASK' }).catch(() => {});
    setIsRunning(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    currentStepsRef.current = [];
    setPendingStep(null);
    setStreamingMessageId(null);
    streamingTextRef.current = '';
    setSessionTabGroupId(null);
    chrome.runtime.sendMessage({ type: 'CLEAR_CONVERSATION' }).catch(() => {});
  }, []);

  const approvePlan = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'PLAN_APPROVAL_RESPONSE', payload: { approved: true } });
    setPendingPlan(null);
  }, []);

  const cancelPlan = useCallback(() => {
    chrome.runtime.sendMessage({ type: 'PLAN_APPROVAL_RESPONSE', payload: { approved: false } });
    setPendingPlan(null);
  }, []);

  const addImage = useCallback((dataUrl) => {
    setAttachedImages(prev => [...prev, dataUrl]);
  }, []);

  const removeImage = useCallback((index) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setAttachedImages([]);
  }, []);

  // Restore messages from a saved session
  const restoreMessages = useCallback((savedMessages) => {
    setMessages(savedMessages || []);
    currentStepsRef.current = [];
    setCurrentSteps([]);
    setPendingStep(null);
    setStreamingMessageId(null);
    streamingTextRef.current = '';
    setIsRunning(false);
    // Restore conversation history in the service worker
    chrome.runtime.sendMessage({ type: 'CLEAR_CONVERSATION' }).catch(() => {});
  }, []);

  const dismissLastTrajectory = useCallback(() => setLastTrajectory(null), []);

  return {
    // State
    messages,
    isRunning,
    attachedImages,
    pendingStep,
    pendingPlan,
    currentSteps,
    lastTrajectory,

    // Actions
    sendMessage,
    stopTask,
    clearChat,
    approvePlan,
    cancelPlan,
    addImage,
    removeImage,
    clearImages,
    restoreMessages,
    dismissLastTrajectory,
  };
}
