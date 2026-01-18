<script>
	import WysiwygEditor, { createModeToggle } from '../index.js';
	import 'jodit/es2021/jodit.min.css';
	import { Jodit } from 'jodit/esm/index.js';
	// These plugins are not included in ESM by default
	import 'jodit/esm/plugins/source/source.js';
	import 'jodit/esm/plugins/fullsize/fullsize.js';
	import 'jodit/esm/plugins/preview/preview.js';

	import ControlPanel from './ControlPanel.svelte';

	let editorValue = `<p>Welcome to the <strong>Svelte WYSIWYG</strong> editor demo!</p>
<p>This editor supports <em>rich text</em> formatting, lists, and more.</p>
<ul>
    <li>Bold and italic text</li>
    <li>Ordered and unordered lists</li>
    <li>Images and links</li>
</ul>
<p>Switch to <strong>Source mode</strong> to see the HTML and test Ace editor settings.</p>`;
	let editorMode = Jodit.MODE_WYSIWYG;
	let editorInstance = null;

	// Dynamic editor props
	let isReadonly = false;

	// Output panel tab
	let outputTab = 'source';

	// Ace editor settings
	let showPrintMargin = false;
	let showGutter = true;
	let highlightActiveLine = true;
	let tabSize = 4;
	let aceTheme = 'ace/theme/chrome';

	// Create mode toggle button
	const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);

	// Config for advanced options
	const editorConfig = {
		sourceEditor: 'ace',
		sourceEditorNativeOptions: {
			showGutter: true,
			theme: 'ace/theme/chrome',
			mode: 'ace/mode/html',
			wrap: true,
			highlightActiveLine: true,
			showPrintMargin: false,
			tabSize: 4
		},
		beautifyHTML: true,
		buttons: [
			'bold', 'italic', 'underline', 'strikethrough', '|',
			'ul', 'ol', '|',
			'font', 'fontsize', 'brush', '|',
			'image', 'link', '|',
			'align', '|',
			'undo', 'redo', '|',
			modeToggle
		]
	};

	function handleReady(instance) {
		editorInstance = instance;
		console.log('Editor ready');
	}

	function handleModeChange({ mode }) {
		setTimeout(() => {
			applyAceSettings();
		}, 100);
	}

	function applyAceSettings() {
		if (!editorInstance) return;
		const sourcePlugin = editorInstance.__plugins?.source;
		const ace = sourcePlugin?.sourceEditor?.instance;
		if (ace) {
			ace.setShowPrintMargin(showPrintMargin);
			ace.renderer.setShowGutter(showGutter);
			ace.setHighlightActiveLine(highlightActiveLine);
			ace.session.setTabSize(tabSize);
			ace.setTheme(aceTheme);
		}
	}
</script>

<div class="card">
	<h2>Editor Demo</h2>
	<p>A comprehensive example showing two-way value binding, mode switching, and Ace editor settings.</p>

	<ControlPanel
		bind:isReadonly
		bind:showPrintMargin
		bind:showGutter
		bind:highlightActiveLine
		bind:tabSize
		bind:aceTheme
		{editorInstance}
		currentMode={editorMode}
	/>

	<div class="editor-container">
		<WysiwygEditor
			editorConstructor={Jodit}
			bind:value={editorValue}
			bind:mode={editorMode}
			config={editorConfig}
			height={400}
			placeholder="Start typing..."
			readonly={isReadonly}
			onReady={handleReady}
			onModeChange={handleModeChange}
		/>
	</div>
</div>

<div class="card output-panel">
	<div class="output-header">
		<h3>Output (Live Binding)</h3>
		<div class="output-tabs">
			<button
				class:active={outputTab === 'source'}
				on:click={() => outputTab = 'source'}
			>
				HTML Source
			</button>
			<button
				class:active={outputTab === 'preview'}
				on:click={() => outputTab = 'preview'}
			>
				Rendered Preview
			</button>
		</div>
	</div>
	<div class="output-content">
		{#if outputTab === 'source'}
			<pre class="html-source">{editorValue}</pre>
		{:else}
			<div class="html-preview">
				{@html editorValue}
			</div>
		{/if}
	</div>
</div>

<style>
	.editor-container {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.output-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.output-header h3 {
		margin: 0;
	}

	.output-tabs {
		display: flex;
		gap: 0.5rem;
	}

	.output-tabs button {
		padding: 0.4rem 0.75rem;
		border: 1px solid #ccc;
		background: white;
		border-radius: 4px;
		font-size: 0.8rem;
		cursor: pointer;
	}

	.output-tabs button:hover {
		border-color: #667eea;
		color: #667eea;
	}

	.output-tabs button.active {
		background: #667eea;
		border-color: #667eea;
		color: white;
	}

	.output-content {
		max-height: 300px;
		overflow: auto;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
	}

	.html-source {
		margin: 0;
		padding: 1rem;
		font-family: monospace;
		font-size: 0.85rem;
		white-space: pre-wrap;
		background: #1e1e1e;
		color: #d4d4d4;
	}

	.html-preview {
		padding: 1rem;
	}

	.html-preview :global(ul),
	.html-preview :global(ol) {
		padding-left: 2em;
		margin: 0.5em 0;
	}
</style>
