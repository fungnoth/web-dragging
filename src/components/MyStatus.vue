<template>
    <Window class="absolute top-1/2 left-1/2  w-[40rem] h-[25rem] p-6 border-2 rounded-3xl  bg-white/70 backdrop-blur-lg backdrop-brightness-110 border-white/50" 
            el-class="w-full h-full overflow-auto"
            ref="windowInstance"
    >
        <Resizable :move="windowInstance?.move" :target="windowInstance?.el"></Resizable>
        <h2 class="text-xl">Lorem ipsum dolor sit amet</h2>
        <h1 class="text-4xl mt-1 mb-2  ">Consectetur</h1>
        <aside @mousedown.stop="()=>bringToTop(windowInstance.el)" 
            @touchstart.stop="()=>bringToTop(windowInstance.el)" class="">
            <p class="text-lg">
                adipiscing elit. Nullam dignissim risus id vehicula accumsan. In hac habitasse platea dictumst. Pellentesque id diam enim. Integer pretium consequat neque. Curabitur magna eros, convallis quis leo ut, malesuada molestie leo. In in dapibus urna, quis hendrerit lorem. Duis dolor ligula, dignissim eget pellentesque sit amet, dapibus nec urna. Nulla facilisi. Integer ipsum eros, gravida nec laoreet vitae, varius sed lacus.
            </p>


        </aside>
    </Window>
</template>
<script setup>
    import Window from '@/components/Window.vue'
    import { bringToTop } from '@/DragLogic.js';
    import Resizable from '@/components/Resizable.vue'
    import {ref} from 'vue';
    const windowInstance = ref(null);
</script>