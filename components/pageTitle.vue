<script lang="ts" setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

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
    const date = new Date(parts[0], parts[1] - 1, parts[2]);

    // 获取月份名称和年份
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // 处理日期序数词后缀
    const dayOfMonth = date.getDate();
    let suffix = "th";
    if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
      suffix = "st";
    } else if (dayOfMonth === 2 || dayOfMonth === 22) {
      suffix = "nd";
    } else if (dayOfMonth === 3 || dayOfMonth === 23) {
      suffix = "rd";
    }

    // 返回格式化的日期字符串
    return `${monthName} ${dayOfMonth}${suffix} ${year}`;
  }
  return "";
});
</script>

<template>
  <main>
    <div class="title">
      <p>{{ title }}</p>
      <span class="time">{{ formattedTime }}</span>
    </div>
    <div class="client">
      <span>clientele</span>
      <p>{{ client }}</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.dark-mode p,
span {
  color: rgb(212, 212, 212) !important;
}
.dark-mode .client span {
  opacity: 0.7;
}
main {
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
}
.title {
  width: 100%;
  p {
    color: #1c0000;
    font-size: 3vh;
    margin: 0;
    line-height: 1;
    @media (max-width: 425px) {
      font-size: 1.3rem;
    }
  }
  span {
    padding: 0;
    color: #1c0000;
    font-size: 2vh;
    @media (max-width: 425px) {
      font-size: 1rem;
    }
  }
}
.client {
  width: 35%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (max-width: 768px) {
    margin-top: 1rem;
    width: 100%;
  }
  @media (max-width: 425px) {
    opacity: 0.5;
  }
  span {
    color: #888888;
    font-size: 1.4vh;
    line-height: 1;
    text-transform: uppercase;
  }
  p {
    color: #1c0000;
    font-size: 1.4vh;
    line-height: 1;
    font-weight: bold;
    text-transform: uppercase;

    margin: 0;
  }
}
</style>
