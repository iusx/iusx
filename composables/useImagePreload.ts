import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { preloadImages } from "~/utils/preload-images";

export function useImagePreload(sources: () => string[]) {
  const loading = ref(true);
  let cancelPreload: (() => void) | undefined;
  let stopWatching: (() => void) | undefined;

  onMounted(() => {
    stopWatching = watch(sources, (value) => {
      cancelPreload?.();
      loading.value = true;
      cancelPreload = preloadImages(value, () => { loading.value = false; });
    }, { immediate: true });
  });

  onBeforeUnmount(() => {
    stopWatching?.();
    cancelPreload?.();
  });

  return { loading };
}
