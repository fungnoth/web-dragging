<template>
  <main class="bg-black relative h-screen w-screen overflow-hidden">
    <Transition enter-from-class="opacity-0 scale-95">
      <BackgroundImage :image="bgImage"></BackgroundImage>
    </Transition>
    
    <div class="absolute top-0 left-0 w-full h-full">
      <ListView class="z-0 flex flex-wrap"
        mode="list"
      >
    </ListView>   
    </div>
    <div>
      <template v-for="item in items">
        <component :is="item"></component>
      </template>
      <Window class="absolute top-1/4 left-1/4  w-[32rem] h-[32rem] border-2  border-white/50 bg-white/70 overflow-hidden rounded-3xl " 
              el-class="w-full h-full  backdrop-blur-lg backdrop-brightness-110 "
              ref="imageWindow"
      >
        <Resizable :target="imageWindow?.el" :move="imageWindow?.move"></Resizable>
        <BackgroundImage :image="baseUrl + 'img.jpg'"></BackgroundImage>
      </Window>
      <MyStatus></MyStatus>
      
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
  import MyStatus from '@/components/MyStatus.vue'
  import Window from '@/components/Window.vue'
  import Resizable from '@/components/Resizable.vue'
  import ListView from '@/components/ListView.vue'
  import { pointerDown, pointerPosition as globalPointerPosition } from './CursorLogic'

  const _pointerPosition = ref([0,0]);
  const pointerPosition = computed(() => {
    if (pointerDown.value) {
      _pointerPosition.value = globalPointerPosition.value
    }
    return _pointerPosition.value;
  }) 
  const bgImage = ref(null);
  const imageWindow = ref(null);
  const baseUrl = import.meta.env.BASE_URL;
  const items = ref ([]);
  import('@/assets/wallpaper.jpg').then(function(resp) {
    bgImage.value = resp.default;
  })
  
</script>