<script>
	import MapBiomasChat from '$lib/components/MapBiomasChat.svelte';
	import TextEditor from '$lib/components/TextEditor.svelte'; // Import the new TextEditor component
</script>

<main class="flex-1 h-full w-full">
	<!-- <div class="grid grid-cols-2 h-full">
			<MapBiomasChat class="h-full" />
			<TextEditor class="h-full" />
	</div> -->


	<div class="h-screen flex flex-col">
	  
		<div class="flex-1 flex flex-row overflow-hidden">
		  <div class="card bg-neutral-content shadow-xl w-1/2 overflow-y-auto m-1">
			<div class="card-body p-0">
                <MapBiomasChat class="h-full" />
			</div>
		  </div>
	  
		  <div class="card bg-neutral-content shadow-xl w-1/2 overflow-y-auto m-1">
			<div class="card-body p-2">
                <TextEditor class="h-full" />
			</div>
		  </div>
		</div>
	  </div>
</main>

<style>
    .card {
        max-height: 82vh;
    }
</style>