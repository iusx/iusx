<template>
  <div class="wise-layout">
    <div class="wise-box">
      <p>
        {{ topic }}
        <Icon class="tip-quto" name="QutoIcon" size="20" />
      </p>
      <div class="content">
        <slot />
      </div>
    </div>
    <span class="by">{{ by }}</span>
  </div>
</template>

<script setup>
import { defineProps, onMounted } from "vue";

const colorMode = useColorMode();
defineProps(["by", "topic"]);
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap");

.dark-mode p {
  background: #121212 !important;
}

.dark-mode .wise-layout {
  border: 1px solid #202020;
}

.wise-layout {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #e1e1e1;
  flex-direction: column;
  align-items: stretch;
  display: flex;

  p {
    background: #fafafa;

    margin: 0;

    gap: 12px;
    align-items: flex-start;
    padding: 12px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }

  .content {
    padding: 12px;
    font-style: oblique;
    font-size: 17px;
    color: #888888;
    font-family: "Noto Serif SC", serif;
  }

  .by {
    padding: 0px 12px 12px 0px;
    font-family: "Noto Serif SC", serif;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    font-style: oblique;
    color: #888888;

    &::before {
      content: "";
      width: 30px;
      height: 1px;
      background: #888888;
      display: block;
    }
  }
}

.tip-quto {
  opacity: 0.1;
}

.dark-mode {
  .tip-quto {
    opacity: 1;
    stroke: #575757;
  }
}
</style>
