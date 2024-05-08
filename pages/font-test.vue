<template>
  <main>
    <div class="font">
      <p class="title">A \ Q</p>
      <p>ABCDEFGH<br />IJKLMNOPQRSTUVWXYZ</p>
    </div>
  </main>
</template>
<script setup>
useSeoMeta({
  title: "Font Test - RHYME.Q",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});
</script>
<style lang="scss" scoped>
@font-face {
  font-family: "Tsing";
  src: url("/Tsing.woff2") format("woff2"), url("/Tsing.woff") format("woff"),
    url("/Tsing.ttf") format("truetype");
}
.font {
    padding-top: 20vw;
    padding-left: 9vw;
}
main {
  background: black;
  height: 100vh;
  font-family: tsing;
  color: white;
}
p {
  font-size: 5vw;
  margin: 0;
}
.title {
  font-size: 10vw;
}
</style>
