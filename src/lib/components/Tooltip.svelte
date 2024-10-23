<!-- src/lib/components/Tooltip.svelte -->
<script>
	import { tooltipStore } from '$lib/stores';
	import { onDestroy } from 'svelte';

	// Reactive subscription using Svelte's $ syntax
	$: tooltip = $tooltipStore;
</script>

{#if tooltip.visible}
	<div class="tooltip {tooltip.position}" style="top: {tooltip.y}px; left: {tooltip.x}px;">
		{tooltip.text}
		<div class="tooltip-arrow {tooltip.position}" />
	</div>
{/if}

<style lang="postcss">
	.tooltip {
		position: fixed;
		background-color: #dbeefb;
		color: #1d4ed8;
		padding: 8px 12px;
		border-radius: 4px;
		z-index: 1000;
		max-width: 250px;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.2s;
        font-size: 0.8rem
	}

	.tooltip.right,
	.tooltip.left,
	.tooltip.top,
	.tooltip.bottom {
		opacity: 1;
	}

	/* Tooltip Arrow */
	.tooltip-arrow {
		position: absolute;
		width: 0;
		height: 0;
		border-style: solid;
	}

	.tooltip.right::after {
		top: 50%;
		left: -5px;
		transform: translateY(-50%);
		border-width: 5px 5px 5px 0;
		border-color: transparent #555 transparent transparent;
	}

	.tooltip.left::after {
		top: 50%;
		right: -5px;
		transform: translateY(-50%);
		border-width: 5px 0 5px 5px;
		border-color: transparent transparent transparent #555;
	}

	.tooltip.top::after {
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		border-width: 5px 5px 0 5px;
		border-color: #555 transparent transparent transparent;
	}

	.tooltip.bottom::after {
		top: -5px;
		left: 50%;
		transform: translateX(-50%);
		border-width: 0 5px 5px 5px;
		border-color: transparent transparent #555 transparent;
	}
</style>
