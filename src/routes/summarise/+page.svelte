<script lang="ts">
    let textTranscript = new String("Enter transcript here");

    function someFunction() {
        // Modify later to process summary, alerts now to ensure text value correctly extracted
        alert(textTranscript);
    }
</script>

<div class="sticky flex flex-row justify-center top-0 p-5">
    <h1 class="text-5xl text-center font-sans rounded-lg p-8 px-28 bg-slate-200">Summentia</h1>
</div>

<div class="sticky flex flex-row justify-center top-1 p-5">
    <textarea id="transcript" rows="7" cols="50" bind:value={textTranscript} />
</div>

<div class="sticky flex flex-row justify-center top-9 p-5">
    <button on:click={someFunction} style="color: white;">Summarise</button>
</div>