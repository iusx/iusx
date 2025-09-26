<script setup lang="ts">
const props = defineProps({
  path: String,
  title: String,
  description: String,
  cover: String,
  author: Object,
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col items-center justify-center text-white"
    style="background: linear-gradient(232deg, #38e7cd 0%, black 100%)"
  >
    <div class="px-5 py-3 rounded absolute top-10 right-10">
      <img src="/logo.png" class="" />
    </div>

    <div class="justify-center items-start flex flex-col text-left">
      <img
        v-if="cover"
        :src="cover"
        width="432"
        height="243"
        :style="{ borderRadius: '8px', overflow: 'hidden' }"
      />
      <h1
        :style="{
          fontSize: '65px',
          lineHeight: '85px',
          margin: '20px 0 0 0',
          padding: '0',
        }"
      >
        {{ title }}
      </h1>
      <p
        :style="{ fontSize: '29px', lineHeight: '45px' }"
      >
        {{ description }}
      </p>
      <div v-if="author" class="flex items-center">
        <img
          :src="author.avatarUrl"
          width="80"
          height="80"
          class="rounded-full mr-5"
        />
        <div class="flex flex-col text-gray-300">
          <div class="text-3xl" :style="{ whiteSpace: 'pre' }">
            {{ author.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
