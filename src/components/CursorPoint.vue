<template>
    <div class="absolute pointer-events-none rounded-full w-4 h-4 top-0 left-0 backdrop-invert duration-150  transition-opacity"
      :class="{ 'opacity-0': !pointerDown }"
      :style="{transform: `translate( calc(-50% + ${getCursorPosition()?.[0]}px),  calc(-50% + ${getCursorPosition()?.[1]}px) `,
          zIndex: 9999,
      }"
    >
      <div class="absolute w-full h-full bg-white/70 box-content rounded-full border-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { getCursorPosition, pointerDown } from '@/CursorLogic'

</script>