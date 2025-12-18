<template>
  <div class="box-layout">
    <div class="box" v-for="item in list" :key="item.url">
      <div class="img">
        <img :src="item.img" :alt="item.title" />

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
  gap: 20px;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}

.box {
  width: 100%;

  .img {
    transition:
      transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.35s ease;

    transform: scale(1);
    &:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }

    display: grid;
    align-items: end;
    justify-items: start;
    transition: transform 0.3s ease;
    cursor: pointer;

    &::before {
      content: "";
      background: linear-gradient(
        360deg,
        #000 -6.11%,
        rgba(54, 54, 54, 0.47) 49.63%,
        rgba(102, 102, 102, 0) 70%
      );
      height: 100%;
      width: 100%;
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      pointer-events: none;
      z-index: 200;
    }

    img {
      width: 100%;
      grid-row: 1 /2;
      grid-column: 1/ 2;
      z-index: 100;
    }

    .title {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
      z-index: 200;
      padding: 12px;
      p {
        font-size: 30px;
        color: #fff;
        font-family: "Tsing";
        margin: 0px;
      }
      span {
        color: #a8a8a8;
        font-size: 13px;
      }
    }
  }
}

@media (prefers-color-scheme: light) {
  .box .img::before {
    content: "";
    background: linear-gradient(
      360deg,
      #ffffff -6.11%,
      rgb(255 255 255 / 47%) 49.63%,
      rgba(102, 102, 102, 0) 70%
    );
  }
  .box .img .title p {
    font-size: 30px;
    color: #000000;
    font-family: "Tsing";
    margin: 0px;
  }
  .box .img .title span {
    color: #00000073;
    font-size: 13px;
  }
}
</style>
