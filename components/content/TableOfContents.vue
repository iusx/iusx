<template>
  <ul>
    <li v-for="heading in toc" :key="heading.id" :style="getPaddingStyle(heading)">
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
import { ref, onMounted, nextTick, watchEffect } from 'vue'

const toc = ref([])

watchEffect(async (onCleanup) => {
  let retries = 0
  const maxRetries = 5

  const checkContent = async () => {
    const content = document.querySelector('.markdown-content')
    if (!content) {
      if (retries++ < maxRetries) {
        setTimeout(checkContent, 300)
      }
      return
    }

    const headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const validHeadings = headings.filter(h => h.innerText.trim() !== '')

    if (validHeadings.length === 0 && retries++ < maxRetries) {
      setTimeout(checkContent, 300)
      return
    }

    toc.value = validHeadings.map(heading => ({
      id: heading.id,
      text: heading.innerText,
      level: parseInt(heading.tagName.slice(1))
    }))
  }

  const timer = setTimeout(checkContent, 100)
  onCleanup(() => clearTimeout(timer))
})

const getTextContent = (element) => {
  return Array.from(element.childNodes)
    .map(node => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent
      if (node.nodeType === Node.ELEMENT_NODE) return node.textContent
      return ''
    })
    .join('')
    .trim()
}

const getPaddingStyle = (heading) => {
  return {
    marginLeft: `${(heading.level - 1) * 20}px`,
    listStyleType: heading.level > 2 ? 'circle' : 'disc'
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
}

ul li {
  margin: 10.8px 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
}

li {
  background: url("data:image/svg+xml,%3Csvg width='930' height='1' viewBox='0 0 930 1' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.5 0.5H930' stroke='%23D7D7D7'/%3E%3C/svg%3E%0A") no-repeat center;
}

a {
  background: white;
  width: max-content;
  color: #000;
  text-decoration: none;
  display: flex;
  padding-right: 0.6vw;
  align-items: center;
  font-size: 14px;

  &::before {
    content: "";
    display: block;
    margin-right: 0.9vh;
    width: 0.7vh;
    height: 0.7vh;
    margin-left: 1px;
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
