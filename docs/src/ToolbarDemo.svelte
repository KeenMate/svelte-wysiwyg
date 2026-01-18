<script>
	import WysiwygEditor, { createModeToggle } from '@keenmate/svelte-wysiwyg-v5';
	import 'jodit/es2021/jodit.min.css';
	import { Jodit } from 'jodit/esm/index.js';

	let editorValue = $state(`<p>Edit this content to test the toolbar.</p>`);
	let editorMode = $state(1);

	// Available button groups
	const buttonGroups = {
		'Font Style': ['bold', 'italic', 'underline', 'strikethrough'],
		'Lists': ['ul', 'ol'],
		'Font': ['font', 'fontsize', 'paragraph'],
		'Script': ['superscript', 'subscript'],
		'Media': ['image', 'video', 'file'],
		'Clipboard': ['cut', 'copy', 'paste', 'selectall'],
		'Insert': ['hr', 'table', 'link', 'symbols'],
		'Indent': ['indent', 'outdent'],
		'Color': ['brush'],
		'Format': ['copyformat', 'eraser'],
		'History': ['undo', 'redo'],
		'Search': ['find'],
		'View': ['fullsize', 'preview', 'print'],
		'Source': ['source'],
		'Info': ['about']
	};

	// Presets
	const presets = {
		minimal: ['bold', 'italic', '|', 'ul', 'ol', '|', 'link', '|', 'undo', 'redo'],
		standard: [
			'bold', 'italic', 'underline', '|',
			'ul', 'ol', '|',
			'font', 'fontsize', '|',
			'image', 'link', '|',
			'align', '|',
			'undo', 'redo', '|',
			'source'
		],
		full: [
			'bold', 'italic', 'underline', 'strikethrough', '|',
			'ul', 'ol', '|',
			'font', 'fontsize', 'paragraph', '|',
			'superscript', 'subscript', '|',
			'image', 'video', 'file', '|',
			'table', 'link', 'hr', 'symbols', '|',
			'indent', 'outdent', '|',
			'brush', '|',
			'copyformat', 'eraser', '|',
			'undo', 'redo', '|',
			'find', '|',
			'fullsize', 'preview', 'print', '|',
			'source', '|',
			'about'
		]
	};

	// Selected buttons (without separators for easier management)
	let selectedButtons = $state(new Set(['bold', 'italic', 'underline', 'ul', 'ol', 'link', 'undo', 'redo', 'source']));

	// Include separators between groups
	let useSeparators = $state(true);

	// Include custom mode toggle button
	let includeCustomModeToggle = $state(false);

	// Editor key for recreation
	let editorKey = $state(0);

	function recreateEditor() {
		editorKey++;
	}

	// Build the buttons array from selection
	function buildButtonsArray() {
		const buttons = [];
		let lastWasButton = false;

		for (const [groupName, groupButtons] of Object.entries(buttonGroups)) {
			const activeInGroup = groupButtons.filter(b => selectedButtons.has(b));

			if (activeInGroup.length > 0) {
				if (useSeparators && lastWasButton) {
					buttons.push('|');
				}
				buttons.push(...activeInGroup);
				lastWasButton = true;
			}
		}

		// Add custom mode toggle if enabled
		if (includeCustomModeToggle) {
			if (useSeparators && lastWasButton) {
				buttons.push('|');
			}
			const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);
			buttons.push(modeToggle);
		}

		return buttons;
	}

	// Get current buttons config
	let currentButtons = $derived(buildButtonsArray());

	// Build config
	let editorConfig = $derived({
		buttons: currentButtons
	});

	function applyPreset(presetName) {
		const preset = presets[presetName];
		selectedButtons = new Set(preset.filter(b => b !== '|'));
		recreateEditor();
	}

	function toggleButton(button) {
		const newSet = new Set(selectedButtons);
		if (newSet.has(button)) {
			newSet.delete(button);
		} else {
			newSet.add(button);
		}
		selectedButtons = newSet;
		recreateEditor();
	}

	function selectAll() {
		const allButtons = Object.values(buttonGroups).flat();
		selectedButtons = new Set(allButtons);
		recreateEditor();
	}

	function selectNone() {
		selectedButtons = new Set();
		recreateEditor();
	}

	function toggleSeparators() {
		useSeparators = !useSeparators;
		recreateEditor();
	}

	function toggleModeToggle() {
		includeCustomModeToggle = !includeCustomModeToggle;
		recreateEditor();
	}

	function handleReady(instance) {
		console.log('Editor ready with toolbar:', currentButtons);
	}

	// Generate code example
	let codeExample = $derived(() => {
		const buttonStrings = [];
		let lastWasButton = false;

		for (const [groupName, groupButtons] of Object.entries(buttonGroups)) {
			const activeInGroup = groupButtons.filter(b => selectedButtons.has(b));

			if (activeInGroup.length > 0) {
				if (useSeparators && lastWasButton) {
					buttonStrings.push("'|'");
				}
				buttonStrings.push(...activeInGroup.map(b => `'${b}'`));
				lastWasButton = true;
			}
		}

		if (includeCustomModeToggle) {
			if (useSeparators && lastWasButton) {
				buttonStrings.push("'|'");
			}
			buttonStrings.push('modeToggle');
		}

		return `const config = {
  buttons: [
    ${buttonStrings.join(', ')}
  ]
};`;
	});
</script>

<div class="card">
	<h2>Presets</h2>
	<p>Quick-start with a predefined toolbar configuration.</p>

	<div class="preset-buttons">
		<button onclick={() => applyPreset('minimal')}>Minimal</button>
		<button onclick={() => applyPreset('standard')}>Standard</button>
		<button onclick={() => applyPreset('full')}>Full</button>
	</div>
</div>

<div class="card">
	<h2>Button Selection</h2>
	<p>Toggle individual buttons to include in the toolbar.</p>

	<div class="selection-controls">
		<button class="secondary" onclick={selectAll}>Select All</button>
		<button class="secondary" onclick={selectNone}>Select None</button>
		<label class="inline-checkbox">
			<input type="checkbox" checked={useSeparators} onchange={toggleSeparators} />
			<span>Add separators between groups</span>
		</label>
		<label class="inline-checkbox">
			<input type="checkbox" checked={includeCustomModeToggle} onchange={toggleModeToggle} />
			<span>Include custom mode toggle</span>
		</label>
	</div>

	<div class="button-groups">
		{#each Object.entries(buttonGroups) as [groupName, buttons]}
			<div class="button-group">
				<h4>{groupName}</h4>
				<div class="button-options">
					{#each buttons as button}
						<label class="button-option" class:selected={selectedButtons.has(button)}>
							<input
								type="checkbox"
								checked={selectedButtons.has(button)}
								onchange={() => toggleButton(button)}
							/>
							<code>{button}</code>
						</label>
					{/each}
				</div>
			</div>
		{/each}
	</div>

</div>

<div class="card">
	<h2>Editor Preview</h2>

	{#key editorKey}
		<div class="editor-container">
			<WysiwygEditor
				editorConstructor={Jodit}
				bind:value={editorValue}
				bind:mode={editorMode}
				config={editorConfig}
				height={300}
				onReady={handleReady}
			/>
		</div>
	{/key}
</div>

<div class="card">
	<h2>Generated Code</h2>
	<p>Copy this configuration to use in your project.</p>

	<pre class="code-display">{codeExample()}</pre>
</div>

<div class="card">
	<h2>Custom Button Example</h2>
	<p>Create your own buttons with custom behavior.</p>

	<pre class="code-display">{`// Define a custom button
const insertDateButton = {
  name: 'insertDate',
  tooltip: 'Insert current date',
  icon: '<svg>...</svg>',  // SVG string or use iconURL
  exec: (editor) => {
    const date = new Date().toLocaleDateString();
    editor.selection.insertHTML('<strong>' + date + '</strong>');
  },
  isActive: (editor) => false,
  isDisabled: (editor) => editor.getReadOnly()
};

// Use in config
const config = {
  buttons: ['bold', 'italic', '|', insertDateButton, '|', 'undo', 'redo']
};`}</pre>
</div>

<style>
	.preset-buttons {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.selection-controls {
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	.inline-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.9rem;
		color: #4a5568;
	}

	.inline-checkbox input {
		width: 16px;
		height: 16px;
	}

	.button-groups {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.button-group h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.85rem;
		color: #667eea;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.button-options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.button-option {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.35rem 0.6rem;
		background: #f7fafc;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s;
	}

	.button-option:hover {
		border-color: #667eea;
	}

	.button-option.selected {
		background: #ebf4ff;
		border-color: #667eea;
	}

	.button-option input {
		width: 14px;
		height: 14px;
	}

	.button-option code {
		font-size: 0.8rem;
		background: transparent;
		padding: 0;
		color: #2d3748;
	}

	.editor-container {
		border-radius: 8px;
		overflow: hidden;
	}

	.code-display {
		background: #2d3748;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 8px;
		font-size: 0.85rem;
		overflow-x: auto;
		margin: 0;
		line-height: 1.6;
	}

	button {
		background: #667eea;
		color: white;
		border: none;
		padding: 0.6rem 1.2rem;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #5a67d8;
	}

	button.secondary {
		background: #6b7280;
	}

	button.secondary:hover {
		background: #4b5563;
	}
</style>
