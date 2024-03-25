<template>
  <main class="bg-black relative h-screen w-screen overflow-hidden">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
    <Transition enter-from-class="opacity-0 scale-95">
      <BackgroundImage :image="bgImage"></BackgroundImage>
    </Transition>
    
    <ListView class="absolute top-0 left-0 z-0 flex"
      mode="list"
    >
    </ListView>
    <div>
      <template v-for="item in items">
        <component :is="item"></component>
      </template>
      <Window class="absolute top-1/4 left-1/4  w-[32rem] h-[32rem] border-2  border-white/50 bg-white/70 overflow-hidden rounded-3xl " 
              el-class="w-full h-full  backdrop-blur-lg backdrop-brightness-110 "
              ref="imageWindow"
      >
        <Resizable :target="imageWindow?.el" :move="imageWindow?.move"></Resizable>
        <BackgroundImage :image="'/img.jpg'"></BackgroundImage>
      </Window>
      <MyStatus></MyStatus>
      
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
  const bgImage = ref(null);
  const imageWindow = ref(null);

  const items = ref ([]);

  import('@/assets/wallpaper.jpg').then(function(resp) {
    bgImage.value = resp.default;
  })
  
</script>