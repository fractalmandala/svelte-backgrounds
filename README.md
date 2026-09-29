# @fractaldesign/svelte-backgrounds

Set a background on **anything** in Svelte 5 / SvelteKit — an element, a component, or your whole app. 200+ soft blurred **aura** gradients and 257 CSS **patterns** (grids, dots, masks, glows…), plus a picker to browse them.

```sh
pnpm add @fractaldesign/svelte-backgrounds
```

## Use

```svelte
<script>
	import { Background } from '@fractaldesign/svelte-backgrounds'
</script>

<!-- an aura on a card -->
<Background preset="ember-glow" applyText style="padding:2rem;border-radius:1rem">
	Hello
</Background>

<!-- a pattern; render as another tag -->
<Background preset="basic-grid" as="section">…</Background>

<!-- whole site: pin behind everything (put it in +layout.svelte) -->
<Background preset="sunrise-drift" fixed />
```

`<Background>` renders a `position: relative` wrapper with the background behind its children, so it works on any box you can put children in. To style a component you don't control, wrap it.

| Prop | Default | |
| --- | --- | --- |
| `preset` | — | Preset id (aura or pattern), or a preset object (bring your own). |
| `as` | `"div"` | Tag to render. |
| `fixed` | `false` | Pin to the viewport, behind the page. |
| `applyText` | `false` | Auras only: also set the preset's suggested text colour. |
| `blurScale` | `1` | Auras only: multiply every layer's blur (e.g. `0.25` for thumbnails). |

All other attributes (`class`, `style`, `id`, `aria-*`, …) are passed to the element. Patterns that don't paint their own colour draw on top of the wrapper's `background-color`, so set one (e.g. `style="background-color: white"`) to control what the pattern sits on.

## Pick / sample

```svelte
<script>
	import { Background, BackgroundPicker } from '@fractaldesign/svelte-backgrounds'
	let value = $state('sunrise-drift')
</script>

<Background preset={value} fixed />
<BackgroundPicker bind:value />
```

`BackgroundPicker` shows a live sample, search, an auras/patterns switch, category filters, a light/dark filter, and a grid of previews. Props: `value` (bindable), `onchange(preset)`, `preview` (default `true`), `presets` (restrict the list), `snippetName`. It inherits your text colour and font.

> [Aura Gradients](https://auragradients.vercel.app/) are the creation of [Cristian Olivera](https://github.com/CristianOlivera1), and this component gratefully relies on their [MIT License](https://github.com/CristianOlivera1/Aura/blob/main/LICENSE), extending it unchanged.

> [Patterncraft](https://patterncraft.fun/) patterns are the creation of [Megh Bari](https://x.com/meghtrix), and this component gratefully relies on their [MIT License](https://github.com/megh-bari/pattern-craft/blob/main/LICENSE), extending it unchanged.

## Data

```ts
import {
	BACKGROUNDS, AURA_PRESETS, PATTERN_PRESETS,
	AURA_CATEGORIES, PATTERN_CATEGORIES,
	getBackground, getAura, getPattern, isAura, isPattern
} from '@fractaldesign/svelte-backgrounds'
```

- **Aura** — `{ id, name, category, mood, dark, base, text, description, layers[] }`; a layer is `{ bg, blend, blur, blurDesktop?, opacity? }`. Blur uses `blur` below 768px and `blurDesktop` (falling back to `blur`) above. Categories: aura, lattice, mesh, nebula, prism, grain, glass, flux.
- **Pattern** — `{ id, name, category, dark, description?, css, bleed?, keyframes? }`; `css` is applied to one layer. `dark` was classified by hand from the rendered previews, so it means "looks dark", not "meant for a dark page". Categories: geometric, effects, gradients, decorative.

Ids are unique across both sets. One pattern shared an id with an aura and is `ember-glow-pattern`.

## How it works

Auras: the base colour is painted on an isolated container; each layer is an absolutely positioned gradient with `mix-blend-mode`, `filter: blur()` and opacity, overscanned by its blur radius so edges stay soft. Patterns: one absolutely positioned layer carrying the pattern's CSS. Animated patterns ship their own `@keyframes` (prefixed `bgp-`) and stop under `prefers-reduced-motion`.

## Notes

- Ships TypeScript/Svelte source (Svelte `svelte` export condition); no build step needed.
- All presets live in two modules (~230 kB source); importing the package includes both.
- Many blurred layers are GPU work. Prefer few `Background` instances on screen at once; the picker filters and uses `content-visibility` for that reason.
- Blend modes (e.g. the multiply glows) blend within the wrapper, not with content behind it.
