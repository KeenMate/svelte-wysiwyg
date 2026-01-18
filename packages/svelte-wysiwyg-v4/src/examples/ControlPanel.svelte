<script>
	import { Jodit } from 'jodit/esm/index.js';

	// Props (all bindable for two-way binding)
	export let isReadonly = false;
	export let showPrintMargin = false;
	export let showGutter = true;
	export let highlightActiveLine = true;
	export let tabSize = 4;
	export let aceTheme = 'ace/theme/chrome';
	export let editorInstance = null;
	export let currentMode = 1;

	// Ace themes available
	const aceThemes = [
		{ value: 'ace/theme/chrome', label: 'Chrome (Light)' },
		{ value: 'ace/theme/github', label: 'GitHub (Light)' },
		{ value: 'ace/theme/textmate', label: 'TextMate (Light)' },
		{ value: 'ace/theme/xcode', label: 'Xcode (Light)' },
		{ value: 'ace/theme/monokai', label: 'Monokai (Dark)' },
		{ value: 'ace/theme/dracula', label: 'Dracula (Dark)' },
		{ value: 'ace/theme/twilight', label: 'Twilight (Dark)' },
		{ value: 'ace/theme/tomorrow_night', label: 'Tomorrow Night (Dark)' },
	];

	function getAceEditor() {
		if (!editorInstance) return null;
		const sourcePlugin = editorInstance.__plugins?.source;
		return sourcePlugin?.sourceEditor?.instance || null;
	}

	function updateAceSetting(setter) {
		const ace = getAceEditor();
		if (ace) {
			setter(ace);
		}
	}

	function handleShowPrintMargin() {
		updateAceSetting(ace => ace.setShowPrintMargin(showPrintMargin));
	}

	function handleShowGutter() {
		updateAceSetting(ace => ace.renderer.setShowGutter(showGutter));
	}

	function handleHighlightActiveLine() {
		updateAceSetting(ace => ace.setHighlightActiveLine(highlightActiveLine));
	}

	function handleTabSize() {
		updateAceSetting(ace => ace.session.setTabSize(tabSize));
	}

	function handleAceTheme() {
		updateAceSetting(ace => ace.setTheme(aceTheme));
	}

	function getModeDisplayName(mode) {
		switch (mode) {
			case Jodit.MODE_WYSIWYG: return 'WYSIWYG';
			case Jodit.MODE_SOURCE: return 'SOURCE';
			case Jodit.MODE_SPLIT: return 'SPLIT';
			default: return 'UNKNOWN';
		}
	}
</script>

<div class="control-panel">
	<div class="panel-header">
		<h3>Editor Settings</h3>
		<span class="mode-badge">Mode: {getModeDisplayName(currentMode)}</span>
	</div>

	<div class="panel-content">
		<div class="controls-grid">
			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={isReadonly} />
				<span>Read-only</span>
			</label>

			<label class="control-item">
				<span>Ace Theme</span>
				<select bind:value={aceTheme} on:change={handleAceTheme}>
					{#each aceThemes as t}
						<option value={t.value}>{t.label}</option>
					{/each}
				</select>
			</label>

			<label class="control-item">
				<span>Tab Size</span>
				<input type="number" bind:value={tabSize} min="2" max="8" on:change={handleTabSize} />
			</label>

			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={showGutter} on:change={handleShowGutter} />
				<span>Line Numbers</span>
			</label>

			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={highlightActiveLine} on:change={handleHighlightActiveLine} />
				<span>Highlight Active Line</span>
			</label>

			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={showPrintMargin} on:change={handleShowPrintMargin} />
				<span>Print Margin (80 col)</span>
			</label>
		</div>
		<p class="settings-note">Ace settings apply in Source mode only.</p>
	</div>
</div>

<style>
	.control-panel {
		margin-bottom: 1.5rem;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.panel-header h3 {
		margin: 0;
		font-size: 1.1rem;
	}

	.mode-badge {
		font-size: 0.8rem;
		padding: 0.25rem 0.75rem;
		background: #667eea;
		color: white;
		border-radius: 12px;
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
	}

	.control-item span {
		color: #555;
		font-weight: 500;
	}

	.control-item input[type="text"],
	.control-item input[type="number"],
	.control-item select {
		padding: 0.4rem 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 0.85rem;
	}

	.control-item.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.control-item.checkbox input {
		width: 16px;
		height: 16px;
	}

	.settings-note {
		font-size: 0.75rem;
		color: #888;
		font-style: italic;
		margin-top: 0.5rem;
	}
</style>
