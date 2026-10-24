import { toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { buildSeoHead } from '~/utils/seo-head';
import type { SeoPage } from '~/utils/seo';

export function usePageSeo(
  page: MaybeRefOrGetter<SeoPage>,
  extraHead?: MaybeRefOrGetter<Record<string, unknown> | undefined>,
  path?: MaybeRefOrGetter<string>,
) {
  const route = useRoute();
  return useHead(() => buildSeoHead(toValue(page), path ? toValue(path) : route.path, toValue(extraHead)));
}
