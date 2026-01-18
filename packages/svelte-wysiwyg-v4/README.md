# @keenmate/svelte-wysiwyg

Svelte 4 wrapper component for the [Jodit WYSIWYG editor](https://xdsoft.net/jodit/).

> **Note:** This is the Svelte 4 version (v1.x). For Svelte 5, use v2.x: `npm i @keenmate/svelte-wysiwyg@2`

## Installation

```bash
npm i @keenmate/svelte-wysiwyg@1 jodit
```

## Usage

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

## Props

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
| `maxHeight` | `number \| string` | - | Maximum editor height |
| `maxWidth` | `number \| string` | - | Maximum editor width |
| `placeholder` | `string` | - | Placeholder text |
| `theme` | `'default' \| 'dark'` | `'default'` | Editor theme |
| `toolbar` | `boolean` | `true` | Show toolbar |
| `statusbar` | `boolean` | `true` | Show status bar |
| `language` | `string` | `'en'` | Editor language |
| `direction` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction |
| `enter` | `'p' \| 'div' \| 'br'` | `'p'` | Tag created on Enter |
| `iframe` | `boolean` | `false` | Render in iframe |
| `spellcheck` | `boolean` | `true` | Enable spellcheck |

## Callback Props

| Prop | Signature | Description |
|------|-----------|-------------|
| `onReady` | `(instance: Jodit) => void` | Called when editor is initialized |
| `onInput` | `({ data: string, instance: Jodit }) => void` | Called on content change |
| `onModeChange` | `({ mode: number, instance: Jodit }) => void` | Called when mode changes |
| `onFocus` | `({ evt: FocusEvent, instance: Jodit }) => void` | Called on editor focus |
| `onBlur` | `({ evt: FocusEvent, instance: Jodit }) => void` | Called on editor blur |
| `onDestroy` | `(instance: Jodit) => void` | Called when component is destroyed |

## Custom Toolbar Buttons

```js
import { createModeToggle } from '@keenmate/svelte-wysiwyg';

// Create a toggle button for WYSIWYG/Source mode
const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);

const config = {
  buttons: ['bold', 'italic', '|', modeToggle, '|', 'undo', 'redo']
};
```

## ESM Plugin Imports

When using Jodit's ESM build, some toolbar buttons require their plugins to be imported explicitly. Add these imports to enable the corresponding features:

```js
// Source code editing (source button)
import 'jodit/esm/plugins/source/source.js';

// Fullscreen mode (fullsize button)
import 'jodit/esm/plugins/fullsize/fullsize.js';

// Preview HTML output (preview button)
import 'jodit/esm/plugins/preview/preview.js';

// Print functionality (print button)
import 'jodit/esm/plugins/print/print.js';

// Eraser button + HTML cleaning (eraser button)
import 'jodit/esm/plugins/clean-html/clean-html.js';
```

Without these imports, the corresponding toolbar buttons will appear but won't function.

## Requirements

- Svelte 4.x
- Jodit 4.x

## License

MIT
