<script setup>
import { defineProps } from "vue";

defineProps(["title", "info", "time", "client", "img", "types"]);
</script>
<template>
  <main class="layout">
    <a class="home" href="/">HOME</a>
    <div class="content">
      <page-image :img="img" :info="info" :type="types" />
      <page-title class="title" :title="title" :time="time" :client="client" />
    </div>
    <div class="text-layout">
      <div class="text"><slot></slot></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.text-layout {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  padding-bottom: 3rem;
  .text {
    width: 65%;
    text-transform: capitalize;
    color: #c0c0c0;
    text-align: justify;
    @media (max-width: 768px) {
      width: 100%;
      font-size: 1vh;
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
.home {
  margin-bottom: 1rem;
  display: block;
  font-weight: bold;
  text-decoration: none;
  color: #d6d6d6;
  transition: color 0.3s ease;
  &:hover {
    color: #1c0000;
    text-transform: none;
    text-decoration: none;
  }
}
</style>
