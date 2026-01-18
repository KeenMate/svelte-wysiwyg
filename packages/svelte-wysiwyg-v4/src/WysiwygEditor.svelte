<script>
    import { onMount, onDestroy } from 'svelte';

    /** @type {typeof import('jodit').Jodit} */
    export let editorConstructor;
    export let value = "";
    export let mode = 1; // 1=WYSIWYG, 2=SOURCE, 3=SPLIT
    export let config = {};
    // Dynamic props (can change at runtime)
    export let disabled = false;
    export let readonly = false;
    // Static props (merged into config at init)
    export let height = undefined;
    export let width = undefined;
    export let maxHeight = undefined;
    export let maxWidth = undefined;
    export let placeholder = undefined;
    export let theme = undefined;
    export let toolbar = undefined;
    export let statusbar = undefined;
    export let language = undefined;
    export let direction = undefined;
    export let enter = undefined;
    export let iframe = undefined;
    export let spellcheck = undefined;
    // Callbacks
    export let onReady = undefined;
    export let onInput = undefined;
    export let onModeChange = undefined;
    export let onFocus = undefined;
    export let onBlur = undefined;
    export let onDestroy = undefined;

    // Build merged config from props and config object
    function buildConfig() {
        const propsConfig = {};
        if (height !== undefined) propsConfig.height = height;
        if (width !== undefined) propsConfig.width = width;
        if (maxHeight !== undefined) propsConfig.maxHeight = maxHeight;
        if (maxWidth !== undefined) propsConfig.maxWidth = maxWidth;
        if (placeholder !== undefined) propsConfig.placeholder = placeholder;
        if (theme !== undefined) propsConfig.theme = theme;
        if (toolbar !== undefined) propsConfig.toolbar = toolbar;
        if (statusbar !== undefined) propsConfig.statusbar = statusbar;
        if (language !== undefined) propsConfig.language = language;
        if (direction !== undefined) propsConfig.direction = direction;
        if (enter !== undefined) propsConfig.enter = enter;
        if (iframe !== undefined) propsConfig.iframe = iframe;
        if (spellcheck !== undefined) propsConfig.spellcheck = spellcheck;
        // Props override config values
        return { ...config, ...propsConfig };
    }

    // Non-reactive variables for internal state
    let instance = null;
    let lastEditorValue = "";
    let editorElement;
    let internalMode = 1;
    let isUpdatingMode = false;
    let isReady = false;

    // Strip Jodit selection markers from HTML
    function stripSelectionMarkers(html) {
        if (!html) return html;
        return html
            .replace(/<span[^>]*data-jodit-selection_marker[^>]*>[\s\S]*?<\/span>/gi, '')
            .replace(/<span[^>]*data-jodit-temp="true"[^>]*>[\s\S]*?<\/span>/gi, '');
    }

    // Force remove all markers from DOM
    function forceRemoveMarkers() {
        if (!instance) return;
        if (instance.s?.removeMarkers) {
            instance.s.removeMarkers();
        }
        instance.e?.fire('removeMarkers');
        const markers = instance.container?.querySelectorAll('[data-jodit-selection_marker]');
        markers?.forEach(m => m.remove());
    }

    // Reactive: sync value from parent to editor
    $: if (isReady && instance && value !== lastEditorValue) {
        const cleanValue = stripSelectionMarkers(value);
        instance.value = cleanValue;
        lastEditorValue = cleanValue;
    }

    // Reactive: sync mode from parent to editor
    $: if (isReady && instance && mode !== internalMode && !isUpdatingMode) {
        isUpdatingMode = true;
        instance.setMode(mode);
        // isUpdatingMode will be reset in afterSetMode handler
    }

    // Reactive: sync readonly from parent to editor
    $: if (isReady && instance) {
        instance.setReadOnly(readonly);
    }

    function setUpEditorEvents() {
        const emitInputEvent = (source) => {
            if (!instance) return;

            forceRemoveMarkers();

            const rawValue = instance.value;
            const data = stripSelectionMarkers(rawValue);

            if (data === lastEditorValue) {
                return;
            }

            lastEditorValue = data;
            value = data;
            onInput?.({ data, instance });
        };

        instance.e
            .on("beforeSetMode", (modeArg) => {
                const targetMode = typeof modeArg === 'object' ? modeArg.mode : modeArg;

                // Prevent switching to the same mode (prevents marker accumulation)
                if (targetMode === internalMode) {
                    isUpdatingMode = false;
                    return false;
                }
            })
            .on("afterSetMode", () => {
                const newMode = instance.getMode();

                internalMode = newMode;
                mode = newMode; // Sync to parent
                isUpdatingMode = false;

                forceRemoveMarkers();
                onModeChange?.({ mode: newMode, instance });

                setTimeout(() => emitInputEvent('afterSetMode'), 50);
            })
            .on("change", () => {
                emitInputEvent('change');
            })
            .on("focus", evt => onFocus?.({ evt, instance }))
            .on("blur", evt => onBlur?.({ evt, instance }));
    }

    onMount(() => {
        if (!editorElement) return;

        const mergedConfig = buildConfig();
        instance = editorConstructor.make(editorElement, mergedConfig);

        instance.waitForReady()
            .then(() => {
                if (!instance) return;
                // Set initial value
                if (value) {
                    instance.value = value;
                    lastEditorValue = value;
                }
                instance.setDisabled(disabled);
                instance.setReadOnly(readonly);
                internalMode = instance.getMode();
                mode = internalMode; // Sync initial mode to parent
                isReady = true;
                onReady?.(instance);
                setUpEditorEvents();
            })
            .catch(error => {
                console.error(error);
            });
    });

    onDestroy(() => {
        if (instance) {
            onDestroy?.(instance);
            instance.destruct();
            instance = null;
        }
    });
</script>

<div bind:this={editorElement}></div>
