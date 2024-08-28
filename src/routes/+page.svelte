<script>
	import leaves from '$lib/images/leaf-texture.png';
	import leaves2 from '$lib/images/leaf-texture2.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="CI AI Experiments" />
</svelte:head>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
	<div class="flex space-x-4">
		<div class="card bg-base-100 image-full w-96 shadow-xl">
			<figure>
				<img src={leaves} alt="leaves" />
			</figure>
			<div class="card-body">
				<h2 class="card-title">Research Agent Demo</h2>
				<p>Chat with a research agent to learn more about climate change and its impacts.</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary" onclick="window.location.href='./map-chat'">Explore</button>
				</div>
			</div>
		</div>
		<div class="card bg-base-100 image-full w-96 shadow-xl">
			<figure>
				<img src={leaves2} alt="leaves" />
			</figure>
			<div class="card-body">
				<h2 class="card-title">Map Explorer</h2>
				<p>Explore the impacts of deforestation on warming temperatures</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary" onclick="window.location.href='./agent-chat'">Explore</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Add any additional custom styles here if needed */
</style>