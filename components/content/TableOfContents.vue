<template>
  <ul>
    <li v-for="heading in toc" :key="heading.id">
      <a :href="`#${heading.id}`">{{ heading.text.slice(0, -1) }}</a>
      <template v-if="!isNaN(parseInt(heading.text.slice(-1), 10))">
        <template v-for="key in parseInt(heading.text.slice(-1), 10)">
          <span></span>
        </template>
      </template>
      <template v-if="parseInt(heading.text.slice(-1), 10) == 0">
        <div class="no"></div>
      </template>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";

const props = defineProps({
  num: {
    type: Number,
  },
});

const toc = ref([]);
const colorMode = useColorMode();

onMounted(() => {
  const content = document.querySelector(".markdown-content");
  if (content) {
    toc.value = Array.from(
      content.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).map((heading) => ({
      id: heading.id,
      text: heading.innerText,
    }));
  }
});

const getSpanCount = computed(() => (text) => {
  const match = text.match(/\[(\d+)\]/);
  return match ? parseInt(match[1], 10) : 0;
});
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
}
ul li {
  margin: 0.8vw 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
}

li {
  background: url("data:image/svg+xml,%3Csvg width='930' height='1' viewBox='0 0 930 1' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 0.5H930' stroke='%23D7D7D7'/%3E%3C/svg%3E%0A")
    no-repeat center;
}
a {
  background: white;
  width: max-content;
  color: #000;
  text-decoration: none;
  display: flex;
  padding-right: 0.6vw;
  align-items: center;
  font-size: 1.4vh;
  &::before {
    content: "";
    display: block;
    margin-right: 0.9vh;
    width: 0.7vh;
    height: 0.7vh;
    border: 1px solid #000000;
    transform: rotate(45deg);
  }
}
.dark-mode a {
  color: #898989;
  background: #000;
  &::before {
    border: 1px solid #898989;
  }
}
span::before {
  content: "";
  display: block;
  width: 0.7vh;
  height: 0.7vh;
  border: 1px solid #000000;
  transform: rotate(45deg);
  background-color: white;
}
.no::before {
  content: "";
  display: block;
  width: 0.7vh;
  height: 0.7vh;
  background-color: #d7d7d7;
  border-radius: 100%;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
