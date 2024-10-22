<script>
    import { onMount } from 'svelte';   
    import { writable } from 'svelte/store';
    import {selectedProperty} from '$lib/stores.js';

    let dataProperties;
    
    onMount(async () => {
        const response = await fetch('/heat_deforestation_data_overview.json');
        dataProperties = await response.json();
    });
    
    const allProperties = [
        'Delta_T',
        'local_0-2km_start', 'local_0-2km_end',
        'regional_2-5km_start', 'regional_2-5km_end',
        'regional_5-10km_start', 'regional_5-10km_end',
        'regional_10-25km_start', 'regional_10-25km_end',
        'regional_25-50km_start', 'regional_25-50km_end',
        'regional_50-100km_start', 'regional_50-100km_end',
        'wbgt_ERA5', 'wbgt_hist_comflor', 'wbgt_hist_se6flor',
        'wbgt_rcp4_comflor', 'wbgt_rcp4_se6flor',
        'wbgt_rcp8_comflor', 'wbgt_rcp8_se6flor'
    ];

    function handleSelect(property) {
        selectedProperty.set(property);
    }
</script>

{#if dataProperties}
<div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {#each allProperties as property}
            <div class="card bg-neutral shadow-s hover:shadow-2xl transition-shadow">
                <div class="card-body p-4">
                    <h2 class="card-title">{dataProperties.short_explanation[property]}</h2>
                    <p class="text-sm">{dataProperties.explanation[property]}</p>
                    <div class="card-actions justify-center">
                        <button 
                            class="btn btn-wide btn-outline mt-4"
                            on:click={() => handleSelect(property)}
                        >
                            Visualize
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
{:else}
    <div class="flex justify-center items-center h-screen">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{/if}

<style>
    .card {
        @apply backdrop-blur-sm bg-opacity-90;
    }
</style>