<script lang="ts">
	import { Background, BackgroundPicker } from 'svelte-backgrounds'

	let value = $state('sunrise-drift')
</script>

<!-- Whole-app background: follows the picker (aura or pattern) -->
<Background preset={value} fixed />

<main style="max-width: 64rem; margin: 0 auto; padding: 2rem 1rem; display: grid; gap: 2rem">
	<h1 style="color: CanvasText">svelte-backgrounds</h1>

	<BackgroundPicker bind:value />

	<Background preset="ember-glow" applyText style="border-radius: 4px; padding: 2rem">
		<h2>A card with an aura</h2>
		<p>Any element, any component.</p>
	</Background>

	<Background preset="basic-grid" style="border-radius: 4px; padding: 2rem; background-color: Canvas">
		<h2>A card with a pattern</h2>
	</Background>

	<Background preset="deep-lagoon" as="section" applyText style="border-radius: 4px; padding: 2rem">
		<h2>As a &lt;section&gt;</h2>
	</Background>
</main>
