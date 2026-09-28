<script lang="ts">
	import { Aura, AuraPicker } from 'svelte-backgrounds'

	let value = $state('sunrise-drift')
</script>

<!-- Whole-app background: follows the picker -->
<Aura preset={value} fixed />

<main style="max-width: 64rem; margin: 0 auto; padding: 2rem 1rem; display: grid; gap: 2rem">
	<h1>svelte-aura</h1>

	<AuraPicker bind:value />

	<Aura preset="ember-glow" applyText style="border-radius: 1rem; padding: 2rem">
		<h2>A card with its own aura</h2>
		<p>Any element, any component.</p>
	</Aura>

	<Aura preset="deep-lagoon" as="section" applyText style="border-radius: 1rem; padding: 2rem">
		<h2>As a &lt;section&gt;</h2>
	</Aura>
</main>
