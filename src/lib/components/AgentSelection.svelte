<script>
    import { chatUsed, selectedAgentIndex } from '$lib/stores';
    import { textEditorContent } from '$lib/stores.js';
    import { onMount, onDestroy } from 'svelte';

    const agents = [
        { name: 'Research Assistant', description: 'A knowledgeable research assistant to help you explore scientific literature', emoji: '🔬' },
        { name: 'Policy Expert', description: 'An expert on translating science into actionable policy', emoji: '📊' },
        { name: 'Teacher', description: 'Your favorite teacher breaks down topics. Choose from kindergarten to graduate level', emoji: '🍎' },

    ];

    const samplePrompts = [
        "Tell me about climate change",
        "Explain photosynthesis",
        "Discuss renewable energy sources",
        "Analyze environmental policies"
    ];

    function insertPrompt(prompt) {
        textEditorContent.set(prompt);
    }

    $: selectedAgent = agents[$selectedAgentIndex];

    function handleAgentSelect(index) {
        selectedAgentIndex.set(index);
    }


</script>

<div class="agent-selection {$chatUsed ? 'chat-used' : ''}">
    <div class="emoji-circle">{selectedAgent.emoji}</div>
    <!-- <h2 class="dropdown">
        <label tabindex="0" class="btn m-1 btn-lg">{selectedAgent.name}</label>
        <ul class="dropdown-content menu p-4 shadow bg-base-100 rounded-box w-64">
            {#each agents as agent, index}
                <li>
                    <button class="agent-option" on:click={() => handleAgentSelect(index)}>
                        {agent.name}
                    </button>
                </li>
            {/each}
        </ul>
    </h2> -->
    <div class="hero-select">
        <div class="selected-option">
            <span id="selected-text">Research Assistant</span>
            <span class="dropdown-icon">&#x25BE;</span>
        </div>
        <div class="options">
            <div class="option">Policy Guy</div>
            <div class="option">Teacher</div>
        </div>
    </div>

    <p class="agent-description">{selectedAgent.description}</p>

    {#if !$chatUsed}
        <div class="sample-prompts">
            {#each samplePrompts as prompt}
                <button class="prompt-card" on:click={() => insertPrompt(prompt)}>
                    {prompt}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="postcss">
    .agent-selection {
        text-align: center;
        padding: 2rem 0;
        color: #ffffff;
        background-color: #1e1e1e;
        transition: all 0.3s ease;
    }

    .chat-used {
        padding: 1rem 0;
    }

    .emoji-circle {
        width: 6rem; /* Increased size */
        height: 6rem; /* Increased size */
        border-radius: 50%;
        background-color: #2c2c2c;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem; /* Increased emoji size */
        margin: 0 auto 1rem;
    }

    h2 {
        font-size: 2.5rem; /* Increased font size */
        margin-bottom: 0.5rem;
        font-weight: 600;
    }

    .dropdown-content {
        display: none; /* Hide by default */
    }

    .dropdown:hover .dropdown-content {
        display: block; /* Show on hover */
    }

    .agent-option {
        display: block;
        width: 100%;
        padding: 1rem; /* Increased padding */
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        color: #ffffff;
        transition: background-color 0.3s;
        font-size: 1.2rem; /* Increased font size */
    }

    .agent-option:hover {
        background-color: #4a4a4a;
    }

    .agent-description {
        margin-top: 1rem;
        font-size: 1rem; /* Increased font size */
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        color: #b0b0b0;
    }

    .sample-prompts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        padding: 0 1rem;
    }

    .prompt-card {
        background-color: #2c2c2c;
        border: 1px solid #3a3a3a;
        border-radius: 8px;
        padding: 1rem;
        text-align: left;
        color: #ffffff;
        transition: background-color 0.3s ease;
        cursor: pointer;
        font-size: 1.1rem; /* Increased font size */
    }

    .prompt-card:hover {
        background-color: #3a3a3a;
    }

    .hero-select {
    position: relative;
    text-align: center;
}

    .selected-option {
        font-size: 5vw; /* Responsive font size */
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        user-select: none;
    }

    .dropdown-icon {
        margin-left: 10px;
        transition: transform 0.3s;
        font-size: 0.8em;
    }

    .hero-select.active .dropdown-icon {
        transform: rotate(180deg);
    }

    .options {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 10px;
        display: none;
        flex-direction: column;
        align-items: center;
    }

    .hero-select.active .options {
        display: flex;
    }

    .option {
        font-size: 5vw; /* Responsive font size */
        cursor: pointer;
        margin: 10px 0;
        opacity: 0;
        animation: fadeIn 0.3s forwards;
    }

    .option:nth-child(1) { animation-delay: 0s; }
    .option:nth-child(2) { animation-delay: 0.1s; }


    @keyframes fadeIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
    }

    /* Remove text selection highlighting */
    .selected-option, .option {
        -webkit-tap-highlight-color: transparent;
    }

    /* Responsive Adjustments */
    @media (max-width: 600px) {
        .selected-option, .option {
            font-size: 8vw;
        }
    }
</style>


