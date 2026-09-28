import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(), alias: { 'svelte-aura': 'src/lib/index.ts' } }
}
