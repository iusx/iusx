<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const route = useRoute();
const router = useRouter();

const isHovered = ref(false);
const navRef = ref<HTMLElement | null>(null);

onClickOutside(navRef, () => {
  isHovered.value = false;
});

const toggleNav = () => {
  isHovered.value = !isHovered.value;
};

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/' || route.path === '/about';
  }
  return route.path.startsWith(path);
};

const navItems = [
  { path: '/', icon: 'RhymeIcon', label: 'HOME' },
  { path: '/des', icon: 'DesIcon', label: 'DESIGN' },
  { path: '/sec', icon: 'SecIcon', label: 'SECURITY' },
  { path: '/book', icon: 'BookIcon', label: 'LIBRARY' },
];

const handleNavigate = (path: string) => {
  router.push(path);

  isHovered.value = false;
};
</script>

<template>
  <aside
    ref="navRef"
    class="hud-sidebar"
    :class="{ 'is-expanded': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="toggleNav"
  >
    <div class="drag-handle">
      <span class="dots">::</span>
    </div>

    <nav class="nav-links">
      <a
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click.stop="handleNavigate(item.path)"
      >
        <div class="icon-box">
          <Icon :name="item.icon" size="24px" />
        </div>

        <span class="label-text">{{ item.label }}</span>

        <div v-if="isActive(item.path)" class="active-indicator"></div>
      </a>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>

$primary-color: #38e7cd;
$bg-color: rgba(10, 10, 10, 0.9); 
$panel-width: 60px;

.hud-sidebar {
  position: fixed;
  right: 0;
  top: 50%;

  transform: translateY(-50%) translateX(100%); 
  z-index: 999;

  display: flex;
  flex-direction: row;
  align-items: center;

  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);

  &.is-expanded {
    transform: translateY(-50%) translateX(0);
  }

  .drag-handle {
    width: 24px;
    height: 100px; 
    background: $bg-color;

    border-radius: 0; 
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-right: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);

    position: absolute;
    left: -24px; 

    .dots {
      writing-mode: vertical-rl;
      color: $primary-color;
      font-weight: 900;
      font-size: 12px;
      letter-spacing: 2px;
      opacity: 0.8;
    }
  }

  .nav-links {
    background: $bg-color;
    backdrop-filter: blur(10px);
    border-left: 2px solid $primary-color;
    border-top: 1px solid rgba(255,255,255,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding: 15px 10px;
    box-shadow: -5px 0 30px rgba($primary-color, 0.15);

    border-radius: 0;

    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: $panel-width;
  }

  .nav-item {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #888;
    padding: 8px;

    border-radius: 2px; 
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    .icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 30px;
      transition: transform 0.3s ease;
    }

    .label-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      margin-left: 15px;
      opacity: 0;
      white-space: nowrap;
      transform: translateX(10px);
      transition: all 0.3s ease;
      color: #fff;
    }

    .active-indicator {
      position: absolute;
      left: 0; top: 50%; transform: translateY(-50%);
      width: 3px; height: 60%; background-color: $primary-color;
      box-shadow: 0 0 8px $primary-color; 
      border-radius: 0; 
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      .icon-box { transform: scale(1.1); color: $primary-color; }
    }

    &.active {
      color: $primary-color;
      background: rgba($primary-color, 0.05);
      .icon-box { filter: drop-shadow(0 0 5px rgba($primary-color, 0.5)); }
    }
  }

  &.is-expanded {
    .nav-links { padding-right: 20px; }
    .nav-item .label-text { opacity: 1; transform: translateX(0); }
  }
}

@media (max-width: 768px) {
  .hud-sidebar {
    top: auto;
    bottom: 100px; 

    .drag-handle {

      display: flex; 
      height: 60px; 
    }

    .nav-links {

    }

    &.is-expanded {

    }
  }
}
</style>
