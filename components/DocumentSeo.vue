<script setup lang="ts">
import { computed } from 'vue';
import { documentSeo } from '~/utils/seo';

const props = defineProps<{ document: Record<string, unknown> }>();
const route = useRoute();
const path = computed(() => typeof props.document._path === 'string' ? props.document._path : route.path);
const seo = computed(() => documentSeo(props.document, path.value));
usePageSeo(seo, () => props.document.head as Record<string, unknown> | undefined, path);
</script>

<template></template>
