<template>
  <main class="text-tip">
    <slot />
  </main>
</template>

<style lang="scss">
.text-tip {
  border-left: 1px solid #888888;
  background: rgba(246, 246, 246, 0.5803921569);
  padding: 0.7vw;
  p {
    font-size: 0.8vw;
    color: #888888;
    width: fit-content;
    margin-bottom: 0 !important;
  }
  p:first-child {
    font-size: 0.8vw;
    color: #888888;
    margin-top: 0;
  }
}
</style>
