<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import multiAgentPhoto from '$lib/images/aspen-white.png';
	import mapAgentPhoto from '$lib/images/aspen-up.png';

	let currentWord = 'Trees';
	const words = ['Trees', 'Heat', 'Health', 'Carbon'];
	let wordIndex = 0;
	let visible = true;

	function switchWord() {
		visible = false;
		setTimeout(() => {
			wordIndex = (wordIndex + 1) % words.length;
			currentWord = words[wordIndex];
			setTimeout(() => {
				visible = true;
			}, 1000); // Wait 500ms before showing the new word
		}, 1500); // Wait 1000ms before changing the word
	}

	onMount(() => {
		const interval = setInterval(switchWord, 5000); // Change word every 4 seconds
		return () => clearInterval(interval); // Cleanup on component unmount
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="CI AI Experiments" />
</svelte:head>

<div class="hero min-h-screen hero-image-custom">
	<div class="background-image" />
	<div class="hero-content text-neutral-content text-center">
		<h1 class="hero-title">
			<span class="static-text">Not Just</span>
			<span class="word-container">
				{#if visible}
					<span class="changing-word" transition:fade={{ duration: 1000 }}>
						{currentWord}
					</span>
				{/if}
			</span>
		</h1>
	</div>
</div>

<div class="flex flex-row">
	<div class="w-1/2 p-4">
		<img class="w-50 h-30 object-cover rounded-xl" src={multiAgentPhoto} alt="front tree" />
	</div>
	<div class="w-1/2">
		<div class="p-4 flex flex-col justify-center items-center h-full">
			<h1 class="block-title font-bold text-center">Explore the research</h1>
			<p class="text-neutral-content p-3">
				The Not Just Carbon report produced information about the deep, wide reaching impact that
				deforestation could have on climate change and our planet as a whole. Go deeper and explore
				the research behind the report with a personalized AI assistant.
			</p>
			<a href="/multiagent-chat" role="button" class="btn btn-lg btn-outline">Start Exploring</a>
		</div>
	</div>
</div>

<div class="flex flex-row p-4">
	<div class="w-1/2">
		<div class="p-4 flex flex-col justify-center items-center h-full">
			<h1 class="block-title font-bold text-center">Explore the maps</h1>
			<p class="text-neutral-content p-3 text-right">
				Several of the research projects that came out of the Not Just Carbon initiative produced
				findings based on geospatial data. Explore these with an AI agent assisted map interface and
				learn more about the where behind the findings.
			</p>
			<a href="/map-chat" role="button" class="btn btn-lg btn-outline">Start Exploring</a>
		</div>
	</div>
	<div class="w-1/2 p-4">
		<img class="w-50 h-30 object-cover rounded-xl" src={mapAgentPhoto} alt="tree" />
	</div>
</div>

<style>
	.hero-image-custom {
		position: relative;
		overflow: hidden;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url($lib/images/tree-photo.png);
		background-size: cover;
		background-position: center;
		z-index: 1;
		/* animation: brightnessChange  8s ease-in-out infinite alternate; */
		animation: saturationChange 8s ease-in-out infinite alternate;
	}

	@keyframes saturationChange {
		0% {
			filter: saturate(10%);
		}
		100% {
			filter: saturate(50%);
		}
	}

	.hero-content {
		position: relative;
		z-index: 2;
	}

	.hero-title {
		font-weight: 600;
		font-size: 10vw; /* Responsive font size */
		white-space: nowrap; /* Prevent wrapping */
		width: 100%; /* Take full width */
		text-align: center; /* Center the text */
		overflow: hidden; /* Hide overflow */
		text-overflow: ellipsis; /* Add ellipsis if text overflows */
	}

	.static-text {
		display: inline-block;
		margin-right: 0.3em; /* Add some space between "Not Just" and the changing word */
	}

	.word-container {
		display: inline-block;
		min-width: 4em; /* Adjust based on your longest word */
		text-align: left;
	}

	.changing-word {
		display: inline-block;
	}
	.block-title {
		font-size: 4em;
	}

	@media (min-width: 1750px) {
		.hero-title {
			font-size: 7.5vw;
		}
	}
	@media (max-width: 768px) {
		.hero-title {
			font-size: 8vw;
		}
	}
</style>
