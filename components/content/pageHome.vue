<script setup lang="ts">
import { ref } from "vue";

interface LinkItem {
  name: string;
  href: string;
  separator?: string;
}

const links = ref<LinkItem[]>([
  { name: "Github", href: "https://github.com/iepn", separator: "+" },
  { name: "Hackerone", href: "https://hackerone.com/iepn", separator: "+" },
  { name: "Behance", href: "https://www.behance.net/1ui", separator: "÷" },
  {
    name: "Researchgate",
    href: "https://www.researchgate.net/profile/Rhyme-Qing",
  },
]);
</script>

<template>
  <main>
    <div class="title">
      <div class="title-text">
        <a href="/dev">Originality is <br />key to infusing a work with soul.</a>
      </div>
      <div class="link">
        <span v-for="item in links" :key="item.href">
          <a :href="item.href" target="_blank">{{ item.name }}</a>
          {{ item.separator }}
        </span>
      </div>
    </div>
    <div class="copyright">
      <div class="copy-link">
        <a href="/about">about</a>
        <a href="">Link</a>
        <a href="/rss.xml">RSS</a>
      </div>
      <p>
        Creative Commons Attribution 4.0 International License (CC BY 4.0) and
        the MIT License
      </p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap");
@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
main {
  width: 90%;
  margin: 0 auto;
  display: flex;
  height: 100vh;
  flex-direction: column;
  font-family: "Source Code Pro", monospace;
  justify-content: space-between;
}
.title {
  line-height: 3;
  transform: translateY(30vh);
  .title-text {
    display: block;
    cursor: pointer;
    color: #d6d6d6;
    font-size: 3vh;
    font-weight: 300;
    line-height: initial;
    padding: 0;
    margin: 0;
    a {
      padding: 0;
      margin: 0;
      text-decoration: none;
      color: #1c0000;
      text-transform: capitalize;
      display: flex;
      letter-spacing: -2px;
      transition: color 0.3s ease;
      &:hover {
        color: #b7b7b7;
        text-decoration: none;
      }
    }
    a::before {
      content: "";
      display: block;
      height: 1vh;
      width: 1vh;
      background: blue;
      border-radius: 120px;
      animation: fade 2s linear infinite;
      margin-top: 1.4vh;
      margin-right: 2vh;
    }
  }
  .link {
    padding: 0;
    margin: 0;
    text-transform: capitalize;
    color: #b7b7b7;
    margin-top: 1vh;
    line-height: 1.3;
    font-size: 1.7vh;
    margin-left: 2.5vh;
    a {
      text-decoration: none;
      color: #b7b7b7;
      padding-left: 3px;
      padding-right: 3px;
      transition: color 0.3s ease;
      &:hover {
        color: #1c0000;
        text-transform: none;
        text-decoration: none;
      }
    }
  }
}
.copyright {
  color: #a1a1a1;
  font-size: 1vh;
  line-height: 1;
  .copy-link {
    a {
      text-decoration: none;
      text-transform: capitalize !important;
      color: #b7b7b7;
      padding-right: 10px;
      transition: color 0.3s ease;
      &:hover {
        color: #1c0000;
        text-transform: none;
        text-decoration: none;
      }
    }
  }
}
</style>
