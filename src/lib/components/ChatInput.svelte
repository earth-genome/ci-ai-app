<script>
    import { input, isLoading, chatUsed, chatHistory, selectedAgentIndex, sliderValues } from '$lib/stores';
    import { get } from 'svelte/store';

    let inputValue = '';

    $: inputValue = $input;

    function updateInput(value) {
        input.set(value);
    }

    async function sendMessage() {
        console.log('message sent');
        chatHistory.update(history => [...history, { role: 'user', content: inputValue }]);
        const assistantMessageIndex = $chatHistory.length;
        chatHistory.update(history => [...history, { role: 'assistant', content: 'Loading...' }]);
        chatUsed.set(true);
        isLoading.set(true);

        try {
            const response = await fetch('../api/multiagent-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: inputValue,
                    agentIndex: get(selectedAgentIndex),
                    currentSliderValues: get(sliderValues)
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            chatHistory.update(history => {
                history[assistantMessageIndex] = { 
                    role: 'assistant', 
                    content: data.message,
                    citations: data.citations
                };
                return history;
            });

        } catch (error) {
            console.error('Error:', error);
            chatHistory.update(history => {
                history[assistantMessageIndex] = {
                    role: 'assistant',
                    content: 'Sorry, an error occurred.'
                };
                return history;
            });
        } finally {
            isLoading.set(false);
        }
    }

    function handleSendMessage() {
        if (!$isLoading && inputValue.trim()) {
            sendMessage();
            updateInput('');
            inputValue = '';
        }
    }
</script>

<div class="chat-input">
    <div class="input-wrapper">
        <input
            type="text"
            placeholder="Message..."
            class="input-box"
            bind:value={inputValue}
            on:input={(e) => updateInput(e.target.value)}
            on:keydown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button class="send-button" on:click={handleSendMessage} disabled={$isLoading || !inputValue.trim()}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon-2xl"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                    fill="currentColor"
                />
            </svg>
        </button>
    </div>
</div>

<style>
    .chat-input {
        display: flex;
        align-items: center;
    }

    .input-wrapper {
        position: relative;
        width: 100%;
    }

    .input-box {
        width: 100%;
        padding: 0.75rem;
        padding-right: 3rem;
        border: 1px solid oklch(var(--s));
        border-radius: 40px;
        box-sizing: border-box;
        background-color: #F1E9D2;
        color: #2C665D;
    }

    .send-button {
        position: absolute;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        background-color: #2C665D;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    }

    .send-button:hover {
        background-color: #1e4d45;
    }

    .send-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
</style>
