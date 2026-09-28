# @fractaldesign/svelte-backgrounds

Set a soft, blurred "aura" gradient background on **anything** in Svelte 5 / SvelteKit — an element, a component, or your whole app. Ships 200+ presets and a picker to browse them.

```sh
pnpm add @fractaldesign/svelte-backgrounds
```

## Use

```svelte
<script>
	import { Aura } from '@fractaldesign/svelte-backgrounds'
</script>

<!-- an element / a card -->
<Aura preset="ember-glow" applyText style="padding:2rem;border-radius:1rem">
	Hello
</Aura>

<!-- render as another tag -->
<Aura preset="deep-lagoon" as="section">…</Aura>

<!-- whole site: pin behind everything (put it in +layout.svelte) -->
<Aura preset="sunrise-drift" fixed />
```

`<Aura>` renders a `position: relative` wrapper with the aura layers behind its children, so it works on any box you can put children in. To style a component you don't control, wrap it.

| Prop | Default | |
| --- | --- | --- |
| `preset` | — | Preset id, or a full `AuraPreset` object (bring your own). |
| `as` | `"div"` | Tag to render. |
| `fixed` | `false` | Pin to the viewport, behind the page. |
| `applyText` | `false` | Also set the preset's suggested text colour. |
| `blurScale` | `1` | Multiply every layer's blur (e.g. `0.25` for thumbnails). |

All other attributes (`class`, `style`, `id`, `aria-*`, …) are passed to the element.

## Pick / sample

```svelte
<script>
	import { Aura, AuraPicker } from '@fractaldesign/svelte-backgrounds'
	let value = $state('sunrise-drift')
</script>

<Aura preset={value} fixed />
<AuraPicker bind:value />
```

`AuraPicker` shows a live sample, search, category and light/dark filters, and a grid of previews. Props: `value` (bindable), `onchange(preset)`, `preview` (default `true`), `presets` (restrict the list), `snippetName`. It inherits your text colour and font.

> [Aura Gradients](https://auragradients.vercel.app/) are the creation of [Cristian Olivera](https://github.com/CristianOlivera1), and this component gratefully relies on their [MIT License](https://github.com/CristianOlivera1/Aura/blob/main/LICENSE), extending it unchanged.

## Data

```ts
import { AURA_PRESETS, AURA_CATEGORIES, getAura } from '@fractaldesign/svelte-backgrounds'
```

Categories: aura, lattice, mesh, nebula, prism, grain, glass, flux. Each preset is `{ id, name, category, mood, dark, base, text, description, layers[] }`; a layer is `{ bg, blend, blur, blurDesktop?, opacity? }`. Blur uses `blur` below 768px and `blurDesktop` (falling back to `blur`) above.

## How it works

The base colour is painted on an isolated container; each layer is an absolutely positioned gradient with `mix-blend-mode`, `filter: blur()` and opacity, overscanned by its blur radius so edges stay soft. No JS at runtime beyond rendering.

## Notes

- Ships TypeScript/Svelte source; no build step needed.
- The preset list is one module (~135 kB source); the picker and `getAura` need it, so importing the package includes all presets.
- Many blurred layers are GPU work. Prefer few `Aura` instances on screen at once; the picker filters and uses `content-visibility` for that reason.
