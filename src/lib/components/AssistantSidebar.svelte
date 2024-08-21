<script>
	import { selectedOption } from '$lib/stores';
	import { assistantDefinitions } from '$lib/assistant-definition';

	const options = [];
	// add the name property to the options list
	assistantDefinitions.forEach((definition, index) => {
		options.push({
			id: index,
			label: definition.name,
		});
	});
	console.log(options);

	function handleClick(index) {
		$selectedOption = index;
		console.log($selectedOption);
	}
</script>

<ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
	{#each options as option, index}
		<li>
			<a on:click={() => handleClick(index)} class:active={$selectedOption === index} href="#">
				{option.label}
			</a>
		</li>
	{/each}
</ul>

<style>
</style>
