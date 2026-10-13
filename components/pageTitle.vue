<script lang="ts" setup>
import { defineProps } from "vue";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const props = defineProps({
  title: {
    type: String,
  },
  time: {
    type: String,
  },
  client: {
    type: String,
  },
});

const formattedTime = computed(() => {
  if (props.time) {
    const parts = props.time.split(".").map(Number);
    if (parts.length !== 3 || parts.some(part => !Number.isFinite(part))) return props.time;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const dayOfMonth = date.getDate();
    let suffix = "th";
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      suffix = "st";
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      suffix = "nd";
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      suffix = "rd";
    }

    return `${monthName} ${dayOfMonth}${suffix} ${year}`;
  }
  return "";
});
</script>

<template>
  <div class="article-title">
    <h1><span class="title-prompt" aria-hidden="true">&gt;</span><span>{{ title }}</span></h1>
    <div v-if="formattedTime || client" class="article-meta">
      <span v-if="formattedTime" class="time">{{ formattedTime }}</span>
      <span v-if="client" class="client"><span class="meta-label">client /</span> {{ client }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-title {
  margin-bottom: 1.5rem;
  font-family: var(--article-font, monospace);
}
h1 {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0;
  color: var(--article-strong, #242424);
  font-size: clamp(1.25rem, 2.5vw, 1.625rem);
  line-height: 1.6;
  font-weight: 600;
  overflow-wrap: anywhere;
  > span:last-child { min-width: 0; }
}
.title-prompt { color: var(--article-accent, #007f73); font-weight: 400; }
.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1.5rem;
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  color: var(--article-muted, #737373);
  font-size: 0.75rem;
  line-height: 1.8;
}
.meta-label { color: var(--article-faint, #999); }
.dark-mode h1 { color: var(--article-strong, #ededed); }
.dark-mode .title-prompt { color: var(--article-accent, #38e7cd); }
</style>
