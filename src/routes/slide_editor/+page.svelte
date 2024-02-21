<script lang="ts">
    import { goto } from '$app/navigation';
    import {Button, Textarea  } from 'flowbite-svelte';
    import { FileCheckSolid } from 'flowbite-svelte-icons';

    let slides = ["placeholder_slide_1.PNG", "placeholder_slide_2.PNG", "placeholder_slide_3.PNG",
                  "placeholder_slide_4.PNG", "placeholder_slide_5.PNG","placeholder_slide_6.PNG"];

    let summaries = [`This is the second lecture for the Introduction to Machine Learning course`,
                     `This is the course plan for the Introduction to Machine Learning course`,
                     `Here are some of the classification algorithms we will learn about`,
                     `Lazy learner models, like k-nearest neighbors (kNN), don't build a model during training; they store the data and compute predictions based on similarity at prediction time. They're intuitive, handle data changes well, but are computationally expensive and memory-intensive.
                      Eager learner models, exemplified by decision trees, build a model during training and generalize data patterns. They're faster at prediction, less memory-intensive, but require more computational resources during training and may overfit if not properly regularized.`,
                     `Today we will be learning about classification with instance based learning versus classification with decision trees`,
                     `Today's lecture will be delivered in 6 short videos`
                    ];

                    
     /*               
    export let data;

    let displaySlides = data.hasSlides;
    let pages: string[];

    if (displaySlides) {
        // TODO: Convert slideData into PrismaSlidesData object and determine pages
        let slideData = data;
        slides = slideData.map(data => data.slide);
        summaries = slideData.map(data => data.summary);

        if (slides == null || summaries == null){
            slides = [];
            summaries = [];
        }

    }
*/
    

    // both buttons temporarily go back to projects page for now

    // should go to per project page
    function goBack() {
        goto('/projects');
    }

    // should go to download page?
    function complete() {
        goto('/projects');
    }
</script>

<h1 class="text-5xl p-10 font-bold">Edit</h1>

<div class="flex flex-wrap justify-center">
    {#each slides as slide, index}
        <div class="flex flex-row space-x-2 m-4">

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-1 p-10">

                <h2 class="text-xl px-2 font-semibold text-center">Slide {index + 1}/{slides.length}</h2>

                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img width="450px" src={slide} alt="Slide {index + 1}" />

            </div>

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
                <h2 class="text-xl px-2 font-semibold">Summary {index + 1}/{slides.length}</h2>
                <Textarea readonly rows="7" cols="50" value={summaries[index]} />
            </div>
            
        </div>
    {/each}
</div>

<div class="fixed bottom-0 left-0 p-5">
    <Button color="red" size="xl" on:click={goBack}>
        Back
    </Button>
    
    <Button color="green" size="xl" on:click={complete}>
        Save
        <FileCheckSolid/>
    </Button>
</div>
