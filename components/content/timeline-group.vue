<script lang="ts">
import { defineComponent, h } from "vue";
import { timelineGroupRange } from "~/utils/timeline-group";

export default defineComponent({
  name: "TimelineGroup",
  props: {
    title: String,
    start: String,
    end: String,
    showDuration: { type: Boolean, default: true },
    expanded: { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    return () => {
      // Read and render the same VNodes, inside render so reactive slot props
      // stay tracked and the summary is already present in server-rendered HTML.
      const children = slots.default?.() ?? [];
      const range = props.showDuration ? timelineGroupRange(children, props.start, props.end) : undefined;
      const duration = range ? `历时 ${range.days} 天` : "";
      return h("div", { class: "timeline-group", role: "listitem" }, [
        h("details", {
          class: "timeline-group-disclosure",
          open: props.expanded,
          "aria-label": [props.title, duration].filter(Boolean).join("，") || "事件分组",
        }, [
          h("summary", { class: "timeline-group-heading" }, [
            h("svg", { class: "timeline-group-chevron", viewBox: "0 0 12 12", fill: "none", "aria-hidden": "true" }, [
              h("path", { d: "m4.5 2.5 3.5 3.5-3.5 3.5" }),
            ]),
            props.title || !duration ? h("span", { class: "timeline-group-title" }, props.title || "事件分组") : null,
            range ? h("span", { class: "timeline-group-duration", title: `${range.start} — ${range.end}` }, duration) : null,
          ]),
          h("div", { class: "timeline-group-entries", role: "list" }, children),
        ]),
      ]);
    };
  },
});
</script>

<style scoped>
.timeline-group {
  position: relative;
  min-width: 0;
  margin: 2rem 0;
}
.timeline-group-disclosure { position: relative; }
.timeline-group::before {
  content: "";
  position: absolute;
  top: 0.625rem;
  bottom: 0.625rem;
  left: calc(-1 * var(--timeline-group-gutter, 1.25rem));
  width: 0.5rem;
  border: 1px solid var(--timeline-accent, #007f73);
  border-right: 0;
  pointer-events: none;
}
.timeline-group-heading {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem 0.875rem;
  min-width: 0;
  padding: 0 0 0.75rem 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  list-style: none;
  cursor: pointer;
}
.timeline-group-heading::-webkit-details-marker { display: none; }
.timeline-group-heading::marker { content: ""; }
.timeline-group-heading:focus-visible { outline: 1px solid var(--timeline-accent, #007f73); outline-offset: 3px; }
.timeline-group-chevron { position: absolute; top: 0.25rem; left: 0; width: 0.8125rem; height: 0.8125rem; color: var(--timeline-muted, #737373); stroke: currentColor; stroke-width: 1.2; }
.timeline-group-disclosure[open] > .timeline-group-heading .timeline-group-chevron { transform: rotate(90deg); }
.timeline-group-heading:hover .timeline-group-title { color: var(--timeline-accent, #007f73); }
.timeline-group-title { color: var(--timeline-strong, #242424); font-weight: 600; }
.timeline-group-duration { color: var(--timeline-accent, #007f73); font-variant-numeric: tabular-nums; }
.timeline-group-entries { min-width: 0; }
</style>
