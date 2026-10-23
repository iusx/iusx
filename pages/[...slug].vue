<template>
  <div :class="{ 'article-page': route.path !== '/' }">
    <DocumentSeo v-if="document" :document="document" />
    <ContentRenderer v-if="document" :value="document">
      <template #empty>
        <main class="empty-content">
          <h1>{{ document.title || document.name }}</h1>
          <NuxtLink to="/">返回首页</NuxtLink>
        </main>
      </template>
    </ContentRenderer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const path = route.path;
const { data: document } = await useAsyncData(`page-document:${path}`, () => queryContent(path).findOne());
if (!document.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' });
</script>

<style lang="scss">
@import "../public/scss/article.scss";
.empty-content { padding: 5rem 1.5rem; text-align: center; }
</style>
