<template>
  <main class="bg-black h-full">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
    <Transition enter-from-class="opacity-0 scale-95">
      <BackgroundImage :image="bgImage"></BackgroundImage>
    </Transition>
    <Draggable class="absolute top-1/4 left-1/4  w-[32rem] h-[32rem] border-2  border-white/50 bg-white/50 overflow-hidden rounded-3xl " 
            el-class="w-full h-full  backdrop-blur-lg backdrop-brightness-110 "
    >
      <BackgroundImage :image="'/img.jpg'"></BackgroundImage>
    </Draggable>
    <MyStatus class=""></MyStatus>

  </main>
  
</template>

<script setup>
  import { ref } from 'vue'
  import BackgroundImage from '@/components/BackgroundImage.vue'
  import MyStatus from '@/components/MyStatus.vue'
  import Draggable from '@/components/Draggable.vue'
  const bgImage = ref(null);

  import('@/assets/wallpaper.png').then(function(resp) {
    bgImage.value = resp.default;
  })
  
</script>