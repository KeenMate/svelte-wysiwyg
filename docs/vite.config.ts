import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	server: {
		port: 12500
	},
	plugins: [
		svelte({
			compilerOptions: {
				runes: true
			}
		})
	],
	resolve: {
		alias: {
			// Point to source for HMR during development
			'@keenmate/svelte-wysiwyg-v5': resolve(__dirname, '../packages/svelte-wysiwyg-v5/src/index.js')
		}
	},
	build: {
		outDir: 'build',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				'index': resolve(__dirname, 'index.html'),
				'examples-basic': resolve(__dirname, 'examples-basic.html'),
				'examples-props': resolve(__dirname, 'examples-props.html'),
				'examples-toolbar': resolve(__dirname, 'examples-toolbar.html')
			}
		},
		// Copy static files
		copyPublicDir: true
	},
	// Use examples-basic.html as the dev server entry
	appType: 'mpa'
});
