<script>
	import { onMount } from 'svelte';
	import { currentCitations } from '$lib/stores.js';
</script>

<div class="citations">
	{#if $currentCitations.length > 0}
		<div class="prose">
			<h2>Citations</h2>
			<ul class="space-y-4">
				{#each $currentCitations as citation}
					<div class="card bg-base-100 w-96 shadow-xl">
						<div class="card-body">
							{@html citation}
						</div>
					</div>
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
