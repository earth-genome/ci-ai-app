<script>
    import { textEditorContent } from '$lib/stores';
</script>

<div class="text-editor-container">
    <textarea bind:value={$textEditorContent} class="text-editor"></textarea>
</div>

<style lang="postcss">
    .text-editor-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 80vh; 
        padding: 10px;
        /* background-color: #292d3e; */
        border-radius: 15px;
    }

    .text-editor {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        padding: 10px;
        border-radius: 10px;
        border: 1px solid #ccc;
        font-size: 16px;
        background-color: #ffffff;
    }
</style>