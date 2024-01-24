<script lang='ts'>
  import { AccordionItem, Accordion } from 'flowbite-svelte';
  import LectureUpload from './LectureUpload.svelte';

  let lectureFile: File[] = [];
  let doLectureUpload = false;
  let lectureURL: string;
 
</script>

<div class="flex-1">
<Accordion>
  <AccordionItem>
    <span slot="header">Upload Lecture</span>
    <LectureUpload bind:lectureFile bind:doLectureUpload bind:lectureURL />
  </AccordionItem>
  <AccordionItem>
    <span slot="header">Upload Slides</span>
    
  </AccordionItem>

  <AccordionItem>
    <span slot="header">Supplementary Info</span>
    
  </AccordionItem>
  <AccordionItem>
    <span slot="header">Customisation</span>
    
  </AccordionItem>
</Accordion>
</div>