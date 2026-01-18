<script>
    import { untrack } from 'svelte';

    /** @type {typeof import('jodit').Jodit} */
    let {
        editorConstructor,
        value = $bindable(""),
        mode = $bindable(1), // 1=WYSIWYG, 2=SOURCE, 3=SPLIT
        config = {},
        // Dynamic props (can change at runtime)
        disabled = false,
        readonly = false,
        // Static props (merged into config at init)
        height = undefined,
        width = undefined,
        maxHeight = undefined,
        maxWidth = undefined,
        placeholder = undefined,
        theme = undefined,
        toolbar = undefined,
        statusbar = undefined,
        language = undefined,
        direction = undefined,
        enter = undefined,
        iframe = undefined,
        spellcheck = undefined,
        // Callbacks
        onReady = undefined,
        onInput = undefined,
        onModeChange = undefined,
        onFocus = undefined,
        onBlur = undefined,
        onDestroy = undefined
    } = $props();

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

    // Sync value from parent to editor
    $effect(() => {
        const currentValue = value;
        untrack(() => {
            if (instance && currentValue !== lastEditorValue) {
                const cleanValue = stripSelectionMarkers(currentValue);
                instance.value = cleanValue;
                lastEditorValue = cleanValue;
            }
        });
    });

    // Sync mode from parent to editor
    $effect(() => {
        const targetMode = mode;
        untrack(() => {
            if (instance && targetMode !== internalMode && !isUpdatingMode) {
                isUpdatingMode = true;
                instance.setMode(targetMode);
                // isUpdatingMode will be reset in afterSetMode handler
            }
        });
    });

    // Sync readonly from parent to editor
    $effect(() => {
        const isReadonly = readonly;
        untrack(() => {
            if (instance) {
                instance.setReadOnly(isReadonly);
            }
        });
    });

    // Initialize editor when element is mounted
    $effect(() => {
        const element = editorElement;
        if (!element) return;

        untrack(() => {
            const mergedConfig = buildConfig();
            instance = editorConstructor.make(element, mergedConfig);

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
                    onReady?.(instance);
                    setUpEditorEvents();
                })
                .catch(error => {
                    console.error(error);
                });
        });

        return () => {
            if (instance) {
                onDestroy?.(instance);
                instance.destruct();
                instance = null;
            }
        };
    });

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
</script>

<div bind:this={editorElement}></div>
