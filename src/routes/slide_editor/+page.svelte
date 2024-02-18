<script lang="ts">
    import { Badge, ListPlaceholder, TextPlaceholder, Hr, Button, ImagePlaceholder, Textarea  } from 'flowbite-svelte';
    import { ArrowRightOutline,  ArrowLeftOutline, ArrowDownToBracketOutline, PlusSolid} from 'flowbite-svelte-icons';

    // bound to text area and slide image.
    // Will to be set to relevant slide PNG and summary
    let currentSlideSummary = 'This is the second lecture for the Introduction to Machine Learning course';
    let currentSlideImage = "placeholder_slide.PNG";

    

</script>

    <h1 class="text-5xl p-10 font-bold">Slide Editor</h1>

    <div class="flex flex-col p-0 justify-center items-center">
        <div class="flex flex-col space-y-5">

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">

                <h2 class="text-xl px-2 font-semibold text-center">Slide 1/7</h2>
                <Hr /> 

                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img width="450px" src={currentSlideImage} alt="Placeholder Slide Image" />
                <Hr /> 

            </div>

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
                <h2 class="text-xl px-2 font-semibold">Summary</h2>
                <Textarea bind:value={currentSlideSummary} id="textarea-id" rows="5" name="summary" />
            </div>
            
        </div>
    </div>
    
<div class="fixed bottom-10 left-40 p-40">
    <Button color="dark" pill={true} class="fixed bottom-60 left-80 p-5"><ArrowLeftOutline class="w-4 h-4" /></Button>
Previous Slide
</div>

<div class="fixed bottom-0 left-0 p-5">
    <Button color="blue" size="sm">
        Back
    </Button>
</div>

<div class="fixed bottom-10 right-40 p-40">
    <Button color="dark" pill={true} class="fixed bottom-60 right-80 p-5"><ArrowRightOutline class="w-4 h-4" /></Button>
Previous Slide
</div>

<div class="fixed bottom-0 right-0 p-5">
    <Button color="blue" size="sm" background-color="transparent">
        Complete Summary
    </Button>
</div>