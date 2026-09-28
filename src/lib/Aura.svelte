<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import { getAura } from './registry.js'
	import type { AuraPreset } from './types.js'

	interface Props extends HTMLAttributes<HTMLElement> {
		/** A preset id (e.g. "sunrise-drift") or a preset object. */
		preset: string | AuraPreset
		/** Element to render. Default "div". */
		as?: string
		/** Pin the aura to the viewport behind the whole page. Renders no wrapper content box. */
		fixed?: boolean
		/** Multiply every layer's blur. Use a small value for thumbnails. Default 1. */
		blurScale?: number
		/** Also apply the preset's suggested text colour. Default false. */
		applyText?: boolean
		children?: Snippet
	}

	let {
		preset,
		as = 'div',
		fixed = false,
		blurScale = 1,
		applyText = false,
		children,
		class: className = '',
		style = '',
		...rest
	}: Props = $props()

	const resolved = $derived(typeof preset === 'string' ? getAura(preset) : preset)
</script>

<svelte:element
	this={as}
	{...rest}
	class="aura-host {className}"
	class:aura-fixed={fixed}
	data-aura={resolved?.id}
	style="{resolved ? `--aura-base:${resolved.base};` : ''}{applyText && resolved
		? `color:${resolved.text};`
		: ''}{style}"
>
	{#if resolved}
		<div class="aura-bg" aria-hidden="true">
			{#each resolved.layers as layer, i (i)}
				<div
					class="aura-layer"
					style="background:{layer.bg};mix-blend-mode:{layer.blend};--m:{layer.blur *
						blurScale}px;--d:{(layer.blurDesktop ?? layer.blur) * blurScale}px;opacity:{layer.opacity ??
						1}"
				></div>
			{/each}
		</div>
	{/if}
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.aura-host {
		position: relative;
		isolation: isolate;
	}
	.aura-host.aura-fixed {
		position: fixed;
		inset: 0;
		z-index: -1;
		pointer-events: none;
	}
	.aura-bg {
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		isolation: isolate;
		pointer-events: none;
		background-color: var(--aura-base, transparent);
		border-radius: inherit;
	}
	/* Overscan by the blur radius so blurred edges don't fade into the base colour. */
	.aura-layer {
		position: absolute;
		inset: calc(var(--b) * -1);
		--b: var(--m);
		filter: blur(var(--b));
		will-change: filter;
	}
	@media (min-width: 768px) {
		.aura-layer {
			--b: var(--d);
		}
	}
</style>
