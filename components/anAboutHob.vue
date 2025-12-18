<template>
  <div class="box-layout">
    <div class="box" v-for="item in list" :key="item.url">
      <div class="img">
        <div class="title">
          <p>{{ item.title }}</p>
          <span>{{ item.info }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface HobItem {
  img: string;
  title: string;
  url: string;
  info: string;
}

defineProps<{
  list: HobItem[];
}>();
</script>

<style lang="scss">
.box-layout {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.box {
  width: 100%;
  .title {
    border-bottom: 1px solid #e1e1e1;
    padding-bottom: 13px;
    background-image: linear-gradient(black, black);
    background-repeat: no-repeat;
    background-size: 100% 0%;
    transition:
      background-size 0.1s ease-in-out,
      padding 0.2s ease-in-out;
    padding-top: 13px;
    &:hover {
      background-size: 100% 100%;
      padding: 13px;
      color: #ffffff !important;
    }
    p {
      font-size: 16px;
      margin: 0px;
    }
    span {
      font-size: 13px;
    }
  }
}
.box:last-child .title {
  border-bottom: none;
}
@media (prefers-color-scheme: dark) {
  .box .title {
    background-image: linear-gradient(white, white);
    color: rgb(0, 0, 0) !important;
    p,
    span {
      color: #5f5f5f !important;
    }
  }
  .box .title {
    border-bottom: 1px solid #2b2b2b;
  }
}
</style>
