/**
 * Creates a toggle button for switching between WYSIWYG and Source modes.
 * This button calls your callback to update the bound mode prop,
 * giving you full control over mode switching from within the toolbar.
 *
 * @param {function(number): void} setMode - Callback to set the editor mode
 * @param {typeof import('jodit').Jodit} Jodit - The Jodit constructor (for mode constants)
 * @returns {Object} Button configuration for the mode toggle
 *
 * @example
 * ```js
 * import WysiwygEditor, { createModeToggle } from '@keenmate/svelte-wysiwyg-v4';
 * import { Jodit } from 'jodit/esm/index.js';
 *
 * let editorMode = Jodit.MODE_WYSIWYG;
 *
 * const modeToggle = createModeToggle((mode) => { editorMode = mode; }, Jodit);
 *
 * const config = {
 *   buttons: ['bold', 'italic', '|', modeToggle]
 * };
 * ```
 */
export function createModeToggle(setMode, Jodit) {
    // MODE_SPLIT (3) enables button in all modes (WYSIWYG, SOURCE, and SPLIT)
    const enabledInAllModes = Jodit.MODE_SPLIT;

    return {
        name: 'modeToggle',
        tooltip: 'Toggle Source/WYSIWYG',
        icon: 'source',
        mode: enabledInAllModes,
        exec: (editor) => {
            const currentMode = editor.getMode();
            const newMode = currentMode === Jodit.MODE_WYSIWYG
                ? Jodit.MODE_SOURCE
                : Jodit.MODE_WYSIWYG;
            setMode(newMode);
        },
        isActive: (editor) => editor.getMode() === Jodit.MODE_SOURCE,
    };
}

/**
 * @deprecated Use createModeToggle instead for a single toggle button
 */
export function createModeButtons(setMode, Jodit) {
    const enabledInAllModes = Jodit.MODE_SPLIT;

    return {
        wysiwyg: {
            name: 'modeWysiwyg',
            tooltip: 'WYSIWYG Mode',
            icon: 'pencil',
            mode: enabledInAllModes,
            exec: () => setMode(Jodit.MODE_WYSIWYG),
            isActive: (editor) => editor.getMode() === Jodit.MODE_WYSIWYG,
        },
        source: {
            name: 'modeSource',
            tooltip: 'Source Mode',
            icon: 'source',
            mode: enabledInAllModes,
            exec: () => setMode(Jodit.MODE_SOURCE),
            isActive: (editor) => editor.getMode() === Jodit.MODE_SOURCE,
        },
        split: {
            name: 'modeSplit',
            tooltip: 'Split Mode',
            icon: 'valign',
            mode: enabledInAllModes,
            exec: () => setMode(Jodit.MODE_SPLIT),
            isActive: (editor) => editor.getMode() === Jodit.MODE_SPLIT,
        }
    };
}
