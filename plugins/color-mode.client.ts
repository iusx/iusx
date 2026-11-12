export default defineNuxtPlugin(() => {
  const colorMode = useColorMode();

  // Older versions offered a "native" theme. Its saved preference can outlive
  // the stylesheet, leaving neither light-mode nor dark-mode on the page.
  watch(() => colorMode.preference, preference => {
    if (!["system", "light", "dark"].includes(preference)) {
      colorMode.preference = "system";
    }
  }, { immediate: true });
});
