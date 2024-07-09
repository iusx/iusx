<script setup>
const colorMode = useColorMode();
</script>

<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.5 18L9.5 12L15.5 6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style lang="scss" scoped>
svg {
  stroke: #000;
}
.dark-mode svg {
  stroke: #424242;
}
</style>
