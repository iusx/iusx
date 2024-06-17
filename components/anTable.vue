<script setup lang="ts">
import { defineProps } from "vue";
const colorMode = useColorMode();

defineProps(["table"]);
</script>
<template>
  <main v-for="(person, index) in table" :key="person.name">
    <a
      :href="person.url ? person.url : undefined"
      target="_blank"
      :class="{ 'no-border': index === table.length - 1 }"
    >
      <p>{{ person.name }}</p>
      <span>{{ person.time }}</span>
      <span>{{ person.post }}</span>
    </a>
  </main>
</template>

<style lang="scss" scoped>
a {
  display: flex;
  justify-content: space-between;
  font-weight: 300;
  font-size: initial;
  border-bottom: 1px solid #e1e1e1;
  padding-bottom: 13px;
  padding-top: 13px;
  cursor: pointer;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  text-decoration: none;
  p {
    margin: 0;
    width: 60%;
    flex-shrink: 0;
    text-transform: uppercase;
  }
  span {
    color: #404040 !important;
    flex: 1;
    min-width: 0;
    text-transform: capitalize;
  }
}
.dark-mode a {
  border-bottom: 1px solid #e1e1e120 !important;
}
a.no-border {
  border-bottom: none;
}
a {
  background-image: linear-gradient(black, black);
  background-repeat: no-repeat;
  background-size: 100% 0%;
  color: #a6a6a6;
  transition: background-size 0.1s ease-in-out, padding 0.2s ease-in-out;
}

a:hover {
  background-size: 100% 100%;
  padding: 13px;
  color: #ffffff !important;
  span {
    color: #fff !important;
  }
}
.dark-mode a:hover {
  background-image: linear-gradient(white, white);
  color: rgb(0, 0, 0) !important;
  span {
    color: #5f5f5f !important;
  }
}
.dark-mode a {
  color: #fff;
}
</style>
