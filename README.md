## @keenmate/svelte-wysiwyg

Svelte wrapper component for the [Jodit WYSIWYG editor](https://xdsoft.net/jodit/).

### Installation

**For Svelte 5:** (v2.x)
```bash
npm i @keenmate/svelte-wysiwyg@2 jodit
```

**For Svelte 4:** (v1.x)
```bash
npm i @keenmate/svelte-wysiwyg@1 jodit
```

### Usage

#### Svelte 5

```svelte
<script>
  import WysiwygEditor from '@keenmate/svelte-wysiwyg';
  import 'jodit/es2021/jodit.min.css';
  import { Jodit } from 'jodit/esm/index.js';

  let editorValue = $state('<p>Hello World</p>');

  function handleReady(editor) {
    console.log('Editor ready:', editor.isReady);
  }

  function handleInput({ data }) {
    console.log('Content changed:', data);
  }
</script>

<WysiwygEditor
  editorConstructor={Jodit}
  bind:value={editorValue}
  config={{ height: 400 }}
  onReady={handleReady}
  onInput={handleInput}
/>
```

#### Svelte 4

```svelte
<script>
  import WysiwygEditor from '@keenmate/svelte-wysiwyg';
  import 'jodit/es2021/jodit.min.css';
  import { Jodit } from 'jodit/esm/index.js';

  let editorValue = '<p>Hello World</p>';

  function handleReady(editor) {
    console.log('Editor ready:', editor.isReady);
  }

  function handleInput({ data }) {
    console.log('Content changed:', data);
  }
</script>

<WysiwygEditor
  editorConstructor={Jodit}
  bind:value={editorValue}
  config={{ height: 400 }}
  onReady={handleReady}
  onInput={handleInput}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `editorConstructor` | `typeof Jodit` | **required** | The Jodit class constructor |
| `value` | `string` | `""` | Editor content (supports two-way binding) |
| `mode` | `1 \| 2 \| 3` | `1` | Editor mode: 1=WYSIWYG, 2=Source, 3=Split (supports two-way binding) |
| `config` | `object` | `{}` | Jodit configuration options |
| `disabled` | `boolean` | `false` | Disable the editor (dynamic) |
| `readonly` | `boolean` | `false` | Read-only mode (dynamic) |
| `height` | `number \| string` | - | Editor height |
| `width` | `number \| string` | - | Editor width |
| `placeholder` | `string` | - | Placeholder text |
| `theme` | `'default' \| 'dark'` | `'default'` | Editor theme |
| `toolbar` | `boolean` | `true` | Show toolbar |
| `statusbar` | `boolean` | `true` | Show status bar |
| `language` | `string` | `'en'` | Editor language |
| `direction` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction |
| `enter` | `'p' \| 'div' \| 'br'` | `'p'` | Tag created on Enter |
| `iframe` | `boolean` | `false` | Render in iframe |
| `spellcheck` | `boolean` | `true` | Enable spellcheck |

### Callback Props

| Prop | Signature | Description |
|------|-----------|-------------|
| `onReady` | `(instance: Jodit) => void` | Called when editor is initialized |
| `onInput` | `({ data: string, instance: Jodit }) => void` | Called on content change |
| `onModeChange` | `({ mode: number, instance: Jodit }) => void` | Called when mode changes |
| `onFocus` | `({ evt: FocusEvent, instance: Jodit }) => void` | Called on editor focus |
| `onBlur` | `({ evt: FocusEvent, instance: Jodit }) => void` | Called on editor blur |
| `onDestroy` | `(instance: Jodit) => void` | Called when component is destroyed |

### Custom Toolbar Buttons

```js
import { createModeToggle } from '@keenmate/svelte-wysiwyg';

// Create a toggle button for WYSIWYG/Source mode
const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);

const config = {
  buttons: ['bold', 'italic', '|', modeToggle, '|', 'undo', 'redo']
};
```

### ESM Plugin Imports

When using Jodit's ESM build (`jodit/esm/index.js`), some plugins are not included by default and must be imported explicitly.

**Important:** The source plugin is required for source mode (mode 2) and split mode (mode 3) to work:

```js
import { Jodit } from 'jodit/esm/index.js';
import 'jodit/es2021/jodit.min.css';

// REQUIRED: Source plugin for source/split mode editing
import 'jodit/esm/plugins/source/source.js';
```

Without this import, switching to source mode will show an empty editor even though the content is preserved internally.

#### Other optional plugins

```js
// Fullscreen mode (fullsize button)
import 'jodit/esm/plugins/fullsize/fullsize.js';

// Preview HTML output (preview button)
import 'jodit/esm/plugins/preview/preview.js';

// Print functionality (print button)
import 'jodit/esm/plugins/print/print.js';

// Eraser button + HTML cleaning (eraser button)
import 'jodit/esm/plugins/clean-html/clean-html.js';
```

### Development

This is a monorepo using npm workspaces. The structure is:

```
svelte-wysiwyg/
├── packages/
│   ├── svelte-wysiwyg-v4/   # Svelte 4 version (@keenmate/svelte-wysiwyg v1.x)
│   └── svelte-wysiwyg-v5/   # Svelte 5 version (@keenmate/svelte-wysiwyg v2.x)
└── docs/                    # Examples and documentation (uses v5)
```

#### Setup

```bash
npm install    # Install all workspace dependencies
```

#### Development Server

```bash
make dev           # Start Svelte 5 dev server (docs)
make dev VER=4     # Start Svelte 4 dev server
make dev4          # Shortcut for Svelte 4
make dev5          # Shortcut for Svelte 5
```

#### Build & Publish

```bash
make build         # Build Svelte 5 package
make build VER=4   # Build Svelte 4 package
make build VER=all # Build all packages + docs
make package       # Package v5 for publishing
make package VER=4 # Package v4 for publishing
make publish       # Publish v5 to npm
make publish VER=4 # Publish v4 to npm
```

### License

MIT
