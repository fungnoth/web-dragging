<template>
  <main class="bg-black relative h-screen w-screen overflow-hidden">
    <Transition enter-from-class="opacity-0 scale-95">
      <BackgroundImage :image="bgImage"></BackgroundImage>
    </Transition>
    
    <div class="absolute top-0 z-0 left-0 w-full h-full">
      <ListView class="z-0 flex flex-wrap ">
      </ListView>   
    </div>
    <div class="">
      <TransitionGroup  appear 
          enter-from-class="opacity-0 scale-75" 
          enter-active-class="duration-150 ease-out origin-top-left"
          leave-to-class="opacity-0 scale-75"
          leave-active-class="duration-150 ease-in origin-top"
      >
          <component v-for="(item, pid) in items" :is="item.component" 
            :key="pid" @close="delete items[pid]"
            :position="item.position"
          ></component>
      </TransitionGroup >
      
    </div>

    
    <div class="absolute pointer-events-none rounded-full w-4 h-4 top-0 left-0 backdrop-invert duration-150  transition-opacity"
      :class="{ 'opacity-0': !pointerDown }"
      :style="{transform: `translate( calc(-50% + ${pointerPosition?.[0]}px),  calc(-50% + ${pointerPosition?.[1]}px) `,
          zIndex: 9999,
      }"
    >
      <div class="absolute w-full h-full bg-white/70 box-content rounded-full border-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
    </div>

  </main>
  
</template>

<script setup>
  import { computed, ref } from 'vue'
  import BackgroundImage from '@/components/BackgroundImage.vue'
  import ListView from '@/components/ListView.vue'
  import {items} from '@/Tasks.js'
  import { pointerDown, pointerPosition as globalPointerPosition } from './CursorLogic'

  const _pointerPosition = ref([0,0]);
  const pointerPosition = computed(() => {
    if (pointerDown.value) {
      _pointerPosition.value = globalPointerPosition.value
    }
    return _pointerPosition.value;
  }) 
  const bgImage = ref(null);
  import('@/assets/wallpaper.jpg').then(function(resp) {
    bgImage.value = resp.default;
  })
  
</script>