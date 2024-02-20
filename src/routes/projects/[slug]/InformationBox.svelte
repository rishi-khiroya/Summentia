<script lang="ts">
    export let title: string;
    export let maxWidth: string = "full";
    export let maxHeight: string;
    export let additionalAttributes: string = "";

    export let boxClass = `m-5 p-5 bg-white outline-1 outline-transparent shadow-md shadow-black rounded-xl max-w-${maxWidth} max-h-${maxHeight} overflow-auto ${additionalAttributes}`;
</script>

<div class={boxClass}>
    <h2 class="text-xl font-semibold">{title}</h2>
    <slot></slot>
</div>