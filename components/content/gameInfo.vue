<template>
  <main class="game-info-layout">
    <div v-if="loading">
      <an-skeleton :loading="loading" ref="skeletonRef">
        <template #template>
          <an-skeleton-item variant="image" style="width: 100%; height: 300px" />
          <div>
            <an-skeleton-item variant="h3" style="width: 50%" />
          </div>
        </template>
      </an-skeleton>
    </div>

    <template v-else>
      <div class="img">
        <img :src="props.img" alt="" />
        <div class="title">
          <img :src="logoImage" :style="{ width: `${props.size}px` }" />
        </div>
      </div>
    </template>
    <div class="desc-layout">
      <div class="stars">
        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= love }">
          {{ n <= love ? '★' : '☆' }} </span>
      </div>
      <span class="desc">
        <slot></slot>
      </span>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
const colorMode = useColorMode();

const props = defineProps({
  img: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  love: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  }
});

const loading = ref(true);

onMounted(() => {
  const img = new Image();
  img.src = props.img;

  img.onload = () => {
    loading.value = false;
  };

  img.onerror = () => {
    console.error(`Failed to load image ${props.img}`);
  };
});


const logoImage = computed(() => {
  const segments = props.img.split('/');
  const filename = segments[segments.length - 1];
  return `/img/game/logo/${filename}`;
});
</script>


<style lang="scss" scoped>
.game-info-layout:hover {
  .img {
    transform: scale(1.05); // 放大 5%
  }
}

main {
  box-shadow: -9px 7px 16px 0px rgb(115 115 115 / 25%);
  border-left: none;
  margin-bottom: 90px;

  img {
    width: 100%;
  }

  .img {
    display: grid;
    align-items: end;
    justify-items: start;
    transition: transform 0.3s ease; // 平滑动画
    cursor: pointer; // 鼠标变成手型

    &::before {
      content: '';
      background: linear-gradient(89deg, #000 -6.11%, rgba(54, 54, 54, 0.47) 49.63%, rgba(102, 102, 102, 0) 70%);
      height: 100%;
      width: 100%;
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      z-index: 2;
    }

    img {
      width: 100%;
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      z-index: 1;
    }

    .title {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      z-index: 2;
      padding: 12px;
    }
  }

  .desc-layout {
    padding: 12px;
    background: #f8f8f8;
    color: #888888;

    .star {
      margin-right: 4px;
      transition: transform 0.2s ease;
      text-shadow: 0px 4px 4px #38E7CD;
    }

    .star.filled {
      color: #00E989;
    }

    .star:not(.filled) {
      color: #00E989;
    }

    flex-direction: column;
    font-size: 11px;
  }
}

.dark-mode main .desc-layout {
  background: #121212;
}

.dark-mode main {
  box-shadow: -9px 7px 16px 0px rgb(12 12 13);
}
</style>
