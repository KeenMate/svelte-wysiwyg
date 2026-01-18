<script>
	import WysiwygEditor from '@keenmate/svelte-wysiwyg-v5';
	import 'jodit/es2021/jodit.min.css';
	import { Jodit } from 'jodit/esm/index.js';

	let editorValue = $state(`<p>Edit this content to test the editor.</p>`);

	// Dynamic props (can change at runtime)
	let disabled = $state(false);
	let readonly = $state(false);

	// Static props (merged into config at init - require recreate to change)
	let height = $state(300);
	let width = $state('100%');
	let maxHeight = $state(''); // empty = no limit, accepts: 600, 600px, 50%, 30rem, etc.
	let maxWidth = $state(''); // empty = no limit
	let placeholder = $state('Start typing here...');
	let theme = $state('default');
	let toolbar = $state(true);
	let statusbar = $state(true);
	let language = $state('en');
	let direction = $state('ltr');
	let enter = $state('p');
	let iframe = $state(false);
	let spellcheck = $state(true);

	// Key to force recreation of editor when static props change
	let editorKey = $state(0);

	function recreateEditor() {
		editorKey++;
	}

	function handleReady(instance) {
		console.log('Editor ready:', instance);
	}

	// Helper to get numeric value from string (for range slider)
	function getNumericValue(val) {
		if (!val) return 0;
		const num = parseInt(val, 10);
		return isNaN(num) ? 0 : num;
	}

	// Helper to set value from range slider (preserves unit if present)
	function setFromRange(current, newNum) {
		if (!current || /^\d+$/.test(current)) {
			// No unit or just a number - return plain number or empty
			return newNum === 0 ? '' : String(newNum);
		}
		// Extract unit and apply new number
		const unit = current.replace(/[\d.]+/, '');
		return newNum === 0 ? '' : `${newNum}${unit}`;
	}
</script>

<div class="card">
	<h2>Dynamic Props</h2>
	<p>These props can be changed at runtime without recreating the editor.</p>

	<div class="controls-grid">
		<label class="control-item checkbox">
			<input type="checkbox" bind:checked={disabled} />
			<span>disabled</span>
		</label>

		<label class="control-item checkbox">
			<input type="checkbox" bind:checked={readonly} />
			<span>readonly</span>
		</label>
	</div>
</div>

<div class="card">
	<h2>Static Props</h2>
	<p>These props are set at initialization. Click "Recreate Editor" to apply changes.</p>

	<div class="controls-grid">
		<label class="control-item">
			<span>height</span>
			<input type="number" bind:value={height} min="100" max="800" step="50" />
		</label>

		<label class="control-item">
			<span>width</span>
			<input type="text" bind:value={width} placeholder="e.g. 100% or 600" />
		</label>

		<label class="control-item range-control">
			<span>maxHeight <code>{maxHeight || 'none'}</code></span>
			<div class="range-inputs">
				<input
					type="range"
					value={getNumericValue(maxHeight)}
					oninput={(e) => maxHeight = setFromRange(maxHeight, +e.target.value)}
					min="0" max="1000" step="50"
				/>
				<input
					type="text"
					bind:value={maxHeight}
					placeholder="e.g. 600, 50%, 30rem"
				/>
			</div>
		</label>

		<label class="control-item range-control">
			<span>maxWidth <code>{maxWidth || 'none'}</code></span>
			<div class="range-inputs">
				<input
					type="range"
					value={getNumericValue(maxWidth)}
					oninput={(e) => maxWidth = setFromRange(maxWidth, +e.target.value)}
					min="0" max="1200" step="50"
				/>
				<input
					type="text"
					bind:value={maxWidth}
					placeholder="e.g. 800, 100%, 50rem"
				/>
			</div>
		</label>

		<label class="control-item">
			<span>placeholder</span>
			<input type="text" bind:value={placeholder} />
		</label>

		<label class="control-item">
			<span>theme</span>
			<select bind:value={theme}>
				<option value="default">default</option>
				<option value="dark">dark</option>
			</select>
		</label>

		<label class="control-item">
			<span>language</span>
			<select bind:value={language}>
				<option value="en">en (English)</option>
				<option value="de">de (German)</option>
				<option value="fr">fr (French)</option>
				<option value="es">es (Spanish)</option>
				<option value="ru">ru (Russian)</option>
				<option value="cs_cz">cs_cz (Czech)</option>
			</select>
		</label>

		<label class="control-item">
			<span>direction</span>
			<select bind:value={direction}>
				<option value="ltr">ltr (Left to Right)</option>
				<option value="rtl">rtl (Right to Left)</option>
			</select>
		</label>

		<label class="control-item">
			<span>enter</span>
			<select bind:value={enter}>
				<option value="p">p (paragraph)</option>
				<option value="div">div</option>
				<option value="br">br (line break)</option>
			</select>
		</label>

		<label class="control-item checkbox">
			<input type="checkbox" bind:checked={toolbar} />
			<span>toolbar</span>
		</label>

		<label class="control-item checkbox">
			<input type="checkbox" bind:checked={statusbar} />
			<span>statusbar</span>
		</label>

		<label class="control-item checkbox">
			<input type="checkbox" bind:checked={iframe} />
			<span>iframe</span>
		</label>

		<label class="control-item checkbox">
			<input type="checkbox" bind:checked={spellcheck} />
			<span>spellcheck</span>
		</label>
	</div>

	<div style="margin-top: 1rem;">
		<button onclick={recreateEditor}>Recreate Editor</button>
		<span style="margin-left: 1rem; color: #718096; font-size: 0.875rem;">
			Apply static prop changes
		</span>
	</div>
</div>

<div class="card">
	<h2>Editor</h2>

	{#key editorKey}
		<div class="editor-container">
			<WysiwygEditor
				editorConstructor={Jodit}
				bind:value={editorValue}
				{disabled}
				{readonly}
				{height}
				{width}
				maxHeight={maxHeight || undefined}
				maxWidth={maxWidth || undefined}
				{placeholder}
				{theme}
				{toolbar}
				{statusbar}
				{language}
				{direction}
				{enter}
				{iframe}
				{spellcheck}
				onReady={handleReady}
			/>
		</div>
	{/key}
</div>

<div class="card">
	<h2>Current Props</h2>
	<pre class="props-display">{JSON.stringify({
	// Dynamic
	disabled,
	readonly,
	// Static
	height,
	width,
	maxHeight: maxHeight || undefined,
	maxWidth: maxWidth || undefined,
	placeholder,
	theme,
	toolbar,
	statusbar,
	language,
	direction,
	enter,
	iframe,
	spellcheck
}, null, 2)}</pre>
</div>

<style>
	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1rem;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.9rem;
	}

	.control-item span {
		color: #4a5568;
		font-weight: 500;
		font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
	}

	.control-item input[type="text"],
	.control-item input[type="number"],
	.control-item select {
		padding: 0.5rem;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		font-size: 0.875rem;
		background: white;
	}

	.control-item input:focus,
	.control-item select:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	.control-item.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.control-item.checkbox input[type="checkbox"] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.control-item.checkbox span {
		cursor: pointer;
	}

	.control-item.range-control {
		grid-column: span 2;
	}

	.control-item.range-control span {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.control-item.range-control code {
		background: #e2e8f0;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.8rem;
	}

	.range-inputs {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.range-inputs input[type="range"] {
		flex: 1;
		height: 6px;
		cursor: pointer;
	}

	.range-inputs input[type="text"] {
		width: 120px;
		padding: 0.4rem;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.editor-container {
		border-radius: 8px;
		overflow: hidden;
	}

	.props-display {
		background: #2d3748;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 8px;
		font-size: 0.875rem;
		overflow-x: auto;
		margin: 0;
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
</style>
