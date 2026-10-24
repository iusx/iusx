import { onBeforeUnmount, onMounted, provide } from "vue";
import type { InjectionKey } from "vue";
import { createTransitionSoundPlayer } from "~/utils/transition-sound";

interface TransitionSound {
  play: () => void;
  stop: () => void;
}

export const transitionSoundKey: InjectionKey<TransitionSound> = Symbol("transition-sound");

export function provideTransitionSound() {
  const player = createTransitionSoundPlayer();
  let enabled = false;
  let mounted = false;

  function stop() {
    player.stop();
  }

  function prime(event: Event) {
    if (!event.isTrusted || document.hidden) return;
    if (event instanceof KeyboardEvent && event.key !== "Enter" && event.key !== " ") return;
    // Any real page interaction grants sound; unlock before a link starts navigation.
    enabled = true;
    void player.unlock();
  }

  function play() {
    stop();
    if (mounted && enabled && typeof document !== "undefined" && !document.hidden) player.play();
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
  }

  onMounted(() => {
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
    play,
    stop,
  };
  provide(transitionSoundKey, sound);
  return sound;
}
