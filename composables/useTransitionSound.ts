import { onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import type { InjectionKey, Ref } from "vue";
import { createTransitionSoundPlayer } from "~/utils/transition-sound";

interface TransitionSound {
  enabled: Ref<boolean>;
  toggle: () => void;
  preview: () => Promise<void>;
  play: () => void;
  stop: () => void;
}

export const transitionSoundKey: InjectionKey<TransitionSound> = Symbol("transition-sound");

export function provideTransitionSound() {
  const enabled = ref(false);
  const player = createTransitionSoundPlayer();
  const storageKey = "ritsu:transition-sound";
  let mounted = false;
  let playbackGeneration = 0;

  function stop() {
    playbackGeneration++;
    player.stop();
  }

  function prime(event: Event) {
    if (!event.isTrusted || !enabled.value || document.hidden) return;
    if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
    void player.unlock();
  }

  function toggle() {
    enabled.value = !enabled.value;
    if (enabled.value) void player.unlock();
  }

  async function preview() {
    stop();
    const generation = playbackGeneration;
    if (!mounted || typeof document === "undefined" || document.hidden) return;
    try {
      // unlock calls resume synchronously within this click, then waits for it.
      const ready = await player.unlock();
      if (ready && mounted && generation === playbackGeneration && !document.hidden) player.play();
    } catch { /* A denied preview must not affect the sound preference. */ }
  }

  function play() {
    stop();
    if (mounted && enabled.value && typeof document !== "undefined" && !document.hidden) player.play();
  }

  watch(enabled, value => {
    if (!value) stop();
    if (!mounted) return;
    try { localStorage.setItem(storageKey, value ? "on" : "off"); } catch { /* Storage may be unavailable. */ }
  }, { flush: "sync" });

  function onVisibilityChange() {
    if (document.hidden) stop();
  }

  onMounted(() => {
    try { enabled.value = localStorage.getItem(storageKey) === "on"; } catch { /* Keep the default. */ }
    mounted = true;
    void player.preload();
    document.addEventListener("pointerdown", prime, { capture: true, passive: true });
    document.addEventListener("click", prime, { capture: true, passive: true });
    document.addEventListener("keydown", prime, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
  });

  onBeforeUnmount(() => {
    stop();
    mounted = false;
    document.removeEventListener("pointerdown", prime, true);
    document.removeEventListener("click", prime, true);
    document.removeEventListener("keydown", prime, true);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    player.dispose();
  });

  const sound: TransitionSound = {
    enabled,
    toggle,
    preview,
    play,
    stop,
  };
  provide(transitionSoundKey, sound);
  return sound;
}
