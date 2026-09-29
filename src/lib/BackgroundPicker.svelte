<script lang="ts">
	import Background from './Background.svelte'
	import {
		BACKGROUNDS,
		AURA_CATEGORIES,
		PATTERN_CATEGORIES,
		getBackground,
		isAura
	} from './registry.js'
	import type { BackgroundPreset } from './types.js'

	type Kind = 'all' | 'aura' | 'pattern'

	interface Props {
		/** Selected preset id (aura or pattern). Bindable. */
		value?: string
		onchange?: (preset: BackgroundPreset) => void
		/** Show the large live sample + copy-snippet bar above the grid. Default true. */
		preview?: boolean
		/** Restrict which presets are offered. Defaults to every aura and pattern. */
		presets?: BackgroundPreset[]
		/** Component name used in the copied snippet. Default "Background". */
		snippetName?: string
		class?: string
	}

	let {
		value = $bindable(BACKGROUNDS[0].id),
		onchange,
		preview = true,
		presets = BACKGROUNDS,
		snippetName = 'Background',
		class: className = ''
	}: Props = $props()

	let kind = $state<Kind>('all')
	let category = $state('all')
	let tone = $state<'all' | 'light' | 'dark'>('all')
	let query = $state('')
	let copied = $state(false)

	const kinds = $derived<Kind[]>([
		'all',
		...(presets.some(isAura) ? (['aura'] as const) : []),
		...(presets.some((p) => !isAura(p)) ? (['pattern'] as const) : [])
	])

	const inKind = (p: BackgroundPreset) =>
		kind === 'all' || (kind === 'aura') === isAura(p)

	const categories = $derived([...new Set(presets.filter(inKind).map((p) => p.category))])

	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase()
		return presets.filter(
			(p) =>
				inKind(p) &&
				(category === 'all' || p.category === category) &&
				(tone === 'all' || (tone === 'dark') === p.dark) &&
				(!q ||
					`${p.name} ${p.description ?? ''} ${isAura(p) ? p.mood : ''} ${p.id}`
						.toLowerCase()
						.includes(q))
		)
	})

	const current = $derived(presets.find((p) => p.id === value) ?? getBackground(value))

	function setKind(k: Kind) {
		kind = k
		category = 'all'
	}

	function pick(p: BackgroundPreset) {
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

<div class="bg-picker {className}">
	{#if preview && current}
		<Background preset={current} applyText class="bp-preview">
			<div class="bp-preview-body">
				<div class="bp-label" class:bp-pill={!isAura(current)}>
					<strong>{current.name}</strong>
					<span>{current.description ?? current.category}</span>
				</div>
				<button type="button" class="bp-copy" onclick={copy}>
					{copied ? 'Copied' : `preset="${current.id}"`}
				</button>
			</div>
		</Background>
	{/if}

	<div class="bp-filters">
		<input type="search" placeholder="Search…" aria-label="Search backgrounds" bind:value={query} />
		{#if kinds.length > 2}
			<div class="bp-chips" role="group" aria-label="Type">
				{#each kinds as k (k)}
					<button type="button" aria-pressed={kind === k} onclick={() => setKind(k)}>
						{k === 'aura' ? 'auras' : k === 'pattern' ? 'patterns' : 'all'}
					</button>
				{/each}
			</div>
		{/if}
		<div class="bp-chips" role="group" aria-label="Category">
			{#each ['all', ...categories] as c (c)}
				<button type="button" aria-pressed={category === c} onclick={() => (category = c)}>
					{c}
				</button>
			{/each}
		</div>
		<div class="bp-chips" role="group" aria-label="Tone">
			{#each ['all', 'light', 'dark'] as t (t)}
				<button type="button" aria-pressed={tone === t} onclick={() => (tone = t as typeof tone)}>
					{t}
				</button>
			{/each}
		</div>
	</div>

	<div class="bp-grid" role="radiogroup" aria-label="Backgrounds">
		{#each visible as p (p.id)}
			<button
				type="button"
				role="radio"
				aria-checked={p.id === value}
				class="bp-item"
				title={p.description ?? p.name}
				onclick={() => pick(p)}
			>
				<Background
					preset={p}
					blurScale={0.25}
					applyText
					class="bp-thumb"
					style={isAura(p) ? '' : 'background-color: Canvas'}
				/>
				<span>{p.name}</span>
			</button>
		{:else}
			<p class="bp-empty">Nothing matches.</p>
		{/each}
	</div>
</div>

<style>
	.bg-picker {
		display: grid;
		gap: 1rem;
		font: inherit;
		color: inherit;
	}
	:global(.bp-preview) {
		border-radius: 1rem;
		min-height: 11rem;
		display: flex;
		align-items: flex-end;
	}
	.bp-preview-body {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
		gap: 1rem;
		padding: 1.25rem;
	}
	.bp-preview-body strong {
		display: block;
		font-size: 1.25rem;
	}
	.bp-preview-body span {
		opacity: 0.8;
		font-size: 0.875rem;
	}
	.bp-pill {
		background: color-mix(in srgb, Canvas 82%, transparent);
		color: CanvasText;
		border-radius: 0.5rem;
		padding: 0.5rem 0.75rem;
	}
	.bp-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: center;
	}
	.bp-filters input,
	.bp-chips button,
	.bp-copy {
		font: inherit;
		font-size: 0.8125rem;
		color: inherit;
		background: transparent;
		border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
		border-radius: 999px;
		padding: 0.3rem 0.75rem;
	}
	.bp-filters input {
		min-width: 12rem;
	}
	.bp-copy {
		cursor: pointer;
		background: color-mix(in srgb, currentColor 12%, transparent);
		white-space: nowrap;
	}
	.bp-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}
	.bp-chips button {
		cursor: pointer;
		text-transform: capitalize;
	}
	.bp-chips button[aria-pressed='true'] {
		background: color-mix(in srgb, currentColor 18%, transparent);
		border-color: currentColor;
	}
	.bp-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
		gap: 0.75rem;
	}
	.bp-item {
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
	:global(.bp-thumb) {
		aspect-ratio: 4 / 3;
		border-radius: 0.625rem;
		outline: 2px solid transparent;
		outline-offset: 2px;
		transition: outline-color 0.15s;
	}
	.bp-item:hover :global(.bp-thumb) {
		outline-color: color-mix(in srgb, currentColor 35%, transparent);
	}
	.bp-item[aria-checked='true'] :global(.bp-thumb) {
		outline-color: currentColor;
	}
	.bp-item:focus-visible :global(.bp-thumb) {
		outline-color: currentColor;
	}
	.bp-empty {
		grid-column: 1 / -1;
		opacity: 0.6;
	}
</style>
