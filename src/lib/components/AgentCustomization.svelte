<script>
    import { sliderValues, selectedAgentIndex } from '$lib/stores.js';
    import { get } from 'svelte/store'

    function updateSlider(key, value) {
        sliderValues.update(currentValues => {
            return { ...currentValues, [key]: key === 'temperature' ? parseFloat(value) : parseInt(value, 10) };
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
    <div class="space-y-4">
        <div>
            <div class="flex items-center">
                <label for="temperature" class="badge badge-custom mr-2">Creativity: {$sliderValues.temperature.toFixed(1)}</label>
                <div class="tooltip tooltip-right" data-tip="Creativity, aka 'temperature,' controls response randomness. Lower values make results more focused and predictable, while higher values increase creativity and diversity but reduce coherence.">
                    <span class="badge badge-info cursor-help">?</span>
                </div>
            </div>
            <input type="range" min="0" max="2" class="range range-temperature range-xs" step="0.1" 
                   value={$sliderValues.temperature} id="temperature" 
                   on:input={(e) => updateSlider('temperature', e.target.value)} />
        </div>

        <div>
            <div class="flex items-center">
                <label for="length" class="badge badge-custom mr-2">Response length: {$sliderValues.length}</label>
                <div class="tooltip tooltip-right" data-tip="Lorem ipsum">
                    <span class="badge badge-info cursor-help">?</span>
                </div>
            </div>
            <input type="range" min="1" max="4" class="range range-secondary range-xs" step="1" 
                   value={$sliderValues.length} id="length" 
                   on:input={(e) => updateSlider('length', e.target.value)}  />
        </div>

        <div>
            <div class="flex items-center">
                <label for="formatting" class="badge badge-custom mr-2">Level of formatting: {$sliderValues.formatting}</label>
                <div class="tooltip tooltip-right" data-tip="Lorem ipsum">
                    <span class="badge badge-info cursor-help">?</span>
                </div>
            </div>
            <input type="range" min="1" max="4" class="range range-accent range-xs" step="1" 
                   value={$sliderValues.formatting} id="formatting" 
                   on:input={(e) => updateSlider('formatting', e.target.value)}  />
        </div>

        {#if isProfessorSelected}
            <div>
                <div class="flex items-center">
                    <label for="grade" class="badge badge-custom mr-2">Grade level: {getGradeString($sliderValues.grade)}</label>
                    <div class="tooltip tooltip-right" data-tip="Lorem ipsum">
                        <span class="badge badge-info cursor-help">?</span>
                    </div>
                </div>
                <input type="range" min="1" max="15" class="range range-success range-xs" step="1" 
                       value={$sliderValues.grade} id="grade-level" 
                       on:input={(e) => updateSlider('grade', e.target.value)}  />
            </div>
        {/if}
    </div>
</div>

<style lang="postcss">
    :global(.tooltip::before) {
        background-color: #DBEEFB;
        color: theme('colors.primary');
    }

    .badge-custom {
        background-color: #F5DB98;
        color: black
    }

    .range-temperature {
        --range-shdw: #79A37C
    }
</style>
