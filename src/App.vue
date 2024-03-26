<template>
  <main class="bg-black relative h-screen w-screen overflow-hidden">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
    <Transition enter-from-class="opacity-0 scale-95">
      <BackgroundImage :image="bgImage"></BackgroundImage>
    </Transition>
    
    <div class="absolute top-0 left-0 w-full h-full">
      <ListView class="relative z-0 flex flex-wrap"
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

    
    <div class="absolute pointer-events-none rounded-full w-5 h-5 -translate-x-1/2 -translate-y-1/2 backdrop-invert transition-opacity"
      :class="{
        'opacity-0': !pointerDown,
        'opacity-50': pointerDown,
      }"
      :style="{
          left: `${pointerPosition?.[0]}px`, 
          top:  `${pointerPosition?.[1]}px`,
          zIndex: 9999,
      }"
    >
    </div>

  </main>
  
</template>

<script setup>
  import { ref } from 'vue'
  import BackgroundImage from '@/components/BackgroundImage.vue'
  import MyStatus from '@/components/MyStatus.vue'
  import Window from '@/components/Window.vue'
  import Resizable from '@/components/Resizable.vue'
  import ListView from '@/components/ListView.vue'
  import { pointerDown, pointerPosition } from './CursorLogic'
  const bgImage = ref(null);
  const imageWindow = ref(null);
  const baseUrl = import.meta.env.BASE_URL;
  const items = ref ([]);
  import('@/assets/wallpaper.jpg').then(function(resp) {
    bgImage.value = resp.default;
  })
  
</script>