<script setup>
const colorMode = useColorMode();
</script>

<template>
  <main class="text-tip">
    <slot />
  </main>
</template>

<style lang="scss">
.text-tip {
  border-left: 1px solid #888888;
  background: rgba(246, 246, 246, 0.5803921569);
  padding: 7px;

  p,
  li {
    font-size: 13px;
    color: #888888;
    width: fit-content;
    margin-bottom: 0 !important;
  }

  p:first-child {
    color: #888888;
    margin-top: 0;
  }

  ol li {
    font-size: 13px;
    color: #888888;
  }

  ul:last-child {
    margin-bottom: 0;
  }
}

.dark-mode .text-tip {
  background: rgba(246, 246, 246, 0.0705882353);
}
</style>
