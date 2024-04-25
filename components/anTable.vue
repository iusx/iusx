<script setup lang="ts">
import { defineProps } from "vue";

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
  border-bottom: 1px solid #1c1c1c;
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
a.no-border {
  border-bottom: none;
}
a {
  background-image: linear-gradient(white, white);
  background-repeat: no-repeat;
  background-size: 100% 0%;
  color: white;
  transition: background-size 0.1s ease-in-out, padding 0.2s ease-in-out;
}

a:hover {
  background-size: 100% 100%;
  padding: 13px;
  color: #000 !important;
}
</style>
