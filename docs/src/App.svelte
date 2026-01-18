<script>
	import WysiwygEditor, { createModeToggle } from '@keenmate/svelte-wysiwyg-v5';
	import 'jodit/es2021/jodit.min.css';
	import { Jodit } from 'jodit/esm/index.js';
	// Source plugin is not included in ESM by default - import it explicitly
	import 'jodit/esm/plugins/source/source.js';

	import ControlPanel from './ControlPanel.svelte';

	let editorValue = $state(`<p>Welcome to the <strong>Svelte WYSIWYG</strong> editor demo!</p>
<p>This editor supports <em>rich text</em> formatting, lists, and more.</p>
<ul>
    <li>Bold and italic text</li>
    <li>Ordered and unordered lists</li>
    <li>Images and links</li>
</ul>
<p>Switch to <strong>Source mode</strong> to see the HTML and test Ace editor settings.</p>`);
	let editorMode = $state(Jodit.MODE_WYSIWYG);
	let editorInstance = null;

	// Dynamic editor props (can change at runtime)
	let isReadonly = $state(false);

	// Output panel tab
	let outputTab = $state('source'); // 'source' or 'preview'

	// Ace editor settings (can be changed dynamically)
	let showPrintMargin = $state(false);
	let showGutter = $state(true);
	let highlightActiveLine = $state(true);
	let tabSize = $state(4);
	let aceTheme = $state('ace/theme/chrome');

	// Create a toggle button that updates our bound state
	const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);

	// Config for advanced options (buttons, source editor, etc.)
	// Simple options like height, placeholder, theme can be passed as props instead
	const editorConfig = {
		// Source editor configuration
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
		// Toolbar with custom mode toggle button
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
		// Re-apply Ace settings after mode change
		setTimeout(() => {
			applyAceSettings();
		}, 100);
	}

	function applyAceSettings() {
		if (!editorInstance) return;
		// Access Ace through Jodit's internal plugin system
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
				onclick={() => outputTab = 'source'}
			>
				HTML Source
			</button>
			<button
				class:active={outputTab === 'preview'}
				onclick={() => outputTab = 'preview'}
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
