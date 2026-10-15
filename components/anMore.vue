<script setup lang="ts">
import { computed, inject, ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { transitionSoundKey } from "~/composables/useTransitionSound";

const route = useRoute();
const router = useRouter();
const sound = inject(transitionSoundKey, undefined);
const menuElement = ref<HTMLElement | null>(null);
const soundButton = ref<HTMLButtonElement | null>(null);
const soundPanelOpen = ref(false);

function closeSoundPanel(restoreFocus = false) {
  soundPanelOpen.value = false;
  if (restoreFocus) soundButton.value?.focus();
}

onClickOutside(menuElement, () => closeSoundPanel());
watch(() => route.path, () => closeSoundPanel());
const props = withDefaults(defineProps<{ appearance?: "default" | "artwork" }>(), {
  appearance: "default",
});
const currentPath = computed(() => route.path.replace(/\/+$/, "") || "/");
const isHome = computed(() => currentPath.value === "/");
const navItems = [
  { path: "/", icon: "RhymeIcon", label: "HOME" },
  { path: "/des", icon: "DesIcon", label: "DESIGN" },
  { path: "/sec", icon: "SecIcon", label: "SECURITY" },
  { path: "/book", icon: "BookIcon", label: "LIBRARY" },
];

function isActive(path: string) {
  if (path === "/") return currentPath.value === "/" || currentPath.value === "/about";
  return currentPath.value === path || currentPath.value.startsWith(path + "/");
}

function goBack() {
  const previous = router.options.history.state.back;
  const hasRouteHistory = typeof previous === "string" && previous.startsWith("/") && !previous.startsWith("//");
  let hasSameSiteReferrer = false;
  // The homepage also uses ordinary links, which create a fresh router history.
  if (document.referrer && window.history.length > 1) {
    try {
      hasSameSiteReferrer = new URL(document.referrer).origin === window.location.origin;
    } catch {
      hasSameSiteReferrer = false;
    }
  }
  if (hasRouteHistory || hasSameSiteReferrer) {
    router.back();
  } else if (currentPath.value !== "/") {
    router.replace("/");
  }
}
</script>

<template>
  <aside ref="menuElement" class="site-menu" :class="{ 'is-artwork': props.appearance === 'artwork' }"
    @keydown.esc.stop.prevent="closeSoundPanel(true)">
    <nav class="menu-tabs" aria-label="Site navigation">
      <button v-if="!isHome" class="menu-back" type="button" aria-label="Go back" title="Back" @click="goBack">
        <svg class="back-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
      </button>
      <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
        class="menu-tab" :class="{ 'is-current': isActive(item.path), 'is-brand': isHome && item.path === '/' }"
        :aria-label="item.label" :aria-current="isActive(item.path) ? 'page' : undefined">
        <span class="menu-icon" aria-hidden="true"><Icon :name="item.icon" :size="isHome && item.path === '/' ? '28px' : '24px'" /></span>
        <span class="menu-label" aria-hidden="true">{{ item.label }}</span>
      </NuxtLink>
      <button v-if="sound" ref="soundButton" class="menu-sound" type="button" aria-label="声音设置"
        :class="{ 'is-enabled': sound.enabled.value }" :aria-expanded="soundPanelOpen" aria-controls="site-sound-panel"
        title="声音设置" @click="soundPanelOpen = !soundPanelOpen">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4Z" />
          <path v-if="sound.enabled.value" d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
          <path v-else d="m16 9 6 6m0-6-6 6" />
        </svg>
      </button>
    </nav>
    <section v-if="sound && soundPanelOpen" id="site-sound-panel" class="sound-panel" aria-label="切换音效设置">
      <div class="sound-panel-heading"><span>切换音效</span><span class="sound-panel-caption">TERMINAL</span></div>
      <button class="sound-setting" type="button" aria-label="自动播放切换音效" :aria-pressed="sound.enabled.value" @click="sound.toggle">
        <span>自动播放</span><span class="sound-setting-value">{{ sound.enabled.value ? 'ON' : 'OFF' }}</span>
      </button>
      <button class="sound-preview" type="button" @click="sound.preview"><span aria-hidden="true">▷</span> 试听音效</button>
    </section>
  </aside>
</template>

<style scoped lang="scss">
.site-menu {
  --menu-surface: #fff;
  --menu-ink: #111512;
  --menu-muted: #68746c;
  --menu-line: #d9ded9;
  --menu-accent: #007f73;

  .dark-mode & {
    --menu-surface: #000;
    --menu-ink: #eef1ed;
    --menu-muted: #8d9990;
    --menu-line: #252c27;
    --menu-accent: #38e7cd;
  }

  &.is-artwork {
    --menu-surface: var(--gallery-bg, #050606);
    --menu-ink: var(--gallery-ink, #fff);
    --menu-muted: var(--gallery-muted, #bfc1c1);
    --menu-line: var(--gallery-line, #373838);
    --menu-accent: var(--gallery-accent, #38e7cd);
  }

  position: fixed;
  top: 50%;
  right: 0;
  z-index: 200;
  width: var(--site-menu-width, 48px);
  box-sizing: border-box;
  padding: 8px 0;
  transform: translateY(-50%);
  background: var(--menu-surface);
  color: var(--menu-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  &::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 1px; background: var(--menu-line); pointer-events: none; }
}

.menu-tabs {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-tab, .menu-back, .menu-sound {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 44px;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  &:focus-visible { outline: 1px solid var(--menu-accent); outline-offset: -4px; }
}

.menu-back {
  margin-bottom: 8px;
  .back-arrow { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.3; transition: transform 0.2s ease; }
  &::after { content: ""; position: absolute; bottom: -4px; left: 50%; width: 12px; height: 1px; background: var(--menu-line); transform: translateX(-50%); }
}

.menu-sound {
  flex-shrink: 0;
  margin-top: auto;
  svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.3; stroke-linecap: square; stroke-linejoin: miter; }
  &.is-enabled { color: var(--menu-accent); }
}

.sound-panel {
  position: absolute;
  right: calc(100% + 8px);
  bottom: 8px;
  width: min(216px, calc(100vw - 80px));
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--menu-line);
  background: var(--menu-surface);
  color: var(--menu-muted);
  font-size: 11px;
  line-height: 1.5;

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 40px;
    padding: 0 8px;
    border: 1px solid var(--menu-line);
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;

    &:hover { color: var(--menu-accent); }
    &:focus-visible { outline: 1px solid var(--menu-accent); outline-offset: -4px; }
  }
}
.sound-panel-heading { display: flex; justify-content: space-between; gap: 8px; padding-bottom: 12px; }
.sound-panel-caption { font-size: 9px; letter-spacing: 0.08em; opacity: 0.7; }
.sound-setting { justify-content: space-between; }
.sound-setting[aria-pressed="true"] .sound-setting-value { color: var(--menu-accent); }
.sound-preview { margin-top: 8px; }

.menu-tab {
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 2px;
    height: 12px;
    background: var(--menu-accent);
    opacity: 0;
    transform: translateY(-50%);
    transition: opacity 0.2s ease;
  }
  &.is-current, &.is-brand { color: var(--menu-accent); }
  &.is-current::after { opacity: 1; }
}

.menu-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  // Keep the original SVG shapes, with ink inherited from the menu state.
  :deep(path[fill="#38E7CD"]) { fill: currentColor; }
  :deep(path[stroke="#38E7CD"]) { stroke: currentColor; }
  :deep(path[stroke="black"]) { stroke: var(--menu-surface); }
}

.menu-label {
  font-size: 10px;
  line-height: 1.1;
  letter-spacing: 0.1em;
  white-space: nowrap;
  pointer-events: none;
}

@media (hover: hover) and (pointer: fine) {
  .menu-tab:hover, .menu-back:hover, .menu-sound:hover { color: var(--menu-accent); }
  .menu-back:hover .back-arrow { transform: translateX(-2px); }
}
@media (min-width: 701px) {
  .site-menu {
    inset: 0 0 0 auto;
    height: 100%;
    padding: max(8px, env(safe-area-inset-top)) 0 max(8px, env(safe-area-inset-bottom));
    transform: none;
  }
  .menu-tabs { height: 100%; gap: 0; overflow-y: auto; scrollbar-width: none; }
  .menu-tab {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    flex: 1;
    height: auto;
    min-height: 112px;
    padding: 8px 0;
  }
  .menu-label { writing-mode: vertical-rl; text-orientation: mixed; }
}

@media (max-width: 700px) {
  .site-menu {
    inset: auto 0 0;
    width: auto;
    height: var(--site-menu-height, 48px);
    padding: 0 max(8px, env(safe-area-inset-right)) env(safe-area-inset-bottom) max(8px, env(safe-area-inset-left));
    transform: none;
    &::before { inset: 0 0 auto; width: auto; height: 1px; }
  }
  .menu-tabs { height: 100%; flex-direction: row; align-items: center; gap: 0; }
  .menu-tab { flex: 1; min-width: 44px; width: auto; }
  .menu-tab::after { top: auto; bottom: 0; left: 50%; width: 12px; height: 2px; transform: translateX(-50%); }
  .menu-back { width: 44px; margin: 0 8px 0 0; }
  .menu-back::after { inset: 50% -4px auto auto; width: 1px; height: 12px; transform: translateY(-50%); }
  .menu-sound { width: 44px; margin: 0 0 0 4px; }
  .sound-panel { right: 8px; bottom: calc(100% + 8px); width: 216px; }
  .menu-label { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .menu-tab, .menu-tab::after, .menu-label, .menu-back, .menu-sound, .back-arrow { transition: none; }
  .back-arrow { transform: none !important; }
}
@media print { .site-menu { display: none; } }
</style>
