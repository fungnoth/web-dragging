<template>
    <Draggable class="absolute top-1/2 left-1/2  w-[40rem] h-[25rem]" 
            el-class="p-6 border-2 rounded-3xl w-full h-full bg-white/50 backdrop-blur-lg backdrop-brightness-110 border-white/50 overflow-auto"
    >
        <h2 class="text-xl">Lorem ipsum dolor sit amet</h2>
        <h1 class="text-4xl mt-1 mb-2  ">Consectetur</h1>
        <aside @mousedown.stop class="">
            <p class="text-lg">
                adipiscing elit. Nullam dignissim risus id vehicula accumsan. In hac habitasse platea dictumst. Pellentesque id diam enim. Integer pretium consequat neque. Curabitur magna eros, convallis quis leo ut, malesuada molestie leo. In in dapibus urna, quis hendrerit lorem. Duis dolor ligula, dignissim eget pellentesque sit amet, dapibus nec urna. Nulla facilisi. Integer ipsum eros, gravida nec laoreet vitae, varius sed lacus.
            </p>


        </aside>
    </Draggable>
</template>
<script setup>
    import Draggable from '@/components/Draggable.vue'
</script>