<script lang="ts">
    import {Hr, Button, Textarea  } from 'flowbite-svelte';

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
</script>

<h1 class="text-5xl p-10 font-bold">Slide Editor</h1>

<div class="flex flex-row flex-wrap p-0 justify-center items-start">
    {#each slides as slide, index}
        <div class="flex flex-col space-y-5 m-5">

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-10">

                <h2 class="text-xl px-2 font-semibold text-center">Slide {index + 1}/{slides.length}</h2>
                <Hr /> 

                <!-- svelte-ignore a11y-img-redundant-alt -->
                <img width="450px" src={slide} alt="Slide {index + 1}" />
                <Hr /> 

            </div>

            <div class="flex flex-col bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl space-y-2 p-5">
                <h2 class="text-xl px-2 font-semibold">Summary {index + 1}/{slides.length}</h2>
                <Textarea readonly rows="5" cols="50" value={summaries[index]} />
            </div>
            
        </div>
    {/each}
</div>

<div class="fixed bottom-0 left-0 p-5">
    <Button color="blue" size="sm">
        Back
    </Button>
</div>

<div class="fixed bottom-0 right-0 p-5">
    <Button color="blue" size="sm" background-color="transparent">
        Complete Summary
    </Button>
</div>
