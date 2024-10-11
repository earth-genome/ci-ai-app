<script>
    import { sliderValues, selectedAgentIndex } from '$lib/stores.js';
    import { get } from 'svelte/store'

    function updateSlider(key, value) {
        sliderValues.update(currentValues => {
            return { ...currentValues, [key]: parseInt(value, 10) };
        });
        console.log('sliderValues: ', get(sliderValues))
    }

    $: isProfessorSelected = $selectedAgentIndex === 2; // Assuming professor is index 3

    function getGradeString(value) {
        const grades = [
            '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th',
            'Undergraduate', 'Graduate', 'PhD'
        ];
        return grades[value - 1] || 'PhD';
    }
</script>

<div class="p-4 space-y-6">
    <h2 class="text-2xl font-bold mb-4">Agent Customization</h2>
  
    <div class="space-y-4">
        <div>
            <label for="temperature" class="block mb-2">Temperature: {$sliderValues.temperature}</label>
            <input type="range" min="0" max="2" class="range range-primary" step="0.1" 
                   value={$sliderValues.temperatue} id="temperatue" 
                   on:input={(e) => updateSlider('temperatue', e.target.value)} />
        </div>

        <div>
            <label for="length" class="block mb-2">Response length: {$sliderValues.length}</label>
            <input type="range" min="1" max="4" class="range range-secondary" step="1" 
                   value={$sliderValues.length} id="length" 
                   on:input={(e) => updateSlider('length', e.target.value)}  />
        </div>

        <div>
            <label for="formatting" class="block mb-2">Level of formatting: {$sliderValues.formatting}</label>
            <input type="range" min="1" max="4" class="range range-accent" step="1" 
                   value={$sliderValues.formatting} id="formatting" 
                   on:input={(e) => updateSlider('formatting', e.target.value)}  />
        </div>

        {#if isProfessorSelected}
            <div>
                <label for="grade" class="block mb-2">Grade level: {getGradeString($sliderValues.grade)}</label>
                <input type="range" min="1" max="15" class="range range-success" step="1" 
                       value={$sliderValues.grade} id="grade-level" 
                       on:input={(e) => updateSlider('grade', e.target.value)}  />
            </div>
        {/if}
    </div>
</div>
