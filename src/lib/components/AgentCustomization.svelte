<script>
    import { sliderValues } from '$lib/stores.js';
    import { get } from 'svelte/store'

    // Remove individual reactive declarations
    // $: formalityLevel = $sliderValues.formality;
    // $: technicalDepthLevel = $sliderValues.technical_depth;
    // $: concisenessLevel = $sliderValues.conciseness;
    // $: directnessLevel = $sliderValues.directness;
    // $: gradeLevel = $sliderValues.grade;

    function updateSlider(key, value) {
        sliderValues.update(currentValues => {
            return { ...currentValues, [key]: parseInt(value, 10) };
        });
        console.log('sliderValues: ', get(sliderValues))
    }
</script>

<div class="p-4 space-y-6">
    <h2 class="text-2xl font-bold mb-4">Agent Customization</h2>
  
    <div class="space-y-4">
        <div>
            <label for="formality" class="block mb-2">Formality: {$sliderValues.formality}</label>
            <input type="range" min="1" max="8" class="range range-primary" step="1" 
                   value={$sliderValues.formality} id="formality" 
                   on:input={(e) => updateSlider('formality', e.target.value)} />
        </div>

        <div>
            <label for="technical-depth" class="block mb-2">Technical Depth: {$sliderValues.technical_depth}</label>
            <input type="range" min="1" max="8" class="range range-secondary" step="1" 
                   value={$sliderValues.technical_depth} id="technical-depth" 
                   on:input={(e) => updateSlider('technical_depth', e.target.value)}  />
        </div>

        <div>
            <label for="conciseness" class="block mb-2">Conciseness: {$sliderValues.conciseness}</label>
            <input type="range" min="1" max="8" class="range range-accent" step="1" 
                   value={$sliderValues.conciseness} id="conciseness" 
                   on:input={(e) => updateSlider('conciseness', e.target.value)}  />
        </div>

        <div>
            <label for="directness" class="block mb-2">Directness: {$sliderValues.directness}</label>
            <input type="range" min="1" max="8" class="range range-info" step="1" 
                   value={$sliderValues.directness} id="directness" 
                   on:input={(e) => updateSlider('directness', e.target.value)}  />
        </div>

        <div>
            <label for="grade" class="block mb-2">Grade level: {$sliderValues.grade}</label>
            <input type="range" min="1" max="12" class="range range-success" step="1" 
                   value={$sliderValues.grade} id="grade-level" 
                   on:input={(e) => updateSlider('grade', e.target.value)}  />
        </div>
    </div>
</div>