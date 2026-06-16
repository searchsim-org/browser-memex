const EXAMPLES = [
  'Go to Gmail and unsubscribe from all marketing emails from the last week',
  'Apply for the senior engineer position on careers.acme.com',
  'Log into my bank and download last month\'s statement',
  'Find AI engineer jobs on LinkedIn in San Francisco',
];

export function EmptyState({ onSelectExample }) {
  return (
    <div class="empty-state">
      <div class="empty-logo">
        <img src="../../icons/icon-128.png" alt="BrowserMemex" />
      </div>
      <p>Describe what you want to accomplish and the AI will browse autonomously to complete your task.</p>
      <div class="empty-examples">
        {EXAMPLES.map((example, i) => (
          <button
            key={i}
            class="example-chip"
            onClick={() => onSelectExample(example)}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
