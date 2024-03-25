<template>
    <div ref="el" 
        @dragstart.prevent  
        @mousedown.prevent="dragStart" 
        @touchstart.prevent="dragStart "
        :style="{
            left: `${position?.[0]}px`,
            top: `${position?.[1]}px`
        }"
    >
        <div 
             :class="{ [elClass]:true, '[&_*]:select-none': Boolean(pauseSelection) }"
        >
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
    defineProps(["elClass"])
    import { ref, onMounted } from 'vue';
    import { pick, target as draggingTarget, pauseSelection } from '@/DragLogic.js';
    const el = ref(null);
    const position = ref([null, null])
    defineExpose({el, move})

    function move(x,y) {
        position.value[0] = x;
        position.value[1] = y;

    }
    function dragStart(e) {
        pick(e, el.value, {
            move
        })
    }
    
</script>