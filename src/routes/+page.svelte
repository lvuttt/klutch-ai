<script lang="ts">
    import Chat from "$lib/component/Chat.svelte";

    let {data} = $props();
    let pdfFile = $state(null);
    let isLoading = $state(false);
    let isUploaded = $state(false);

    function handleFileChange(event) {
        // Get the first file from the input event
        const file = event.target.files[0];

        // Check if the file is a PDF and store it in the state
        if (file && file.type === 'application/pdf') {
            pdfFile = file;
        } else {
            // If the file is not a PDF, reset the state and show an alert
            pdfFile = null;
            alert('Please select a PDF file.');
        }
    }

    async function handleSubmit() {
        isLoading = true
        // Check if a PDF file is selected
        if (!pdfFile) {
            alert('Please select a PDF file before submitting.');
            return;
        }

        // Create a new FormData object to send the file
        const formData = new FormData();
        formData.append('pdfDocument', pdfFile);

        try {
            // Replace '/api/upload' with your actual backend API endpoint
            const response = await fetch('/api/document', {
                method: 'POST',
                body: formData,
            });

            // Check if the request was successful
            if (response.ok) {
                await response.json();
                isUploaded = true
                alert('File uploaded successfully! You can start asking the questions about pdf');
            } else {
                alert('File upload failed. Server responded with status: ' + response.status);
            }
        } catch (error) {
            // Handle network errors or other issues
            console.error('Error during file upload:', error);
            alert('An error occurred during the upload process.');
        } finally {
            isLoading = false
        }
    }
</script>

{#if isUploaded}
    <Chat/>
{:else}
    {#if isLoading}
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
        <label for="pdf-upload">
            Upload PDF:
        </label>
        <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                on:change={handleFileChange}
        />

        <button type="submit" disabled={!pdfFile}>
            Submit
        </button>

        {#if pdfFile}
            <p>Selected file: {pdfFile.name}</p>
        {/if}
    </form>
{/if}

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    button {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
    }

    .spinner-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent white background */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3; /* Light grey */
        border-top: 5px solid #3498db; /* Blue */
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>