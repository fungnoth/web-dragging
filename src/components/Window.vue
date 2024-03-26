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
            :class="{ [elClass]:true, '[&_*]:select-none': Boolean(pauseSelection) }" data-pos-wrap
        >
            <button class="close-btn | text-3xl absolute top-4 right-6 w-8 h-8 rounded-lg" @click="$emit('close')" >
                <div class="absolute w-5 h-1 bg-slate-800 rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                <div class="absolute w-5 h-1 bg-slate-800 rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
            </button>
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
    const props =defineProps(["elClass", "position"])
    defineEmits(["close"])
    import { ref, onMounted } from 'vue';
    import { pick, target as draggingTarget, pauseSelection } from '@/DragLogic.js';
    const el = ref(null);
    const position = ref(
        props.position || [null, null]
    )
    defineExpose({el, move})

    function move(x,y) {
        position.value[0] = x;
        position.value[1] = y;

    }
    function dragStart(e) {
        el.value.focus();
        pick(e, el.value, {
            move
        })
    }
    
</script>