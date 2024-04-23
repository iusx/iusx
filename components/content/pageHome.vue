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
    <video src="/background.mp4" playsinline loop muted autoplay="true"></video>
    <div class="title">
      <div class="title-text">
        <a href="/dev">Full-stack</a> development,<br />
        <a href="">Security</a>, <a href="">Design</a><a href="">.</a>
        <br />
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
        <a href="">RSS</a>
      </div>
      <p>
        Creative Commons Attribution 4.0 International License (CC BY 4.0) and
        the MIT License
      </p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
video {
  position: absolute;
  z-index: -1;
  right: 0;
  height: 100vh;
}

main {
  width: 90%;
  margin: 0 auto;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  line-height: 3;
  transform: translateY(30vh);
  .title-text {
    color: #d6d6d6;
    font-size: 4em;
    font-weight: 300;
    line-height: initial;
    padding: 0;
    margin: 0;
    @media (max-height: 1000px) {
      font-size: 2em;
    }
    a {
      padding: 0;
      margin: 0;
      text-decoration: none;
      text-transform: none !important;
      color: #d6d6d6;
      transition: color 0.3s ease;
      &:hover {
        color: #1c0000;
        text-transform: none;
        text-decoration: none;
      }
    }
  }
  .link {
    padding: 0;
    margin: 0;
    text-transform: capitalize;
    color: #b7b7b7;
    line-height: 1.3;
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
  font-size: small;
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
