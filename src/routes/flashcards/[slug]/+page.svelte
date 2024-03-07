<script lang="ts">
	import type { Flashcard } from '$lib/server/types/Flashcard.js';


    export let data;

    const flashCards:{
        front: string,
        back: string
    }[] = data.flashCards;

</script>

<div>
<h1> Flash Cards  </h1>
{#each flashCards as card}
   <h3>front: {card.front}</h3>
   <h3>back: {card.back}</h3>
{/each}
</div>