<script setup lang="ts">
import { computed } from 'vue';
import { documentSeo } from '~/utils/seo';
import { routeSeo } from '~/utils/seo-pages';

const props = defineProps<{ document: Record<string, unknown> }>();
const route = useRoute();
const path = computed(() => typeof props.document._path === 'string' ? props.document._path : route.path);
const seo = computed(() => path.value === '/' ? {
  ...documentSeo(props.document, path.value),
  ...routeSeo('/'),
} : documentSeo(props.document, path.value));
usePageSeo(seo, () => props.document.head as Record<string, unknown> | undefined, path);
</script>

<template></template>
