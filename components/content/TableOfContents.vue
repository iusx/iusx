<template>
  <nav>
    <ul>
      <li v-for="heading in toc" :key="heading.id">
        <a :href="`#${heading.id}`">{{ heading.text.slice(0, -1) }}</a>
        <template v-for=" key in parseInt(heading.text.slice(-1))">
            <span></span>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from "vue";

const props = defineProps({
  num: {
    type: Number,
  },
});

const toc = ref([]);

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
nav ul {
  list-style: none;
  padding: 0;
}
nav ul li {
  margin: 0.5em 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

li {
  background: url("data:image/svg+xml,%3Csvg width='430' height='1' viewBox='0 0 430 1' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 0.5H430' stroke='%23D7D7D7'/%3E%3C/svg%3E%0A")
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
  &::before {
    content: "";
    display: block;
    margin-right: 0.5vw;
    width: 7px;
    height: 7px;
    border: 1px solid #000000;
    transform: rotate(45deg);
  }
}
span::before {
  content: "";
  display: block;
  width: 7px;
  height: 7px;
  border: 1px solid #000000;
  transform: rotate(45deg);
  background-color: white;
}
</style>
