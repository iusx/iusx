<template>
    <div class="animated-text">
      {{ scrambledText }}
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineProps, toRefs } from "vue";
  
  const props = defineProps({
    text: {
      type: Array,
      required: true,
      validator(value) {
        return value.every((item) => typeof item === "string");
      },
    }
  });
  
  const textSequenceRef = toRefs(props).text;
  
  let currentTextIndex = 0;
  const scrambledText = ref(textSequenceRef.value[currentTextIndex]);
  
  async function animateTextShuffle() {
    const currentText = textSequenceRef.value[currentTextIndex];
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
  
    await Promise.all(
      characters.map(
        (char, index) =>
          new Promise((resolve) => {
            setTimeout(() => {
              scrambledText.value =
                scrambledText.value.slice(0, index) +
                currentText[index] +
                scrambledText.value.slice(index + 1);
              resolve();
            }, index * 100);
          })
      )
    );
  
    currentTextIndex = (currentTextIndex + 1) % textSequenceRef.value.length;
  
    setTimeout(animateTextShuffle, 2000);
  }
  
  onMounted(() => {
    if (
      Array.isArray(textSequenceRef.value) &&
      textSequenceRef.value.length > 0
    ) {
      const scrambledText = ref(textSequenceRef.value[currentTextIndex]);
      animateTextShuffle();
    } else {
      console.error("Invalid or empty text sequence provided as prop.");
    }
  });
  </script>
  
  <style scoped>
  .animated-text {
    transition: opacity 0.5s ease-out;
  }
  </style>
