import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read package.json for build-time constants
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
	plugins: [
		svelte()
	],
	define: {
		'__VERSION__': JSON.stringify(pkg.version),
		'__PACKAGE_NAME__': JSON.stringify(pkg.name)
	},
	build: {
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'src/index.js'),
			name: 'SvelteWysiwyg',
			formats: ['es', 'umd'],
			fileName: (format) => `svelte-wysiwyg.${format === 'es' ? 'js' : 'umd.js'}`
		},
		rollupOptions: {
			external: ['svelte', 'svelte/internal', 'jodit'],
			output: {
				globals: {
					svelte: 'Svelte',
					'svelte/internal': 'SvelteInternal',
					jodit: 'Jodit'
				}
			}
		}
	}
});
