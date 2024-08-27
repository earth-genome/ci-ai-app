<script>
	import leaves from '$lib/images/leaf-texture.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="CI AI Experiments" />
</svelte:head>
<div class="card bg-base-100 image-full w-96 shadow-xl">
	<figure>
		<img
			src={leaves}
			alt="leaves"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">Research Agent Demo</h2>
		<p>Chat with a research agent to learn more about climate change and it's impacts.</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary" href="./agent-chat">Explore</button>
		</div>
	</div>
</div>
<div class="card lg:card-side bg-base-100 shadow-xl">
	<figure>
		<img
			src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
			alt="Album"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">Research Agent Demo</h2>
		<p>Chat with a research agent to learn more about climate change and it's impacts.</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Explore</button>
		</div>
	</div>
</div>
<div class="card lg:card-side bg-base-100 shadow-xl">
	<figure>
		<img
			src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
			alt="Album"
		/>
	</figure>
	<div class="card-body">
		<h2 class="card-title">Map Explorer</h2>
		<p>Explore the impacts of deforestation on warming temperatures</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Explore</button>
		</div>
	</div>
</div>

<style>
</style>
