<script lang="ts" setup>
import { ref, computed } from "vue";
const currentPage = ref<number>(1);
const itemsPerPage = 5;
const colorMode = useColorMode()

useSeoMeta({
  title: "Develop - RHYME.Q",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

const { data: equalQuery } = await useAsyncData("equal", () => {
  // 返回 /more 目录下的数据，也可以（.where({ director: 'Hayao Miyazaki' }) 来进行过滤）
  return queryContent("dev/").find();
});

// 排序
equalQuery.value?.sort((a, b) => {
  const dateA = new Date(a.release_date).getTime();
  const dateB = new Date(b.release_date).getTime();
  return dateB - dateA;
});

// 计算总页数
const totalPages = Math.ceil(equalQuery.value?.length / itemsPerPage);

// 分页逻辑
const paginate = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getCurrentPageData = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = currentPage.value * itemsPerPage;
  return equalQuery.value?.slice(startIndex, endIndex) || [];
});

// fix generate page show error
const getAllData = computed(() => {
  return equalQuery.value || [];
});
</script>

<template>
  <main class="layout">
    <div v-for="all in getAllData" :key="all.id" style="display: none">
      <NuxtLink :to="all._path" />
    </div>
    <div
      class="content"
      v-if="equalQuery"
      v-for="dev in getCurrentPageData"
      :key="dev.id"
    >
      <nuxt-link :to="dev._path">
        <page-image :img="dev.img" :info="dev.info" :type="dev.types" />
        <page-title
          class="title"
          :title="dev.title"
          :time="dev.time"
          :client="dev.client"
        />
      </nuxt-link>
    </div>

    <div class="pagination-layout">
      <div class="pagination">
        <p
          class="pages-nums"
          @click="paginate(currentPage - 1)"
          :style="{ display: currentPage === 1 ? 'none' : 'inline-block' }"
        >
          PREV
        </p>
        <p
          @click="paginate(currentPage + 1)"
          class="pages-nums"
          style="color: blue"
          :style="{
            display: currentPage === totalPages ? 'none' : 'inline-block',
          }"
        >
          NEXT
        </p>
        <p class="pages-nums">PAGE: {{ currentPage }}</p>
      </div>
      <div class="page-num">
        <div v-for="page in totalPages" :key="page">
          <p class="page-numcolor" @click="paginate(page)">
            {{ page }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.dark-mode .pagination-layout{
    background: #171717;
}
.pagination-layout {
  display: flex;
  box-shadow: -2px -8px 20px 1px rgb(0 0 0 / 11%);
  position: fixed;
  bottom: 0;
  background: white;
  width: 80%;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: 100%;
  }
  .pages-nums {
    color: #d6d6d6;
    margin: 0;
    padding: 1rem;
    transition: color 0.3s ease;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }
  .pagination {
    display: flex;
  }
  .page-num {
    display: flex;
    cursor: pointer;

    .page-numcolor {
      padding-left: 5px;
      padding-right: 5px;
      color: #c9c9c9;
      transition: color 0.3s ease;
      &:hover {
        color: blue;
      }
    }
  }
}

.layout {
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 3%;
  @media (max-width: 425px) {
    padding-left: 3%;
    padding-right: 3%;
  }
}
.content {
  margin-bottom: 6rem;
  transition: filter 0.3s ease;
  filter: grayscale(0);
  &:hover {
    filter: grayscale(1);
  }
  a {
    text-decoration: none;
  }
}
.title {
  margin-top: 3vh;
  @media (max-width: 425px) {
    margin-top: 1.2rem;
  }
}
</style>
