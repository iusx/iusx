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
            <span>{{ formatDisplay(plan).current }}</span>
          </div>
        </div>
        <div class="plan-box">
          <div
            class="progress-bar"
            :class="plan.barClass"
            :style="{ width: plan.progress + '%' }"
          >
            <p>{{ plan.progress }}%</p>
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
            <span>{{ formatDisplay(subPlan, plan).current }}</span>
          </div>
          <div class="plan-box">
            <div
              class="progress-bar"
              :class="subPlan.barClass"
              :style="{ width: subPlan.progress + '%' }"
            >
              <p>{{ subPlan.progress }}%</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";

useSeoMeta({ title: "PLAN" });

const { data: equalQueryLink } = await useAsyncData("equalLink", () => {
  return queryContent("plan/").find();
});

const formatNumber = (value) => value.toLocaleString();

const formatDisplay = (planOrSubPlan, parentPlan = null) => {
  const type = parentPlan ? parentPlan.displayType : planOrSubPlan.displayType;
  if (type === "usd") {
    return {
      target: `SAVE ${formatNumber(planOrSubPlan.target)} USD`,
      current: `NOW: ${formatNumber(planOrSubPlan.current)} USD`,
    };
  } else if (type === "percent") {
    return {
      target: `SAVE ${formatNumber(planOrSubPlan.target)}%`,
      current: `NOW: ${formatNumber(planOrSubPlan.current)}%`,
    };
  }
  return {
    target: `SAVE ${formatNumber(planOrSubPlan.target)}`,
    current: `NOW: ${formatNumber(planOrSubPlan.current)}`,
  };
};

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

      map.set(parentPath, { ...item, _path: parentPath, subPlans: [] });
    } else {

      if (!map.has(parentPath)) {

        const folderName = seg[1];
        const humanTitle = folderName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        map.set(parentPath, {
          title: humanTitle,
          _path: parentPath,
          target: 0,
          current: 0,
          progress: 0,
          barClass: "",
          displayType: item.displayType || "percent",
          time: null,
          subPlans: [],
        });
      }
      map.get(parentPath).subPlans.push({ ...item });
    }
  });

  for (const parent of map.values()) {
    if ((!parent.target || parent.target === 0) && parent.subPlans.length) {
      parent.target = parent.subPlans.reduce(
        (s, sp) => s + (Number(sp.target) || 0),
        0,
      );
    }

    parent.current = parent.current
      ? Number(parent.current)
      : parent.subPlans.reduce((s, sp) => s + (Number(sp.current) || 0), 0);

    if (!parent.displayType && parent.subPlans.length) {
      parent.displayType = parent.subPlans[0].displayType || "percent";
    }

    if (!parent.time && parent.subPlans.length) {

      let latest = 0;
      parent.subPlans.forEach((sp) => {
        const t = new Date(sp.time).getTime();
        if (!isNaN(t) && t > latest) latest = t;
      });
      parent.time = latest ? new Date(latest).toISOString() : null;
    }
  }

  const arr = Array.from(map.values());
  arr.sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });

  return arr;
});

const sortedData = groupedData;

const calculateProgress = () => {
  (groupedData.value || []).forEach((plan) => {
    plan.target = Number(plan.target) || 0;
    plan.current = Number(plan.current) || 0;

    const p = plan.target === 0 ? 0 : (plan.current / plan.target) * 100;
    plan.progress = parseFloat(p.toFixed(2));
    plan.barClass =
      plan.current < plan.target ? "progress-positive" : "progress-negative";

    (plan.subPlans || []).forEach((subPlan) => {
      subPlan.target = Number(subPlan.target) || 0;
      subPlan.current = Number(subPlan.current) || 0;

      let subProgress = 0;

      if (plan.current === 0 || plan.target === 0) {
        subProgress =
          plan.target === 0 ? 0 : (subPlan.current / plan.target) * 100;
      } else if (subPlan.current > plan.current) {
        subProgress = ((subPlan.current - plan.current) / plan.current) * 100;
        plan.barClass = "progress-negative";
        subPlan.barClass = "progress-negative";
      } else {
        subProgress = (subPlan.current / plan.target) * 100;
        subPlan.barClass =
          subPlan.current < plan.target
            ? "progress-positive"
            : "progress-negative";
      }

      subPlan.progress = Math.min(
        100,
        parseFloat((Number.isFinite(subProgress) ? subProgress : 0).toFixed(2)),
      );
    });
  });
};

watch(
  groupedData,
  () => {
    calculateProgress();
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  calculateProgress();
});
</script>

<style lang="scss" scoped>
main {
  width: 50%;
  border-left: 1px solid #f2f2f2;
  margin-top: 90px !important;
  padding-left: 30px;
  margin: 0 auto;
}

.progress-negative {
  background: #ff1100 !important;
  box-shadow: 0px 4px 15px 3px #ff1100 !important;
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
  color: #38E7CD;
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
      color: #c2c2c2;
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
