<script>
	let selectedOption = 0;
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

	function handleChange(event) {
		selectedOption = event.target.value;
	}
</script>

<aside class="bg-base-200 w-64 h-full p-4">
	<h2 class="text-xl font-bold mb-4">Assistants available</h2>

	{#each options as option}
		<div class="form-control">
			<label class="label cursor-pointer">
				<span class="label-text">{option.label}</span>
				<input
					type="radio"
					name="assistant-choice"
					value={option.id}
					class="radio checked:{option.label === selectedOption}"
					checked={selectedOption === option.label}
					on:change={handleChange}
				/>
			</label>
		</div>
	{/each}

	<p class="mt-4">Selected option: {selectedOption}</p>
</aside>

<style>
</style>
