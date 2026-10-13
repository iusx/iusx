<template>
  <figure class="game-info-layout">
    <div v-if="loading" class="game-loading" role="status">图片加载中…</div>

    <template v-else>
      <div class="img">
        <img :src="props.img" alt="" />
        <div class="title">
          <img :src="logoImage" :style="{ width: `${props.size}px` }" alt="" />
        </div>
      </div>
    </template>
    <figcaption class="desc-layout">
      <div class="stars" role="img" :aria-label="`喜爱程度：${love || 0}/5`">
        <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= love }">
          {{ n <= love ? '★' : '☆' }} </span>
      </div>
      <div class="desc">
        <slot></slot>
      </div>
    </figcaption>
  </figure>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

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
.game-info-layout {
  width: 100%;
  min-width: 0;
  margin: 1.75rem 0;
  border: 1px solid var(--article-border, #d4d4d4);
  border-radius: 0;
  background: var(--article-surface, transparent);
  color: var(--article-text, #4a4a4a);
  font-family: var(--article-font, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 0.875rem;
  line-height: 1.7;
  text-transform: none;
}

.game-loading {
  min-height: 8rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  color: var(--article-muted, #737373);
  &::before { content: '›'; margin-right: 0.625rem; color: var(--article-accent, #007f73); }
}

.img {
  display: grid;
  align-items: end;
  justify-items: start;
  overflow: hidden;

  &::before {
    content: '';
    grid-area: 1 / 1;
    align-self: stretch;
    width: 100%;
    background: linear-gradient(90deg, #0009, transparent 75%);
    z-index: 2;
    pointer-events: none;
  }

  > img { grid-area: 1 / 1; display: block; width: 100%; max-width: 100%; height: auto; border-radius: 0; }
  .title { grid-area: 1 / 1; z-index: 2; max-width: 100%; padding: 1rem; }
  .title img { display: block; max-width: 100%; height: auto; border-radius: 0; }
}

.dark-mode .img > img { opacity: 0.7; }

.desc-layout {
  min-width: 0;
  padding: 0.8rem 1rem;
  border-top: 1px solid var(--article-soft-border, #e8e8e8);
}

.stars {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  color: var(--article-faint, #999);
  font-size: 0.875rem;
  .filled { color: var(--article-accent, #007f73); }
}

.desc {
  overflow-wrap: anywhere;
  :deep(p) { margin: 0; color: inherit; font-size: inherit; line-height: inherit; }
  :deep(a) { color: var(--article-accent, #007f73); text-underline-offset: 0.2em; }
}

@media (max-width: 640px) {
  .game-info-layout { margin-block: 1.5rem; }
  .desc-layout, .img .title { padding: 0.75rem; }
}
</style>
