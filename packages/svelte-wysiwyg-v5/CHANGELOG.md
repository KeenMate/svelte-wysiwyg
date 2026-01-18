# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0-rc01] - 2026-01-18

### Added
- Initial release candidate for Svelte 5 version
- `WysiwygEditor` component wrapping Jodit WYSIWYG editor using Svelte 5 runes
- Two-way binding support for `value` and `mode` props using `$bindable()`
- Dynamic props: `disabled`, `readonly`, `height`, `width`, `maxHeight`, `maxWidth`, `placeholder`, `theme`, `toolbar`, `statusbar`, `language`, `direction`, `enter`, `iframe`, `spellcheck`
- Callback props: `onReady`, `onInput`, `onModeChange`, `onFocus`, `onBlur`, `onDestroy`
- `createModeToggle` utility for custom toolbar buttons
- Defensive CSS styles for proper list, table, and blockquote rendering
- TypeScript definitions
