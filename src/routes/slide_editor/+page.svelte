<script lang="ts">
    import { Badge, ListPlaceholder, TextPlaceholder, Hr, Button, ImagePlaceholder, Textarea  } from 'flowbite-svelte';
    import { ArrowRightOutline,  ArrowDownToBracketOutline, PlusSolid} from 'flowbite-svelte-icons';

    let summaryText = 'This is the second lecture for the Introduction to Machine Learning course';
</script>

    <h1 class="text-5xl p-10 font-bold">Slide Editor</h1>

    <div class="flex flex-col p-0 justify-center items-center">
        <div class="flex flex-col space-y-5">

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">

                <h2 class="text-xl px-2 font-semibold text-center">Slide 1/7</h2>
                <Hr /> 
                <img width="450px" src="placeholder_slide.PNG" alt="Placeholder Slide Image" />
                <Hr /> 

            </div>

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
                <h2 class="text-xl px-2 font-semibold">Summary</h2>
                <Textarea bind:value={summaryText} id="textarea-id" rows="5" name="summary" />
            </div>
            
        </div>
    </div>
    
<div class="fixed bottom-60 left-80 p-5">
    <Button color="blue" size="sm">
        &lt Last Slide
    </Button>
</div>

<div class="fixed bottom-0 left-0 p-5">
    <Button color="blue" size="sm">
        Back
    </Button>
</div>

<div class="fixed bottom-60 right-80 p-5">
    <Button color="blue" size="sm">
        Next Slide >
    </Button>
</div>

<div class="fixed bottom-0 right-0 p-5">
    <Button color="blue" size="sm">
        Complete Summary
    </Button>
</div>