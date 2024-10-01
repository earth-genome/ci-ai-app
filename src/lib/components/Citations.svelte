<script>
	import { onMount } from 'svelte';
	import { currentCitations } from '$lib/stores.js';
</script>

<div class="citations">
    <div class="prose">
        <h2>Citations</h2>
    </div>
	{#if $currentCitations.length > 0}
		<div>
			<ul>
				{#each $currentCitations as citation}
					<li>{@html citation}</li> <!-- Changed from card to list item -->
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.citations {
		margin-top: 2rem;
	}

	/* Add any additional styles for rendered HTML content */
	:global(.citations a) {
		color: #0000ee;
		text-decoration: underline;
	}

	:global(.citations p) {
		margin-bottom: 0.5em;
	}
</style>
