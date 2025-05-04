<script setup>
const { data: equalQueryBook } = await useAsyncData("equalBook", () => {
  return queryContent("book/").find();
});

const colorMode = useColorMode();

useSeoMeta({
  title: "Bookshelf",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

if (equalQueryBook.value) {
  equalQueryBook.value.sort((a, b) => {
    const dateA = new Date(a.time).getTime();
    const dateB = new Date(b.time).getTime();
    return dateB - dateA;
  });
}
const sortedData = computed(() => equalQueryBook.value);
</script>
<template>
  <main>
    <div class="note-layout">
      <div class="note-book"><sk-book-img :sorted-data="sortedData" /></div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@keyframes loading {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.no-img {
  background-color: #f2f2f2;
  animation: loading 1.5s infinite;
  aspect-ratio: 54 / 71;
}

.dark-mode .no-img {
  background-color: rgb(29, 29, 29);
}

.scale-effect {
  @media (max-width: 1440px) {
    transform: scale(1);
  }

  transform: scale(0.94);
}

.note-layout {
  display: flex;
  width: 85%;
  margin: 0 auto;

  @media (max-width: 1521px) {
    display: flex;
    width: 85%;
    margin: 0 auto;
    flex-direction: column;
    flex-wrap: nowrap;

    .note-book {
      margin-top: 70px;
      justify-content: space-between !important;
    }
  }
}

main {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.note-book {
  display: flex;
  width: 100%;
  flex: 2;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;

  .note-book-box {
    width: 22vw;
    height: 29vw;
    margin: 0.3vw;
    cursor: pointer;
    color: white;
    border-radius: 5px;

    background-size: 100%;

    .note-book-box-desc {
      opacity: 0;
      transition: opacity 0.3s ease-out;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding-left: 1vw;
      padding-right: 1vw;

      @media (max-width: 1440px) {
        padding-left: 4vw;
        padding-right: 4vw;
      }

      justify-content: flex-end;
      border-radius: 5px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);

      span {
        font-weight: bold;
        text-transform: uppercase;
      }
    }

    &:hover {
      .note-book-box-desc {
        opacity: 1;
      }
    }
  }
}
</style>
