<template>
  <main>
    <div class="hi">
      <h1><this-page></this-page> <an-typing>PLAN</an-typing></h1>
      <span>MY plan</span>
    </div>
    <div class="layout-box">
      <div v-for="(plan, index) in sortedData" :key="index" class="layout">
        <div class="title-box">
          <p class="title-box_name">{{ plan.title }}</p>
          <div class="title">
            <p>{{ formatDisplay(plan).target }}</p>
            <span :class="{ 'negative-color': plan.barClass === 'progress-negative' }">
              {{ formatDisplay(plan).current }}
            </span>
          </div>
        </div>
        <div class="plan-box">
          <div
            class="progress-bar"
            :class="plan.barClass"
            :style="{ width: plan._progressForWidth + '%' }"
          >
            <p>{{ formatPercent(plan.progress) }}</p>
          </div>
        </div>
        <a
          :href="subPlan._path"
          v-for="(subPlan, subIndex) in plan.subPlans"
          :key="subIndex"
          class="sub-plan"
        >
          <div class="title">
            <p>
              {{ formatDisplay(subPlan, plan).target }} - {{ subPlan.title }}
            </p>
            <span
              :class="{
                'negative-color': subPlan.barClass === 'progress-negative',
              }"
            >
              {{ formatDisplay(subPlan, plan).current }}
            </span>
          </div>
          <div class="plan-box">
            <div
              class="progress-bar"
              :class="subPlan.barClass"
              :style="{ width: subPlan._progressForWidth + '%' }"
            >
              <p>{{ formatPercent(subPlan.progress) }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from "vue";
useSeoMeta({ title: "PLAN" });

const { data: equalQueryLink } = await useAsyncData("equalLink", () => {
  return queryContent("plan/").find();
});

const formatNumber = (value) => value.toLocaleString();
const formatPercent = (value) => (value < 0 ? "-" : "") + Math.abs(value) + "%";
const getBarClass = (current, target) => (current < 0 ? "progress-negative" : "");

const groupedData = computed(() => {
  const raw = equalQueryLink.value || [];
  const map = new Map();

  raw.forEach((item) => {
    const seg = String(item._path || "")
      .split("/")
      .filter(Boolean);
    if (seg.length < 2) return;

    const parentPath = "/" + seg.slice(0, 2).join("/");

    if (seg.length === 2) {

      if (!map.has(parentPath)) {
        map.set(parentPath, { 
          ...item, 
          _path: parentPath, 
          subPlans: [],
          target: item.target || 100, 
          current: item.current || 0,
          displayType: item.displayType || "percent"
        });
      }
    } else {

      if (!map.has(parentPath)) {
        const folderName = seg[1];
        const humanTitle = folderName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        map.set(parentPath, {
          title: humanTitle,
          _path: parentPath,
          target: 100, 
          current: 0,
          progress: 0,
          barClass: "",
          displayType: "percent",
          time: null,
          subPlans: [],
        });
      }
      const parent = map.get(parentPath);
      const subPlanPath = "/" + seg.slice(0, 3).join("/");

      const subPlan = {
        ...item,
        _path: subPlanPath,
        target: Number(item.target) || 100, 
        current: Number(item.current) || 0,
        displayType: item.displayType || parent.displayType
      };

      parent.subPlans.push(subPlan);
    }
  });

  for (const parent of map.values()) {

    parent.subPlans.forEach((subPlan) => {
      processPlanItem(subPlan);
    });

    if (parent.subPlans.length > 0) {
      const totalProgress = parent.subPlans.reduce((sum, sp) => sum + sp.progress, 0);
      parent.current = totalProgress / parent.subPlans.length;
      parent.progress = parseFloat(parent.current.toFixed(2));
    } else {

      processPlanItem(parent);
    }

    parent._progressForWidth = Math.max(0, Math.min(parent.progress, 100));
    parent.barClass = getBarClass(parent.current, parent.target);
  }

  return Array.from(map.values()).sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });
});

function processPlanItem(item) {
  item.target = Number(item.target) || 100;
  item.current = Number(item.current) || 0;

  let progress = 0;
  if (item.target > 0) {
    progress = (item.current / item.target) * 100;

    if (item.displayType === "percent") {
      progress = Math.min(progress, 100);
    }
  }

  item.progress = parseFloat(progress.toFixed(2));
  item._progressForWidth = Math.max(0, Math.min(item.progress, 100));
  item.barClass = getBarClass(item.current, item.target);
}

const sortedData = groupedData;

const formatDisplay = (planOrSubPlan, parentPlan = null) => {
  const type = parentPlan ? parentPlan.displayType : planOrSubPlan.displayType;
  const target = planOrSubPlan.target;
  const current = planOrSubPlan.current;

  if (type === "usd") {
    return {
      target: `SAVE ${formatNumber(target)} USD`,
      current: `NOW: ${formatNumber(current)} USD`,
    };
  } else if (type === "percent") {

    if (!parentPlan && planOrSubPlan.subPlans && planOrSubPlan.subPlans.length > 0) {
      return {
        target: `SAVE ${formatNumber(target)}%`,
        current: `NOW: ${formatNumber(current)}%`,
      };
    }
    return {
      target: `SAVE ${formatNumber(target)}%`,
      current: `NOW: ${formatNumber(current)}%`,
    };
  }

  return {
    target: `SAVE ${formatNumber(target)}`,
    current: `NOW: ${formatNumber(current)}`,
  };
};
</script>

<style lang="scss" scoped>
main {
  width: 50%;
  border-left: 1px solid #f2f2f2;
  padding-left: 30px;
  margin: 0 auto;
}

.progress-negative {
  background: #ff1100 !important;
  box-shadow: 0px 4px 15px 3px #ff1100 !important;
}
.negative-color {
  color: #ff1100 !important;
}
@font-face {
  font-family: "Tsing";
  src:
    url("/Tsing.woff2") format("woff2"),
    url("/Tsing.woff") format("woff"),
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
  color: #fff;
  text-shadow: 0px 2px 6px rgb(255 255 255 / 95%);
}

.dark-mode main {
  border-left-color: #272727;
}

.dark-mode .layout-box .title span {
  color: #38e7cd;
}

.dark-mode .layout-box .title p {
  color: #6f6f6f;
}

.layout {
  &:first-child {
    margin-top: 100px;
  }
  &:last-child {
    margin-bottom: 100px;
  }

  display: flex;
  flex-direction: column;
}
.dark-mode .title-box_name {
  color: #6f6f6f;
}

.layout {
  transition: padding-left 0.3s ease;
  &:hover {
    padding-left: 10px;
  }
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
      color: #5b5b5b;
    }

    span {
      margin-top: 4px;
      font-size: 25px;
    }
  }
  .title-box {
    text-decoration: none;
    display: flex;
    align-items: flex-end;
    flex-direction: row;
    justify-content: space-between;
    color: #000;
    @media (max-width: 600px) {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: space-between;
    }
    .title-box_name {
      padding: 0;
      margin: 0;
      font-family: "Tsing";
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
  background: linear-gradient(to right, #38e7cd, #38e7cd);
  font-family: "Tsing";
  stroke: #38e7cd;
  text-align: right;
  padding-right: 8px;
  color: white;
  font-size: 19px;
  line-height: 27px;
  box-shadow: 0px 4px 15px 3px #38e7cd;
  transition: width 0.5s ease-in-out;

  p {
    text-shadow: 0px 2px 6px rgb(0 0 0 / 95%);
    margin: 0;
  }
}

.dark-mode .copyright {
  p,
  .copy-link a {
    color: #6f6f6f;
  }
}
a {
  text-decoration: none;
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

.sub-plan {
  margin-top: 40px;
  padding-left: 30px;
  color: #000;
}
</style>
