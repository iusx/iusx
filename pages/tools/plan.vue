<template>
  <main>
    <div class="hi">
      <h1>PLAN</h1>
      <span>MY money Pay plan</span>
    </div>
    <div class="layout-box">
      <div v-for="(plan, index) in plans" :key="index" class="layout">
        <div class="title">
          <p>SAVE {{ formatNumber(plan.target) }} USD</p>
          <span>NOW: {{ formatNumber(plan.current) }} USD</span>
        </div>
        <div class="plan-box">
          <div class="progress-bar" :style="{ width: plan.progress + '%' }">
            {{ plan.progress }}%
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div class="copy-link">
        <a href="/about">about</a>
        <a href="/link">Link</a>
        <a href="/rss.xml">Rss</a>
        <a href="/sitemap.xml">Sitemap</a>
      </div>
      <p>
        Creative Commons Attribution 4.0 International License (CC BY 4.0) and
        the MIT License
      </p>
    </div>
  </main>

</template>

<script setup>
import { ref, onMounted } from 'vue'

const plans = ref([
  {
    target: 13000,
    current: 177,
    progress: 0
  },
])

useSeoMeta({
  title: "PLAN",
});

const formatNumber = (value) => {
  return value.toLocaleString()
}

const calculateProgress = () => {
  plans.value.forEach(plan => {
    const progress = Math.min(Math.round((plan.current / plan.target) * 100), 100)
    plan.progress = progress
  })
}

onMounted(() => {
  calculateProgress()
})
</script
</script>

<style lang="scss" scoped>
main {
  width: 50%;
  border-left: 1px solid #f2f2f2;
  margin-top: 90px !important;
  padding-left: 30px;
  margin: 0 auto;
}


@font-face {
  font-family: "Tsing";
  src: url("/Tsing.woff2") format("woff2"), url("/Tsing.woff") format("woff"),
    url("/Tsing.ttf") format("truetype");
}

@media (max-width: 1440px) {
  main {
    width: 80%;
  }
}

.dark-mode .hi {
  color: #6f6f6f;
}

.dark-mode .plan-box {
  background-color: #000000;
  box-shadow: -2px -1px 20px 11px rgb(255 255 255 / 6%);
}

.dark-mode .progress-bar {
  color: #000;
}

.dark-mode main {
  border-left-color: #272727;
}

.dark-mode .layout-box .title span {
  color: #1de188;
}

.dark-mode .layout-box .title p {
  color: #6f6f6f;
}

.layout {
  &:first-child {
    margin-top: 100px;
  }

  display: flex;
  flex-direction: column;
}

.layout-box {
  gap: 60px;
  display: flex;
  flex-direction: column;

  .title {
    font-family: "Tsing";

    p {
      padding: 0;
      margin: 0;
      color: #c2c2c2;
    }

    span {
      margin-top: 4px;
      font-size: 25px;
    }
  }
}

.hi {
  h1 {
    font-family: "Tsing";
    margin: 0;
  }

  span {
    font-family: "Tsing";
  }
}

.plan-box {
  margin-top: 15px;
  width: 100%;
  height: 24px;
  background-color: #f6f6f6;
  overflow: hidden;
  box-shadow: 0px 4px 16px 8px rgb(193 193 193 / 25%);
  padding: 3px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, #00E989, #81c784);
  font-family: "Tsing";
  stroke: #6FFFC4;
  text-align: right;
  padding-right: 8px;
  color: white;
  font-size: 19px;
  line-height: 27px;
  box-shadow: 0px 4px 15px 3px #00E989;
  transition: width 0.5s ease-in-out;
}

.dark-mode .copyright {

  p,
  .copy-link a {
    color: #6f6f6f;
  }
}

.copyright {
  margin-top: 60px;
  color: #e0e0e0;
  font-size: 13px;
  line-height: 1;
  text-transform: uppercase;

  p {
    margin: 0;
    font-size: 13px;
  }

  .copy-link {
    a {
      text-decoration: none;
      color: #e0e0e0;
      padding-right: 10px;
      transition: color 0.3s ease;
      text-transform: uppercase;

      &:hover {
        color: #1c0000;
        text-transform: none;
        text-decoration: none;
      }

      .dark-mode &:hover {
        color: #757575;
      }
    }
  }
}
</style>
