<!-- src/lib/components/TooltipBadge.svelte -->
<script>
	import { tooltipStore } from '$lib/stores';

	export let tooltipText = ''; // Text to display in the tooltip
	export let position = 'right'; // Tooltip position: 'top', 'bottom', 'left', 'right'
	export let badgeContent = '?'; // Content inside the badge (e.g., '?', '!', etc.)

	function handleMouseEnter(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		let x, y;

		switch (position) {
			case 'top':
				x = rect.left + rect.width / 2;
				y = rect.top - 8; // 8px offset above the badge
				break;
			case 'bottom':
				x = rect.left + rect.width / 2;
				y = rect.bottom + 8; // 8px offset below the badge
				break;
			case 'left':
				x = rect.left - 8; // 8px offset to the left of the badge
				y = rect.top + rect.height / 2;
				break;
			case 'right':
			default:
				x = rect.right + 8; // 8px offset to the right of the badge
				y = rect.top + rect.height / 2;
				break;
		}

		tooltipStore.set({
			visible: true,
			text: tooltipText,
			position: position,
			x: x,
			y: y
		});
	}

	function handleMouseLeave() {
		tooltipStore.set({
			visible: false,
			text: '',
			position: 'right',
			x: 0,
			y: 0
		});
	}
</script>

<span
	class="badge badge-info cursor-help"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
>
	{badgeContent}
</span>
