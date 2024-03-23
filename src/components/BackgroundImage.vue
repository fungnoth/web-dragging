

<template>
    <img :src="image" v-if="image" @dragStart.prevent alt="background image"
        class="h-full w-full object-cover select-none
            pointer-events-none duration-700 delay-200 ease-out 
        "
        
    />
</template>

<script setup>
    const props = defineProps(['image'])
</script>
