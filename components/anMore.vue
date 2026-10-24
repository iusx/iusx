<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
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
  <aside class="site-menu" :class="{ 'is-artwork': props.appearance === 'artwork' }">
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
    </nav>
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

.menu-tab, .menu-back {
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
  .menu-tab:hover, .menu-back:hover { color: var(--menu-accent); }
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
  .menu-label { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .menu-tab, .menu-tab::after, .menu-label, .menu-back, .back-arrow { transition: none; }
  .back-arrow { transform: none !important; }
}
@media print { .site-menu { display: none; } }
</style>
