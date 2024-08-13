<script>
    import { onMount } from 'svelte';
    let messages = [];
    let input = '';
    let isLoading = false;
    let currentMessage = ''; // Store the current streaming message
  
    const sendMessage = async () => {
      if (input.trim() === '') return;
  
      // Add user's message to the chat
      messages = [...messages, { role: 'user', content: input }];
      isLoading = true;
      currentMessage = ''; // Reset the current streaming message
  
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
  
      let data = '';
      let messageIndex = messages.length; // Track the index of the assistant message
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        data += decoder.decode(value, { stream: true });
  
        // Split the stream data into individual JSON objects
        const lines = data.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const json = JSON.parse(line.substring(5));
  
            // Extract the content from the delta
            const content = json.choices[0]?.delta?.content;
            if (content) {
              currentMessage += content;
  
              // Update the messages array to include the streaming content
              if (messages[messageIndex]?.role === 'assistant') {
                messages[messageIndex].content = currentMessage; // Update the existing message
              } else {
                messages = [...messages, { role: 'assistant', content: currentMessage }];
                messageIndex = messages.length - 1; // Update messageIndex to the new assistant message
              }
            }
          }
        }
      }
  
      input = '';
      isLoading = false;
    };
  </script>
  <!-- <input type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" /> -->

  <div class="chat-container">
    <div class="messages">
      {#each messages as { role, content }}
        <div class={role === 'user' ? 'message user' : 'message assistant'}>
          {content}
        </div>
      {/each}
    </div>
    <div class="input-container">
      
      <input class="input input-bordered w-full max-w-full" type="text" bind:value={input} placeholder="Ask me anything..." on:keydown={(e) => e.key === 'Enter' && sendMessage()} />
      <button class="btn btn-primary" on:click={sendMessage} disabled={isLoading}>Send</button>
    </div>
  </div>
  
  <style>
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .messages {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    .message {
      margin-bottom: 1rem;
    }
    .message.user {
      text-align: right;
    }
    .message.assistant {
      text-align: left;
    }
    .input-container {
      display: flex;
      padding: 1rem;
      /* border-top: 1px solid #ccc; */
    }
    input {
      flex-grow: 1;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      margin-left: 1rem;
      padding: 0.5rem 1rem;
    }
  </style>
  