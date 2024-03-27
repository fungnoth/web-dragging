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

    <CursorPoint></CursorPoint>

  </main>
  
</template>

<script setup>
  import { computed, ref } from 'vue'
  import BackgroundImage from '@/components/BackgroundImage.vue'
  import ListView from '@/components/ListView.vue'
  import CursorPoint from '@/components/CursorPoint.vue'
  import {items} from '@/Tasks.js'

  const bgImage = ref(null);
  import('@/assets/wallpaper.jpg').then(function(resp) {
    bgImage.value = resp.default;
  })
  
</script>