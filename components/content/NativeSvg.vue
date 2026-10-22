<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { MarkdownNode } from "@nuxt/content/types";
import { renderNativeSvg } from "~/utils/native-svg";

export default defineComponent({
  name: "NativeSvg",
  props: { tree: { type: Object as PropType<MarkdownNode>, required: true } },
  setup(props) {
    return () => renderNativeSvg(props.tree);
  },
});
</script>
