import { isVNode } from "vue";
import type { VNodeChild } from "vue";

const DAY_MS = 86_400_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/;

function calendarDate(value: unknown): { date: string; day: number } | undefined {
  if (typeof value !== "string" || !ISO_DATE.test(value.trim())) return;
  // Use the written calendar date, not the browser timezone or elapsed hours.
  const date = value.trim().slice(0, 10);
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== date) return;
  return { date, day: timestamp / DAY_MS };
}

export function timelineGroupRange(children: VNodeChild[], start?: string, end?: string) {
  const dates: { date: string; day: number }[] = [];
  const visit = (node: VNodeChild): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
    } else if (isVNode(node)) {
      const date = calendarDate(node.props?.datetime);
      if (date) dates.push(date);
      // Fragments and native wrappers have array children. Do not invoke child
      // component slots: dates in an item's body/details aren't group events.
      if (Array.isArray(node.children)) node.children.forEach(visit);
    }
  };
  children.forEach(visit);
  dates.sort((a, b) => a.day - b.day);
  const first = start === undefined ? dates[0] : calendarDate(start);
  const last = end === undefined ? dates.at(-1) : calendarDate(end);
  if (!first || !last || last.day < first.day) return;
  return { start: first.date, end: last.date, days: last.day - first.day };
}
