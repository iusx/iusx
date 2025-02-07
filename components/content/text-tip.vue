<script setup>
const colorMode = useColorMode();

import { defineProps } from "vue";

defineProps(["type"]);
</script>

<template>
  <main class="text-tip big" v-if="type == 'big'">
    <slot />
  </main>
  <main class="text-tip" v-else>
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

.big {
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding: 13px;
  font-style: oblique;

  p {
    font-size: 15px;
  }
}
</style>
