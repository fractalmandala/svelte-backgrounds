<script lang="ts">
	import Aura from './Aura.svelte'
	import { AURA_PRESETS, AURA_CATEGORIES, getAura } from './registry.js'
	import type { AuraPreset } from './types.js'

	interface Props {
		/** Selected preset id. Bindable. */
		value?: string
		onchange?: (preset: AuraPreset) => void
		/** Show the large live sample + copy-snippet bar above the grid. Default true. */
		preview?: boolean
		/** Restrict which presets are offered. */
		presets?: AuraPreset[]
		/** Component name used in the copied snippet. Default "Aura". */
		snippetName?: string
		class?: string
	}

	let {
		value = $bindable(AURA_PRESETS[0].id),
		onchange,
		preview = true,
		presets = AURA_PRESETS,
		snippetName = 'Aura',
		class: className = ''
	}: Props = $props()

	let category = $state('all')
	let tone = $state<'all' | 'light' | 'dark'>('all')
	let query = $state('')
	let copied = $state(false)

	const categories = $derived(
		presets === AURA_PRESETS ? AURA_CATEGORIES : [...new Set(presets.map((p) => p.category))]
	)

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase()
		return presets.filter(
			(p) =>
				(category === 'all' || p.category === category) &&
				(tone === 'all' || (tone === 'dark') === p.dark) &&
				(!q || `${p.name} ${p.description} ${p.mood} ${p.id}`.toLowerCase().includes(q))
		)
	})

	const current = $derived(presets.find((p) => p.id === value) ?? getAura(value))

	function pick(p: AuraPreset) {
		value = p.id
		onchange?.(p)
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(`<${snippetName} preset="${value}">…</${snippetName}>`)
			copied = true
			setTimeout(() => (copied = false), 1400)
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div class="aura-picker {className}">
	{#if preview && current}
		<Aura preset={current} applyText class="ap-preview">
			<div class="ap-preview-body">
				<div>
					<strong>{current.name}</strong>
					<span>{current.description}</span>
				</div>
				<button type="button" class="ap-copy" onclick={copy}>
					{copied ? 'Copied' : `preset="${current.id}"`}
				</button>
			</div>
		</Aura>
	{/if}

	<div class="ap-filters">
		<input
			type="search"
			placeholder="Search auras…"
			aria-label="Search auras"
			bind:value={query}
		/>
		<div class="ap-chips" role="group" aria-label="Category">
			{#each ['all', ...categories] as c (c)}
				<button type="button" aria-pressed={category === c} onclick={() => (category = c)}>
					{c}
				</button>
			{/each}
		</div>
		<div class="ap-chips" role="group" aria-label="Tone">
			{#each ['all', 'light', 'dark'] as t (t)}
				<button
					type="button"
					aria-pressed={tone === t}
					onclick={() => (tone = t as typeof tone)}
				>
					{t}
				</button>
			{/each}
		</div>
	</div>

	<div class="ap-grid" role="radiogroup" aria-label="Aura presets">
		{#each visible as p (p.id)}
			<button
				type="button"
				role="radio"
				aria-checked={p.id === value}
				class="ap-item"
				title={p.description}
				onclick={() => pick(p)}
			>
				<Aura preset={p} blurScale={0.25} applyText class="ap-thumb" />
				<span>{p.name}</span>
			</button>
		{:else}
			<p class="ap-empty">No auras match.</p>
		{/each}
	</div>
</div>

<style>
	.aura-picker {
		display: grid;
		gap: 1rem;
		font: inherit;
		color: inherit;
	}
	:global(.ap-preview) {
		border-radius: 1rem;
		min-height: 11rem;
		display: flex;
		align-items: flex-end;
	}
	.ap-preview-body {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		padding: 1.25rem;
	}
	.ap-preview-body strong {
		display: block;
		font-size: 1.25rem;
	}
	.ap-preview-body span {
		opacity: 0.8;
		font-size: 0.875rem;
	}
	.ap-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: center;
	}
	.ap-filters input,
	.ap-chips button,
	.ap-copy {
		font: inherit;
		font-size: 0.8125rem;
		color: inherit;
		background: transparent;
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		border-radius: 999px;
		padding: 0.3rem 0.75rem;
	}
	.ap-filters input {
		min-width: 12rem;
	}
	.ap-copy {
		cursor: pointer;
		background: color-mix(in srgb, currentColor 12%, transparent);
		white-space: nowrap;
	}
	.ap-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.ap-chips button {
		cursor: pointer;
		text-transform: capitalize;
	}
	.ap-chips button[aria-pressed='true'] {
		background: color-mix(in srgb, currentColor 18%, transparent);
		border-color: currentColor;
	}
	.ap-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
		gap: 0.75rem;
	}
	.ap-item {
		display: grid;
		gap: 0.375rem;
		text-align: left;
		font: inherit;
		font-size: 0.75rem;
		color: inherit;
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
		content-visibility: auto;
		contain-intrinsic-size: auto 8rem;
	}
	:global(.ap-thumb) {
		aspect-ratio: 4 / 3;
		border-radius: 0.625rem;
		outline: 2px solid transparent;
		outline-offset: 2px;
		transition: outline-color 0.15s;
	}
	.ap-item:hover :global(.ap-thumb) {
		outline-color: color-mix(in srgb, currentColor 35%, transparent);
	}
	.ap-item[aria-checked='true'] :global(.ap-thumb) {
		outline-color: currentColor;
	}
	.ap-item:focus-visible :global(.ap-thumb) {
		outline-color: currentColor;
	}
	.ap-empty {
		grid-column: 1 / -1;
		opacity: 0.6;
	}
</style>
