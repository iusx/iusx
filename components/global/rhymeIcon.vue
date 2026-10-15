<script setup lang="ts">
import { BRAND_MARK_PATHS } from "~/utils/brand-mark";
</script>

<template>
  <svg width="377" height="377" viewBox="0 0 377 377" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path v-for="(path, index) in BRAND_MARK_PATHS" :key="index" :d="path" fill="#38E7CD" />
  </svg>
</template>
