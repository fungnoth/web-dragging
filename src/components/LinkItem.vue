<template>
    <button class="icon-wrap p-2 items-center flex gap-1 select-none
        focus:bg-white/30 focus:outline-white duration-150 transition-[border,margin]"
        ref="el"
    >
        <template v-if="props.icon">
            <img :src="props.icon" alt="icon" class="flex-shrink-0 h-3/5  aspect-square object-contain">
        </template>
        <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 h-3/5 aspect-square object-contain" viewBox="0 0 96 96" :fill="props.color ?? '#FFF'">
                <path d="M60.9579,8h-42.688C17.5685,8,17,8.5685,17,9.2698v77.4603C17,87.4315,17.5685,88,18.2698,88h59.6825 c0.7013,0,1.2698-0.5685,1.2698-1.2698V26.2643c0-0.7858-0.3122-1.5395-0.8678-2.0951L63.053,8.8678 C62.4974,8.3122,61.7437,8,60.9579,8z"/>
                <path fill="#979593" d="M79.1211,24.707L61.293,6.8789C60.7266,6.312,59.9736,6,59.1719,6H19c-1.6543,0-3,1.3457-3,3v78 c0,1.6543,1.3457,3,3,3h58c1.6543,0,3-1.3457,3-3V26.8281C80,26.0273,79.6875,25.2739,79.1211,24.707z M60,8.4141L77.5857,26H61 c-0.5518,0-1-0.4482-1-1V8.4141z M77,88H19c-0.5518,0-1-0.4482-1-1V9c0-0.5518,0.4482-1,1-1h39v17c0,1.6543,1.3457,3,3,3h17v59 C78,87.5518,77.5518,88,77,88z"/>
            </svg>
        </template>
        <div :class="props.labelClass" class="text-center leading-tight mt-1" v-text="props.fileName || ''">
        </div>
        <slot></slot>
    </button>
</template>

<script setup>
const props = defineProps({
    "fileName": {
        type: String
    },
    "labelClass": {
        required: false,
    },
    "icon": {
        type: String
    },
    "launch": {
        type: Object
    }
})
import { ref } from 'vue';
const el = ref(null);

defineExpose({
    el
})

</script>