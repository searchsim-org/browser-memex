/**
 * ConnectAgentWizard — one-page wizard that generates the MCP config
 * snippet for connecting BrowserMemex into an external coding agent.
 *
 * This is the "switching agents is a no-op" UX: drop this snippet into
 * Claude Code (or Cursor / Codex / Gemini CLI / VS Code / Windsurf / Cline /
 * Roo Code / Amp), restart the agent, and it has full access to the user's
 * memex via the memex_* MCP tools.
 *
 * Each agent has a slightly different config file location; we surface the
 * exact path + the JSON snippet, plus a copy button.
 */

import { useState } from 'preact/hooks';

const AGENTS = {
  'claude-code': {
    label: 'Claude Code',
    docs: 'https://docs.claude.com/claude-code/mcp',
    configPath: '~/.config/claude-code/config.json (or via /mcp command)',
    snippet: {
      mcpServers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  cursor: {
    label: 'Cursor',
    docs: 'https://docs.cursor.com/context/mcp',
    configPath: '~/.cursor/mcp.json',
    snippet: {
      mcpServers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  codex: {
    label: 'Codex CLI',
    docs: 'https://github.com/openai/codex',
    configPath: '~/.codex/config.toml',
    snippet: {
      kind: 'toml',
      text:
        `[mcp_servers.browser-memex]\n` +
        `command = "npx"\n` +
        `args = ["-y", "@browser-memex/mcp-server"]\n`,
    },
  },
  'gemini-cli': {
    label: 'Gemini CLI',
    docs: 'https://github.com/google-gemini/gemini-cli',
    configPath: '~/.gemini/settings.json',
    snippet: {
      mcpServers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  vscode: {
    label: 'VS Code (GitHub Copilot)',
    docs: 'https://code.visualstudio.com/docs/copilot/customization/mcp-servers',
    configPath: '.vscode/mcp.json or User settings.json',
    snippet: {
      servers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  windsurf: {
    label: 'Windsurf',
    docs: 'https://docs.windsurf.com/windsurf/cascade/mcp',
    configPath: '~/.codeium/windsurf/mcp_config.json',
    snippet: {
      mcpServers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  cline: {
    label: 'Cline',
    docs: 'https://docs.cline.bot/mcp/mcp-overview',
    configPath: 'Cline → Settings → MCP Servers → Edit JSON',
    snippet: {
      mcpServers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  'roo-code': {
    label: 'Roo Code',
    docs: 'https://docs.roocode.com/features/mcp/using-mcp-in-roo',
    configPath: 'Roo Code → MCP Settings → mcp_settings.json',
    snippet: {
      mcpServers: {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
  amp: {
    label: 'Amp',
    docs: 'https://ampcode.com/manual#mcp',
    configPath: 'VS Code settings → "amp.mcpServers"',
    snippet: {
      'amp.mcpServers': {
        'browser-memex': {
          command: 'npx',
          args: ['-y', '@browser-memex/mcp-server'],
        },
      },
    },
  },
};

function snippetText(agentId) {
  const a = AGENTS[agentId];
  if (!a) return '';
  if (a.snippet?.kind === 'toml') return a.snippet.text;
  return JSON.stringify(a.snippet, null, 2);
}

export function ConnectAgentWizard({ agentId, onClose }) {
  const [copied, setCopied] = useState(false);
  const agent = AGENTS[agentId];

  if (!agent) {
    return (
      <div className="bmx-modal-overlay" onClick={onClose}>
        <div className="bmx-modal" onClick={(e) => e.stopPropagation()}>
          <header className="bmx-modal__header">
            <h3>Connect agent</h3>
            <button className="bmx-modal__close" onClick={onClose} aria-label="Close">×</button>
          </header>
          <p>No connector definition for agent "{agentId}".</p>
        </div>
      </div>
    );
  }

  const text = snippetText(agentId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard denied; user can copy manually */
    }
  };

  return (
    <div className="bmx-modal-overlay" onClick={onClose}>
      <div className="bmx-modal" onClick={(e) => e.stopPropagation()}>
        <header className="bmx-modal__header">
          <h3>Connect {agent.label} to BrowserMemex</h3>
          <button className="bmx-modal__close" onClick={onClose} aria-label="Close">×</button>
        </header>

        <ol className="bmx-modal__steps">
          <li>
            Open your {agent.label} MCP configuration:
            <code className="bmx-modal__path">{agent.configPath}</code>
          </li>
          <li>
            Paste this snippet under <code>mcpServers</code> (merging with any
            existing servers):
            <pre className="bmx-modal__snippet">{text}</pre>
            <button className="bmx-btn" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy snippet'}
            </button>
          </li>
          <li>
            Restart {agent.label}. The new tools — <code>memex_memory_query</code>,{' '}
            <code>memex_skills_list</code>, <code>memex_skills_run</code>,{' '}
            <code>memex_tasks_list</code>, <code>memex_tasks_create</code>,{' '}
            <code>memex_profile_active</code> — should appear.
          </li>
          <li>
            Verify by asking the agent: <em>"Use memex_profile_active to tell me
            which BrowserMemex profile is active."</em>
          </li>
        </ol>

        <p className="bmx-hint">
          Reference: <a href={agent.docs} target="_blank" rel="noreferrer">{agent.label} MCP docs</a>
        </p>
      </div>
    </div>
  );
}
