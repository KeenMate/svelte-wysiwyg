<script>
	import { Jodit } from 'jodit/esm/index.js';

	let {
		// Editor settings (dynamic props)
		isReadonly = $bindable(false),
		// Ace editor settings (can be changed dynamically)
		showPrintMargin = $bindable(false),
		showGutter = $bindable(true),
		highlightActiveLine = $bindable(true),
		tabSize = $bindable(4),
		aceTheme = $bindable('ace/theme/chrome'),
		// Editor instance and mode (read-only)
		editorInstance = null,
		currentMode = 1
	} = $props();

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

	// Access Ace editor through Jodit's internal plugin system
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

	// Handlers for Ace settings
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

	// Get mode display name
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
				<select bind:value={aceTheme} onchange={handleAceTheme}>
					{#each aceThemes as t}
						<option value={t.value}>{t.label}</option>
					{/each}
				</select>
			</label>

			<label class="control-item">
				<span>Tab Size</span>
				<input type="number" bind:value={tabSize} min="2" max="8" onchange={handleTabSize} />
			</label>

			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={showGutter} onchange={handleShowGutter} />
				<span>Line Numbers</span>
			</label>

			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={highlightActiveLine} onchange={handleHighlightActiveLine} />
				<span>Highlight Active Line</span>
			</label>

			<label class="control-item checkbox">
				<input type="checkbox" bind:checked={showPrintMargin} onchange={handleShowPrintMargin} />
				<span>Print Margin (80 col)</span>
			</label>
		</div>
		<p class="settings-note">Ace settings apply in Source mode only.</p>
	</div>
</div>
