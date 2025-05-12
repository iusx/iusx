<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

defineProps(["title", "info", "time", "client", "img", "types"]);
</script>
<template>
  <main class="layout page-content">
    <div class="content">
      <page-image :img="img" :info="info" :type="types" />
      <page-title class="title" :title="title" :time="time" :client="client" />
    </div>
    <div class="text-layout">
      <div class="text">
        <slot></slot>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.dark-mode .text {
  color: #5c5c5c !important;
}

.text-layout {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  padding-bottom: 3rem;

  .text {
    width: 65%;
    text-transform: capitalize;
    color: #888888;
    text-align: justify;

    @media (max-width: 768px) {
      width: 100%;
      font-size: 13px;
    }
  }
}

.layout {
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 3%;

  @media (max-width: 425px) {
    padding-left: 3%;
    padding-right: 3%;
  }
}

content {
  margin-bottom: 6rem;
  transition: filter 0.3s ease;
  filter: grayscale(0);

  &:hover {
    filter: grayscale(1);
  }

  a {
    text-decoration: none;
  }
}

.title {
  margin-top: 2.4rem;

  @media (max-width: 425px) {
    margin-top: 1.2rem;
  }
}
</style>
