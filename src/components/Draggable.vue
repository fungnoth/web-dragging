<template>
    <div ref="dragEl" 
        @dragstart.prevent  @mousedown="(e)=>pick(e, dragEl, dragOffset)" 
    >
        <Resizable :target="dragEl "></Resizable>
        <div 
             :class="{ [elClass]:true, '[&_*]:select-none': Boolean(draggingTarget) }"
        >
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
    defineProps(["elClass"])
    import { ref, onMounted } from 'vue';
    import { pick, target as draggingTarget } from '@/DragLogic.js';
    import Resizable from '@/components/Resizable.vue'
    const dragEl = ref(null)
    
</script>