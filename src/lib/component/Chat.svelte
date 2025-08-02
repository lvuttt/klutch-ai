<script lang="ts">
    let messages = $state([
        { text: "Hello! Welcome to the klutch-ai assistant.", sender: "system" },
        { text: "You can ask any question related to your document?", sender: "system" },
    ]);
    let newMessage = $state('');
    let isLoading = $state(false)

    const sendMessage = async () => {
        isLoading = true
        messages = [...messages, { text: newMessage, sender: "user" }, { text: 'Thinking...', sender: 'system'}];
        const question = newMessage
        newMessage = ''
        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                body: JSON.stringify({
                    message: question
                }),
            });
            if (response.ok) {
                const resp = await response.json()
                messages.pop()
                messages = [...messages, { text: resp.answer, sender: "system" }];
            }
        } catch (e) {
            console.log(`message api call error ${e}`)
        } finally {
            isLoading = false
        }

    }

    function handleKeyPress(event) {
        if (!isLoading && event.key === "Enter") {
            sendMessage();
        }
    }
</script>

<div style="font-size: 30px;">Chat</div>
<div class="chat-window chat">
        <div class="messages-container">
            {#each messages as message}
                <div class="message {message.sender}">
                    <p>{message.text}</p>
                </div>
            {/each}
        </div>
</div>

<div class="input-area">
    <input
            disabled={isLoading}
            bind:value={newMessage}
            on:keypress={handleKeyPress}
            placeholder="Type your message..."
    />
    <button on:click={sendMessage} disabled={isLoading}>Send</button>
</div>

<style>
    :root {
        --bg-color: #f0f2f5;
        --chat-bg-color: #ffffff;
        --input-bg-color: #ffffff;
        --border-color: #e5e7eb;
        --user-bubble-color: #007bff;
        --user-text-color: #ffffff;
        --system-bubble-color: #e5e7eb;
        --system-text-color: #374151;
    }

    .chat {
        margin-top: 10px;
        border: 5px solid black;
        display: flex;
        flex-direction: column;
        height: 70vh;
        font-family: sans-serif;
        background-color: var(--bg-color);
    }

    .chat-window {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 20px;
        background-color: var(--chat-bg-color);
        border-bottom: 1px solid var(--border-color);
    }

    .messages-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .message {
        max-width: 70%;
        padding: 10px 15px;
        border-radius: 20px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .message.user {
        align-self: flex-end;
        background-color: var(--user-bubble-color);
        color: var(--user-text-color);
    }

    .message.system {
        align-self: flex-start;
        background-color: var(--system-bubble-color);
        color: var(--system-text-color);
    }

    .input-area {
        display: flex;
        padding: 10px;
        background-color: var(--input-bg-color);
        border-top: 1px solid var(--border-color);
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
    }

    input {
        flex: 1;
        padding: 10px;
        border: 1px solid var(--border-color);
        border-radius: 20px;
        margin-right: 10px;
        font-size: 16px;
        outline: none;
    }

    button {
        padding: 10px 20px;
        background-color: var(--user-bubble-color);
        color: var(--user-text-color);
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #0056b3;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none; /* Optional: prevents hover/click events */
    }
</style>