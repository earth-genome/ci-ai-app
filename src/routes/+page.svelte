<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import multiAgentPhoto from '$lib/images/jungle-waterfall.png';
	import mapAgentPhoto from '$lib/images/deep-rainforest.jpg';

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

	let scrollY;

	function handleScroll() {
		scrollY = window.scrollY;
	}

	onMount(() => {
		const interval = setInterval(switchWord, 5000); // Change word every 4 seconds
		window.addEventListener('scroll', handleScroll);
		return () => {
			clearInterval(interval); // Cleanup on component unmount
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="CI AI Experiments" />
</svelte:head>

<svelte:window on:scroll={handleScroll}/>

<div 
	class="fullscreen-bg" 
	style="transform: translateY(-{scrollY * 0.3}px);"
></div>

<div class="content-wrapper">
	<section class="hero-section">
		<h1 class="main-title">
			<span class="static-text">Not Just</span>
			<span class="word-container">
				{#if visible}
					<span class="changing-word" transition:fade={{ duration: 1000 }}>
						{currentWord}
					</span>
				{/if}
			</span>
		</h1>
	</section>

	<section class="info-section flex justify-end">
		<div class="card card-side bg-base-100 shadow-xl m-4" style="max-width: 1000px;">
			<figure class="w-1/2">
				<img src={multiAgentPhoto} alt="Multi-agent" class="w-full h-full object-cover" />
			</figure>
			<div class="card-body w-1/2">
				<h2 class="card-title">Explore the research</h2>
				<p>The Not Just Carbon report produced information about the deep, wide reaching impact that
				   deforestation could have on climate change and our planet as a whole. Go deeper and explore
				   the research behind the report with a personalized AI assistant.</p>
				<div class="card-actions justify-center">
					<a href="/multiagent-chat" class="btn btn-outline btn-wide">Start Exploring</a>
				</div>
			</div>
		</div>
	</section>

	<section class="info-section">
		<div class="card card-side bg-base-100 shadow-xl m-4 flex-row-reverse" style="max-width: 1000px;">
			<figure class="w-1/2">
				<img src={mapAgentPhoto} alt="Map agent" class="w-full h-full object-cover" />
			</figure>
			<div class="card-body w-1/2">
				<h2 class="card-title">Explore the maps</h2>
				<p>Several of the research projects that came out of the Not Just Carbon initiative produced
				   findings based on geospatial data. Explore these with an AI agent assisted map interface and
				   learn more about the where behind the findings.</p>
				<div class="card-actions justify-end">
					<div class="flex justify-center w-full">
						<a href="/map-viz-gen" class="btn btn-outline btn-wide">Start Exploring</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.fullscreen-bg {
		position: fixed;
		top: 0; /* Change this back to 0 */
		left: 0;
		width: 100vw;
		height: 120vh; /* Slightly taller than the viewport */
		background-image: url($lib/images/jungle.jpg);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		z-index: -1;
		animation: saturationChange 8s ease-in-out infinite alternate;
		will-change: transform;
	}

	.content-wrapper {
		position: relative;
		z-index: 1;
	}

	.hero-section {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main-title {
		font-weight: 600;
		font-size: 10vw;
		white-space: nowrap;
		text-align: center;
		color: white;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
	}

	@keyframes saturationChange {
		0% {
			filter: saturate(10%);
		}
		100% {
			filter: saturate(50%);
		}
	}

	.static-text {
		display: inline-block;
		margin-right: 0.3em;
	}

	.word-container {
		display: inline-block;
		min-width: 4em;
		text-align: left;
	}

	.changing-word {
		display: inline-block;
	}

	@media (max-width: 768px) {
		.main-title {
			font-size: 8vw;
		}
		.card-side {
			flex-direction: column !important;
		}
		.card-side figure,
		.card-side .card-body {
			width: 100% !important;
		}
	}
</style>
