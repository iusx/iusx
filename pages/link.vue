<script lang="ts" setup>
useSeoMeta({
  title: "Friendly link - RHYME.Q",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

const colorMode = useColorMode();

const { data: equalQueryLink } = await useAsyncData("equalLink", () => {
  return queryContent("link/").find();
});

if (equalQueryLink.value) {
  equalQueryLink.value.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  });
}

const sortedData = computed(() => equalQueryLink.value);
</script>

<template>
  <main>
    <div class="box-layout" v-for="link in sortedData">
      <a :href="link.url" class="box" target="_blank">
        <img :src="link.img" :alt="link.name" />
        <h1>{{ link.name }}</h1>
      </a>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  color: aliceblue;
  width: 40vw;
  margin: 0 auto;
  @media (max-width: 1024px) {
    width: 70vw;
  }
  margin-top: 3vw;
}

.dark-mode .box-layout {
  background: rgb(255 255 255 / 9%);
}

.dark-mode h1 {
    color: #fff !important
}

.box-layout {
  background: #00000008;

  img {
    width: 5vw;
    @media (max-width: 1024px) {
      width: 10vw;
    }
  }
  .box {
    display: flex;
    align-items: center;
    margin-bottom: 2vw;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.2);
    }
    h1 {
      padding: 0;
      color: #000;
      font-size: 1.5vw;
      margin: 0;
      @media (max-width: 1024px) {
        font-size: 2vw;
        margin-left: 2vw;
      }
      margin-left: 1vw;
    }
  }
  .desc {
    color: #000;
    background: white;
    margin-top: 1vw;
    padding: 1vw;
  }
  a {
    text-decoration: none;
  }
}
</style>
