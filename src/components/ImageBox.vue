<template>
    <Window class="absolute top-1/4 left-1/4  w-[32rem] h-[32rem] border-2  border-white/50 bg-white/70 overflow-hidden rounded-3xl " 
        el-class="w-full h-full  backdrop-blur-lg backdrop-brightness-110 "
        ref="imageWindow"
    >
        <Resizable :target="imageWindow?.el" :move="imageWindow?.move"></Resizable>
        <BackgroundImage :image="baseUrl + 'img.jpg'"></BackgroundImage>
    </Window>
</template>
<script setup>
import { ref } from 'vue';
import BackgroundImage from '@/components/BackgroundImage.vue'
import Window from '@/components/Window.vue'
import Resizable from '@/components/Resizable.vue'

defineProps(["position"])
const imageWindow = ref(null);
const baseUrl = import.meta.env.BASE_URL;

</script>