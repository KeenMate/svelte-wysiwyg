/**
 * @keenmate/svelte-wysiwyg-v4 - TypeScript Definitions
 *
 * Svelte 4 wrapper for Jodit WYSIWYG Editor with full TypeScript support.
 */

import type { SvelteComponent } from 'svelte';
import type { Jodit } from 'jodit';

// ============================================================================
// Core Types
// ============================================================================

/**
 * Editor mode constants (matching Jodit.MODE_*)
 * - 1 = MODE_WYSIWYG - Visual editing mode
 * - 2 = MODE_SOURCE - HTML source code editing mode
 * - 3 = MODE_SPLIT - Split view with both WYSIWYG and source
 */
export type JoditMode = 1 | 2 | 3;

/** Text direction */
export type TextDirection = 'ltr' | 'rtl' | '';

/** Enter key behavior - what tag to create */
export type EnterMode = 'p' | 'div' | 'br';

/** Toolbar button size */
export type ToolbarButtonSize = 'tiny' | 'xsmall' | 'small' | 'middle' | 'large';

/** Paste behavior */
export type InsertMode =
	| 'insert_as_html'
	| 'insert_as_text'
	| 'insert_clear_html'
	| 'insert_only_text';

/** Source editor type */
export type SourceEditorType = 'area' | 'ace' | 'mirror';

// ============================================================================
// Ace Editor Options (for source mode)
// ============================================================================

/** Ace editor theme names */
export type AceTheme =
	| 'ace/theme/chrome'
	| 'ace/theme/monokai'
	| 'ace/theme/github'
	| 'ace/theme/tomorrow'
	| 'ace/theme/twilight'
	| 'ace/theme/dracula'
	| 'ace/theme/solarized_dark'
	| 'ace/theme/solarized_light'
	| 'ace/theme/textmate'
	| 'ace/theme/xcode'
	| string;

/** Ace editor native options */
export interface AceEditorOptions {
	/** Show line numbers gutter */
	showGutter?: boolean;
	/** Ace theme */
	theme?: AceTheme;
	/** Language mode (e.g., 'ace/mode/html') */
	mode?: string;
	/** Enable line wrapping */
	wrap?: boolean;
	/** Highlight the active line */
	highlightActiveLine?: boolean;
	/** Show the print margin (vertical line at column) */
	showPrintMargin?: boolean;
	/** Column position for print margin (default: 80) */
	printMarginColumn?: number;
	/** Show invisible characters (spaces, tabs, newlines) */
	showInvisibles?: boolean;
	/** Font size (e.g., '14px') */
	fontSize?: string | number;
	/** Tab size in spaces */
	tabSize?: number;
	/** Use spaces instead of tabs */
	useSoftTabs?: boolean;
	/** Read-only mode */
	readOnly?: boolean;
	/** Show code folding controls */
	showFoldWidgets?: boolean;
	/** Enable basic autocompletion */
	enableBasicAutocompletion?: boolean;
	/** Enable live autocompletion */
	enableLiveAutocompletion?: boolean;
}

// ============================================================================
// Toolbar Configuration
// ============================================================================

/** Built-in toolbar button names */
export type ToolbarButton =
	// Font style
	| 'bold' | 'italic' | 'underline' | 'strikethrough'
	// Lists
	| 'ul' | 'ol'
	// Font
	| 'font' | 'fontsize' | 'paragraph'
	// Script
	| 'superscript' | 'subscript'
	// Media
	| 'image' | 'video' | 'file'
	// Clipboard
	| 'cut' | 'copy' | 'paste' | 'selectall'
	// Insert
	| 'hr' | 'table' | 'link' | 'symbols'
	// Indent
	| 'indent' | 'outdent'
	// Color
	| 'brush'
	// Format
	| 'copyformat' | 'eraser'
	// History
	| 'undo' | 'redo'
	// Search
	| 'find' | 'search'
	// Source
	| 'source'
	// Other
	| 'fullsize' | 'preview' | 'print'
	// Info
	| 'about'
	// Separators
	| '|' | '\n'
	// Allow custom button names
	| string;

/** Custom button definition */
export interface CustomButton {
	name: string;
	tooltip?: string;
	icon?: string;
	iconURL?: string;
	exec?: (editor: Jodit, current: Node | null, options: unknown) => void;
	isActive?: (editor: Jodit) => boolean;
	isDisabled?: (editor: Jodit) => boolean;
	mode?: JoditMode;
	hotkeys?: string | string[];
	list?: Record<string, string>;
}

// ============================================================================
// Main Configuration Interface
// ============================================================================

/**
 * Jodit Editor Configuration Options
 *
 * This interface covers the most commonly used configuration options
 * with full TypeScript autocomplete support.
 */
export interface JoditConfig {
	// -------------------------------------------------------------------------
	// Editor Dimensions & Layout
	// -------------------------------------------------------------------------

	/** Editor width. Can be number (px), string ('100%'), or 'auto' */
	width?: number | string;
	/** Editor height. Can be number (px), string ('100%'), or 'auto' */
	height?: number | string;
	/** Minimum height */
	minHeight?: number | string;
	/** Maximum height */
	maxHeight?: number | string;
	/** Minimum width */
	minWidth?: number | string;
	/** Maximum width */
	maxWidth?: number | string;
	/** Z-index for editor */
	zIndex?: number;
	/** Start in fullscreen mode */
	fullsize?: boolean;
	/** Inline editing mode (no border/chrome) */
	inline?: boolean;

	// -------------------------------------------------------------------------
	// Editor State & Behavior
	// -------------------------------------------------------------------------

	/** Read-only mode - content cannot be edited */
	readonly?: boolean;
	/** Disabled state - editor is completely disabled */
	disabled?: boolean;
	/** Default editing mode: 1=WYSIWYG, 2=SOURCE, 3=SPLIT */
	defaultMode?: JoditMode;
	/** Enable split view mode */
	useSplitMode?: boolean;
	/** Tab index for keyboard navigation */
	tabIndex?: number;
	/** Placeholder text when editor is empty */
	placeholder?: string;
	/** Save mode to localStorage */
	saveModeInStorage?: boolean;

	// -------------------------------------------------------------------------
	// Toolbar & UI
	// -------------------------------------------------------------------------

	/** Show toolbar. Can be boolean, selector string, or HTMLElement */
	toolbar?: boolean | string | HTMLElement;
	/** Show status bar */
	statusbar?: boolean;
	/** Toolbar buttons configuration */
	buttons?: (ToolbarButton | CustomButton)[];
	/** Buttons to remove from default toolbar */
	removeButtons?: string[];
	/** Extra buttons to add */
	extraButtons?: (string | CustomButton)[];
	/** Toolbar button size */
	toolbarButtonSize?: ToolbarButtonSize;
	/** Show buttons as text instead of icons */
	textIcons?: boolean;
	/** Show tooltips on hover */
	showTooltip?: boolean;
	/** Tooltip delay in milliseconds */
	showTooltipDelay?: number;
	/** Use browser native tooltips */
	useNativeTooltip?: boolean;
	/** Sticky toolbar (follows scroll) */
	toolbarSticky?: boolean;
	/** Offset for sticky toolbar */
	toolbarStickyOffset?: number;

	// -------------------------------------------------------------------------
	// Theme & Styling
	// -------------------------------------------------------------------------

	/** Theme: 'default' or 'dark' */
	theme?: 'default' | 'dark' | string;
	/** CSS class for the editable area */
	editorClassName?: string | false;
	/** CSS class for the main container */
	className?: string | false;
	/** Inline styles for editable area content */
	style?: Record<string, string> | false;
	/** Inline styles for editor container */
	containerStyle?: Record<string, string> | false;

	// -------------------------------------------------------------------------
	// Language & Internationalization
	// -------------------------------------------------------------------------

	/** Language code: 'en', 'de', 'ru', etc., or 'auto' */
	language?: string;
	/** Text direction: 'ltr' (left-to-right) or 'rtl' (right-to-left) */
	direction?: TextDirection;

	// -------------------------------------------------------------------------
	// Content & Editing
	// -------------------------------------------------------------------------

	/** Tag to create on Enter key: 'p', 'div', or 'br' */
	enter?: EnterMode;
	/** Default action when pasting content */
	defaultActionOnPaste?: InsertMode;

	// -------------------------------------------------------------------------
	// Source Editor (Ace/CodeMirror)
	// -------------------------------------------------------------------------

	/** Source editor type: 'area' (textarea), 'ace', or 'mirror' (CodeMirror) */
	sourceEditor?: SourceEditorType;
	/** Native options passed to Ace editor */
	sourceEditorNativeOptions?: AceEditorOptions;
	/** Beautify HTML in source mode */
	beautifyHTML?: boolean;

	// -------------------------------------------------------------------------
	// iframe Mode
	// -------------------------------------------------------------------------

	/** Render content in iframe for isolation */
	iframe?: boolean;
	/** Edit full HTML document (requires iframe: true) */
	editHTMLDocumentMode?: boolean;
	/** CSS files to load in iframe */
	iframeCSSLinks?: string[];
	/** Inline styles for iframe */
	iframeStyle?: string;

	// -------------------------------------------------------------------------
	// Images & Media
	// -------------------------------------------------------------------------

	/** Default image width */
	imageDefaultWidth?: number;
	/** Allow drag and drop images */
	enableDragAndDropFileToEditor?: boolean;

	// -------------------------------------------------------------------------
	// Plugins
	// -------------------------------------------------------------------------

	/** Plugins to disable (string or array) */
	disablePlugins?: string[] | string;
	/** Extra plugins to load */
	extraPlugins?: string[];

	// -------------------------------------------------------------------------
	// Responsive Breakpoints
	// -------------------------------------------------------------------------

	/** Large screen breakpoint (px) */
	sizeLG?: number;
	/** Medium screen breakpoint (px) */
	sizeMD?: number;
	/** Small screen breakpoint (px) */
	sizeSM?: number;

	// -------------------------------------------------------------------------
	// Events (callbacks)
	// -------------------------------------------------------------------------

	/** Event handlers */
	events?: {
		afterInit?: (editor: Jodit) => void;
		beforeDestruct?: (editor: Jodit) => void;
		change?: (html: string) => void;
		focus?: (event: FocusEvent) => void;
		blur?: (event: FocusEvent) => void;
		[key: string]: ((...args: unknown[]) => void) | undefined;
	};

	/** Allow any additional Jodit options */
	[key: string]: unknown;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * WysiwygEditor component props
 */
export interface WysiwygEditorProps {
	/** The Jodit constructor class */
	editorConstructor: typeof Jodit;
	/** Editor content (bindable) */
	value?: string;
	/**
	 * Editor mode (bindable). 1=WYSIWYG, 2=SOURCE, 3=SPLIT
	 * Use Jodit.MODE_WYSIWYG, Jodit.MODE_SOURCE, Jodit.MODE_SPLIT constants.
	 */
	mode?: JoditMode;
	/** Editor configuration (for advanced options not covered by props) */
	config?: JoditConfig;

	// -------------------------------------------------------------------------
	// Dynamic Props (can change at runtime)
	// -------------------------------------------------------------------------

	/** Disabled state - editor is completely disabled */
	disabled?: boolean;
	/** Read-only mode - content cannot be edited but can be selected/copied */
	readonly?: boolean;

	// -------------------------------------------------------------------------
	// Static Props (merged into config at init, props override config)
	// -------------------------------------------------------------------------

	/** Editor height. Can be number (px) or string ('100%') */
	height?: number | string;
	/** Editor width. Can be number (px) or string ('100%') */
	width?: number | string;
	/** Maximum editor height */
	maxHeight?: number | string;
	/** Maximum editor width */
	maxWidth?: number | string;
	/** Placeholder text when editor is empty */
	placeholder?: string;
	/** Theme: 'default' or 'dark' */
	theme?: 'default' | 'dark' | string;
	/** Show toolbar */
	toolbar?: boolean;
	/** Show status bar */
	statusbar?: boolean;
	/** Language code: 'en', 'de', 'ru', etc., or 'auto' */
	language?: string;
	/** Text direction: 'ltr' or 'rtl' */
	direction?: TextDirection;
	/** Tag to create on Enter key: 'p', 'div', or 'br' */
	enter?: EnterMode;
	/** Render content in iframe for isolation */
	iframe?: boolean;
	/** Enable browser spellcheck */
	spellcheck?: boolean;

	// -------------------------------------------------------------------------
	// Callbacks
	// -------------------------------------------------------------------------

	/** Called when editor is ready */
	onReady?: (instance: Jodit) => void;
	/** Called when content changes */
	onInput?: (event: { data: string; instance: Jodit }) => void;
	/** Called when mode changes */
	onModeChange?: (event: { mode: JoditMode; instance: Jodit }) => void;
	/** Called when editor gains focus */
	onFocus?: (event: { evt: FocusEvent; instance: Jodit }) => void;
	/** Called when editor loses focus */
	onBlur?: (event: { evt: FocusEvent; instance: Jodit }) => void;
	/** Called before editor is destroyed */
	onDestroy?: (instance: Jodit) => void;
}

// ============================================================================
// Component Export
// ============================================================================

declare const WysiwygEditor: SvelteComponent<WysiwygEditorProps>;
export default WysiwygEditor;

// ============================================================================
// Mode Button Utilities
// ============================================================================

/**
 * Mode button configuration for toolbar
 */
export interface ModeButtonConfig {
	name: string;
	tooltip: string;
	icon: string;
	mode: JoditMode;
	exec: (editor: Jodit) => void;
	isActive: (editor: Jodit) => boolean;
}

/**
 * Collection of mode button configurations
 */
export interface ModeButtonConfigs {
	wysiwyg: ModeButtonConfig;
	source: ModeButtonConfig;
	split: ModeButtonConfig;
}

/**
 * Creates a toggle button for switching between WYSIWYG and Source modes.
 *
 * @param setMode - Callback to set the editor mode
 * @param JoditConstructor - The Jodit constructor (for mode constants)
 * @returns Button configuration for the mode toggle
 *
 * @example
 * ```ts
 * const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);
 * const config = { buttons: ['bold', 'italic', '|', modeToggle] };
 * ```
 */
export function createModeToggle(
	setMode: (mode: JoditMode) => void,
	JoditConstructor: typeof Jodit
): ModeButtonConfig;

/**
 * @deprecated Use createModeToggle instead
 */
export function createModeButtons(
	setMode: (mode: JoditMode) => void,
	JoditConstructor: typeof Jodit
): ModeButtonConfigs;
