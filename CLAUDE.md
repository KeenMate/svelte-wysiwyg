# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

@keenmate/svelte-wysiwyg is a Svelte wrapper component for the Jodit WYSIWYG rich text editor. This is a monorepo using npm workspaces, with separate packages for Svelte 4 and Svelte 5.

## Repository Structure

```
svelte-wysiwyg/
├── packages/
│   ├── svelte-wysiwyg-v4/       # Svelte 4 version → publishes as v4.x.x
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── WysiwygEditor.svelte
│   │   │   └── modeButtons.js
│   │   ├── dist/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── index.d.ts
│   └── svelte-wysiwyg-v5/       # Svelte 5 version → publishes as v5.x.x
│       ├── src/
│       │   ├── index.js
│       │   ├── WysiwygEditor.svelte
│       │   └── modeButtons.js
│       ├── dist/
│       ├── package.json
│       ├── vite.config.ts
│       └── index.d.ts
└── docs/                        # Examples and documentation (uses v5)
    ├── src/
    │   ├── main.js
    │   ├── App.svelte
    │   ├── PropsDemo.svelte
    │   └── ToolbarDemo.svelte
    ├── index.html
    ├── examples-basic.html
    ├── examples-props.html
    ├── examples-toolbar.html
    ├── package.json
    └── vite.config.ts
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all workspace dependencies |
| `make dev` | Start Svelte 5 dev server (docs with HMR) |
| `make dev VER=4` | Start Svelte 4 dev server |
| `make dev4` / `make dev5` | Shortcuts for specific versions |
| `make build` | Build Svelte 5 package |
| `make build VER=4` | Build Svelte 4 package |
| `make build VER=all` | Build all packages + docs |
| `make package` | Package v5 for publishing |
| `make package VER=4` | Package v4 for publishing |
| `make publish` | Publish v5 to npm |
| `make publish VER=4` | Publish v4 to npm |
| `make clean` | Clean build artifacts |

## Architecture

### Svelte 5 Package (packages/svelte-wysiwyg-v5/)

Uses Svelte 5 runes:

**Props (using `$props()` with `$bindable`):**
- `editorConstructor` (required): The Jodit class constructor
- `value`: HTML content string (bindable)
- `mode`: Editor mode 1/2/3 (bindable)
- `config`: Jodit configuration object
- `disabled`, `readonly`: Dynamic props (can change at runtime)
- `height`, `width`, `placeholder`, `theme`, etc.: Static props (merged into config at init)

**Callback Props:**
- `onReady(instance)` - Editor initialized
- `onInput({ data, instance })` - Content changed
- `onModeChange({ mode, instance })` - Mode changed
- `onFocus({ evt, instance })` - Editor focused
- `onBlur({ evt, instance })` - Editor blurred
- `onDestroy(instance)` - Component destroyed

### Svelte 4 Package (packages/svelte-wysiwyg-v4/)

Same API as v5 but uses Svelte 4 syntax:
- `export let` instead of `$props()`
- `$:` reactive statements instead of `$effect()`
- `onMount`/`onDestroy` for lifecycle

### Docs Package (docs/)

Vite-based development environment with:
- Path aliases pointing to v5 library source for HMR
- Multiple example HTML pages demonstrating features:
  - Basic usage with mode switching
  - Component props configuration
  - Toolbar customization

## Key Patterns

1. **Svelte 5 Runes**: v5 uses `$props()`, `$state()`, `$effect()`, `$bindable()`, `untrack()`
2. **Svelte 4 Syntax**: v4 uses `export let`, `$:`, `onMount`, `onDestroy`
3. **Callback props**: Instead of events, accepts callback functions
4. **Selection marker cleanup**: Strips Jodit selection markers from value to prevent accumulation
5. **Mode change handling**: Uses `beforeSetMode`/`afterSetMode` events to prevent duplicate mode changes
6. **Workspace aliases**: docs/ imports from v5 source during dev for HMR

## Build Output

Both packages generate in `dist/`:
- `svelte-wysiwyg.js` (ES module)
- `svelte-wysiwyg.umd.js` (UMD)

TypeScript definitions are in `index.d.ts` at package root.

## Publishing

Packages are published separately with versioned names:
- `@keenmate/svelte-wysiwyg-v4` - Svelte 4 version
- `@keenmate/svelte-wysiwyg-v5` - Svelte 5 version

Users install with:
- `npm i @keenmate/svelte-wysiwyg-v5 jodit` for Svelte 5
- `npm i @keenmate/svelte-wysiwyg-v4 jodit` for Svelte 4
