# BrowserMemex

Browser extension. Ready to install. Chrome and Firefox builds in one place.

## What's here

```
chrome/   ← unpacked Chrome build, load this folder
firefox/  ← unpacked Firefox build, load manifest.json from this folder
browser-memex-chrome.zip   ← same Chrome build, zipped
browser-memex-firefox.zip  ← same Firefox build, zipped
```

## Install in Chrome

1. Open `chrome://extensions` in a new tab.
2. Turn on Developer mode (toggle in the top right).
3. Click "Load unpacked".
4. Pick the `chrome/` folder from this repo.

You should see a BM icon in the toolbar. Click it to open the side panel.

## Install in Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on...".
3. Pick `firefox/manifest.json` from this repo.

You should see a BM icon in the toolbar. The sidebar opens with View > Sidebar > BrowserMemex, or just click the toolbar icon.

Firefox forgets temporary add-ons when you restart it. To keep it installed, use the signed `.xpi` once it's on Add-ons Mozilla.

## First time setup

1. Open the side panel.
2. Pick a name for your workspace when prompted (or skip and keep the default).
3. Open the Agents tab.
4. Pick the AI you use. Copy the config snippet into that AI's MCP settings. Restart it.
5. The new tools (memex_memory_query, memex_skills_run, etc.) show up.

## What it does

One workspace your AIs share. Memory, saved tasks, schedules. Switch from Claude Code to Cursor to whatever ships next, the workspace stays.

Everything is on your computer. Nothing gets uploaded.

## Where to file bugs

Open an issue here. Include:

- Which browser, which version.
- What you clicked.
- What you expected.
- What you got. (A screenshot helps.)
- Anything in the console (right click the side panel > Inspect > Console).
