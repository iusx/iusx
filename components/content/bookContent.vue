<script setup>
import { defineProps, onMounted, ref } from "vue";
const colorMode = useColorMode();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  by: {
    type: String,
  },
  plan: {
    type: String,
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

const isWorkPopVisible = ref(false);

const showWorkPop = () => {
  isWorkPopVisible.value = true;
};

const hideWorkPop = () => {
  isWorkPopVisible.value = false;
};

const loading = ref(true);

onMounted(() => {
  const img = new Image();
  img.src = "/img/book/" + props.img;
  img.onload = () => {
    loading.value = false;
  };
  img.onerror = () => {
    console.error(`Failed to load image ${img.src}`);
  };
});

const percentage = computed(() => {
  const [current, total] = props.plan.split(",").map(Number);

  if (isNaN(current) || isNaN(total) || total === 0) {
    return props.plan;
  }

  const percent = ((current / total) * 100).toFixed(0);

  return percent;
});
</script>

<template>
  <div class="progress"></div>
  <main class="layout">
    <div class="book-info pc">
      <div class="book-info-home-img">
        <div class="no-img" v-if="loading"></div>
        <img v-else :src="'/img/book/' + props.img" alt="book-home" />
        <div class="book-info-author">
          <p>By {{ by }}</p>
          <span>be reading {{ percentage }}%</span>
        </div>
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
    <div class="an" @click="showWorkPop">
      <div class="more">MORE</div>
    </div>
    <div class="book-info book-table" v-if="isWorkPopVisible">
      <p style="cursor: pointer" class="pop-close" @click="hideWorkPop">
        CLOSE
      </p>
      <div class="book-info-home-img">
        <div class="no-img" v-if="loading" style="width: 50% !important"></div>
        <img v-else :src="'/img/book/' + props.img" alt="book-home" />
        <div class="book-info-author">
          <p>By {{ by }}</p>
          <span>be reading {{ percentage }}%</span>
        </div>
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
      <div class="text markdown-content">
        <slot></slot>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.book-table {
  background: white !important;
  width: 85vw !important;
}

.dark-mode .book-table {
  background: #000 !important;
}

@keyframes loading {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.no-img {
  background-color: #f2f2f2;
  animation: loading 1.5s infinite;
  aspect-ratio: 54 / 71;
}

.dark-mode .no-img {
  background-color: rgb(29, 29, 29);
}

.pc {
  @media (max-width: 1024px) {
    display: none;
  }
}

.pop-close {
  font-family: "tsing";
  position: absolute;
  color: #000;
  font-weight: bold;
  right: 10px;
}

.dark-mode .pop-close {
  color: #ffffff;
}

.more {
  color: #999999;
  font-family: "tsing";
  cursor: pointer;
  transform: rotate(90deg);
}

.dark-mode .an {
  background: #ffffff1f;
}

.an {
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    background: #f0f0f0;
    padding: 8px;
    font-size: 1.3vh;
    z-index: 9999;
    font-weight: bold;
    left: 0;
    width: 10px;
    height: 60px;
    cursor: pointer;
  }
}

.book-info {
  width: 21vw;
  position: fixed;
  height: 100vh;
  overflow: auto;
  padding-right: 1vw;
  z-index: 99999999;

  img {
    width: 100%;

    @media (max-width: 1024px) {
      width: 50%;
    }
  }

  position: fixed;

  .book-info-author {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #7f7f7f;
    font-size: 15px;

    span {
      text-transform: uppercase;
    }
  }

  .title {
    p {
      font-size: 23px;
      margin: 0;
      margin-bottom: 5px;
    }

    span {
      font-size: 1.9vh;
      color: rgba(0, 0, 0, 0.593);
    }
  }

  .dir-layout {
    .title {
      text-transform: uppercase;
      padding: 8px;
      border: 1px solid #000000;
      color: #000000;
      display: block;
      width: fit-content;
      margin-top: 15px;
      font-size: 11px;
      margin-bottom: 12px;
    }
  }
}

.dark-mode .book-info .title span {
  color: rgb(255 255 255 / 59%);
}

.dark-mode .book-info .title p {
  color: #b3b3b3;
}

.dark-mode .book-info img {
  opacity: 0.7;
}

.dark-mode .book-info .dir-layout .title {
  border: 1px solid #ffffff;
  color: #ffffff;
}

.dark-mode .dir-layout {
  opacity: 0.8;
}

.book-info::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  cursor: pointer !important;
}

.book-info::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer !important;
}

.book-info::-webkit-scrollbar-thumb {
  border: 1px solid rgba(0, 0, 0, 0.197);
  cursor: pointer !important;
  transition: background 0.5s ease;

  &:hover {
    cursor: pointer !important;
    background: rgba(0, 0, 0, 0.068);
  }
}

.dark-mode .book-info::-webkit-scrollbar-thumb {
  border: 1px solid rgba(255, 255, 255, 0.238);

  &:hover {
    background-color: rgba(255, 255, 255, 0.068);
  }
}

@-moz-document url-prefix() {
  .book-info {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.197) transparent;

    .dark-mode & {
      scrollbar-color: rgba(255, 255, 255, 0.238) transparent;
    }
  }
}

.main-con {
  margin-left: 25vw;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
}

main {
  overflow-x: hidden;
  overflow: visible;
  width: 85%;
  margin: 0 auto;
}

.layout {
  display: flex;
}

table {
  width: 100%;
}
.progress {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0px;
  height: 4px;
  background: #38e7cd;
  transform-origin: 0 50%;
  z-index: 10000000000000000000;
  box-shadow: -1px 0px 0px 0px #38e7cd;
  display: none;
  animation: grow auto linear;
  animation-timeline: scroll();
}
@supports (animation-timeline: scroll()) {
  .progress {
    display: block;
    animation: grow auto linear;
    animation-timeline: scroll();
  }
}

@keyframes grow {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
