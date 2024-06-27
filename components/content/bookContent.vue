<script setup>
import { defineProps, onMounted } from "vue";
const colorMode = useColorMode();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const titleParts = computed(() => {
  const separatorIndex = props.title.indexOf(":");
  if (separatorIndex !== -1) {
    return {
      firstPart: props.title.substring(0, separatorIndex + 1).trim(),
      secondPart: props.title.substring(separatorIndex + 2).trim(),
    };
  }
  return {
    firstPart: props.title,
    secondPart: "",
  };
});
</script>
<template>
  <main class="layout">
    <div class="book-info">
      <img src="/img/book/01/1.png" alt="book-home" />
      <div class="book-info-author">
        <p>By James Forshaw</p>
        <span>be reading 10%</span>
      </div>
      <div class="title">
        <p>{{ titleParts.firstPart }}</p>
        <span>{{ titleParts.secondPart }}</span>
      </div>
      <div class="dir-layout">
        <p class="title">directory</p>
        <TableOfContents />
      </div>
    </div>
    <div class="main-con">
      <div class="text markdown-content"><slot></slot></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.book-info {
  img {
    width: 100%;
  }
  .book-info-author {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7f7f7f;
    font-size: 0.9vw;
    span {
      text-transform: uppercase;
    }
  }
  .title {
    p {
      font-size: 1.4vw;
      margin: 0;
      margin-bottom: 5px;
    }
    span {
      font-size: 0.9vw;
      color: rgba(0, 0, 0, 0.593);
    }
  }
  .dir-layout {
    .title {
      text-transform: uppercase;
      padding: 0.5vw;
      border: 1px solid #000000;
      color: #000000;
      display: block;
      width: fit-content;
      margin-top: 1.5vw;
      font-size: 0.5vw;
      margin-bottom: 1.2vw;
    }
  }
}
.main-con {
  margin-left: 4vw;
  width: 100%;
}
.layout {
  display: flex;
  padding-left: 10%;
  padding-right: 10%;
  @media (max-width: 425px) {
    padding-left: 3%;
    padding-right: 3%;
  }
}
</style>
