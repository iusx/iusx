<template>
    <div class="animated-text">
      {{ scrambledText }}
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";
  
  const props = defineProps({
    text: {
      type: Array,
      required: true,
      validator(value) {
        return value.every((item) => typeof item === "string");
      },
    }
  });
  
  let currentTextIndex = 0;
  let timer;
  let mounted = false;
  const scrambledText = ref(props.text[0] || "");
  
  function animateTextShuffle() {
    if (!mounted || !props.text.length) return;
    currentTextIndex %= props.text.length;
    const currentText = props.text[currentTextIndex];
    if (typeof currentText !== "string") return;
    const characters = currentText.split("");
    let currentIndex = characters.length;
    let temporaryValue;
    let randomIndex;
  
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = characters[currentIndex];
      characters[currentIndex] = characters[randomIndex];
      characters[randomIndex] = temporaryValue;
    }
  
    scrambledText.value = characters.join("");
  
    let index = 0;
    const revealCharacter = () => {
      if (!mounted) return;
      if (index < characters.length) {
        scrambledText.value =
          scrambledText.value.slice(0, index) +
          currentText[index] +
          scrambledText.value.slice(index + 1);
        index++;
      }

      if (index < characters.length) {
        timer = setTimeout(revealCharacter, 100);
      } else {
        currentTextIndex = (currentTextIndex + 1) % props.text.length;
        timer = setTimeout(animateTextShuffle, 2000);
      }
    };

    // Keep the original reveal cadence with at most one pending timer.
    timer = setTimeout(revealCharacter, 0);
  }
  
  onMounted(() => {
    mounted = true;
    animateTextShuffle();
  });

  watch(() => props.text, () => {
    clearTimeout(timer);
    currentTextIndex = 0;
    scrambledText.value = props.text[0] || "";
    if (mounted) animateTextShuffle();
  }, { deep: true });

  onBeforeUnmount(() => {
    mounted = false;
    clearTimeout(timer);
  });
  </script>
  
  <style scoped>
  .animated-text {
    transition: opacity 0.5s ease-out;
  }
  </style>
