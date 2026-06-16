import { useState, useRef, useEffect } from 'preact/hooks';
import { getToolIcon, getActionDescription, formatStepResult, escapeHtml } from '../utils/format';

export function StepsSection({ steps, pendingStep }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prevCountRef = useRef(0);
  const listRef = useRef(null);

  const completedCount = steps.length;
  const totalSteps = completedCount + (pendingStep ? 1 : 0);
  const hasPending = !!pendingStep;

  useEffect(() => {
    if (isExpanded && listRef.current && steps.length > prevCountRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    prevCountRef.current = steps.length;
  }, [steps.length, isExpanded]);

  if (totalSteps === 0) return null;

  return (
    <div class="steps-thread">
      <div
        class={`steps-thread-toggle ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div class="steps-thread-label">
          Agent Steps
        </div>
        <div class={`steps-thread-badge ${hasPending ? 'running' : 'done'}`}>
          {hasPending ? (
            <><span class="steps-thread-pulse" />{completedCount} of {totalSteps}</>
          ) : (
            <>{completedCount} done</>
          )}
        </div>
        <svg class="steps-thread-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div ref={listRef} class={`steps-thread-list ${isExpanded ? 'visible' : ''}`}>
        {steps.map((step, index) => (
          <StepRow key={index} step={step} status="completed" index={index} />
        ))}
        {pendingStep && (
          <StepRow step={pendingStep} status="pending" index={steps.length} />
        )}
      </div>
    </div>
  );
}

function StepRow({ step, status, index }) {
  const description = getActionDescription(step.tool, step.input);
  const resultText = status === 'completed' ? formatStepResult(step.result) : null;

  return (
    <div class={`steps-thread-row ${status}`} style={{ animationDelay: `${Math.min(index * 30, 200)}ms` }}>
      <span class="steps-thread-icon">
        {status === 'completed' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="11" height="11"><polyline points="20 6 9 17 4 12" /></svg>
        ) : (
          <span class="steps-thread-spinner" />
        )}
      </span>
      <span class="steps-thread-desc">{escapeHtml(description)}</span>
      {resultText && <span class="steps-thread-result">{escapeHtml(resultText)}</span>}
    </div>
  );
}
