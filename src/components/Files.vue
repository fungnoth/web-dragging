<template>
    <Window class="absolute top-1/2 left-1/2  w-[40rem] h-[25rem]  border-2 rounded-3xl  bg-white/70 backdrop-blur-lg backdrop-brightness-110 border-white/50
            [&:focus_h1]:font-bold overflow-hidden
        " 
            el-class="w-full h-full  [&>.close-btn]:top-2"
            ref="windowInstance"
            tabindex="0" :position="position"
    >
        <Resizable :move="windowInstance?.move" :target="windowInstance?.el"></Resizable>
        <div class=" top-0 left-0 w-full h-12 bg-white/50 px-6 py-2 text-xl font-semibold shadow-lg shadow-black/5">
            Files
        </div>
        <aside class="p-6 px-2 h-full overflow-auto">
            
            <ListView class="z-0 flex flex-col" mode="list"
                @mousedown.stop="()=>bringToTop(windowInstance.el)" 
                @touchstart.stop="()=>bringToTop(windowInstance.el)"
                >
            </ListView>

        </aside>
    </Window>
</template>
<script setup>
    import Window from '@/components/Window.vue'
    import { bringToTop } from '@/DragLogic.js';
    import Resizable from '@/components/Resizable.vue'
    import ListView from '@/components/ListView.vue'
    import {ref} from 'vue';
    defineProps(["position"])
    const windowInstance = ref(null);
</script>