type DataRecord = Record<string, unknown>;

export interface TimelineFileEntry {
  key: string;
  time: string;
  datetime: string;
  ago: string;
  kind: string;
  number: string | number;
  status: string;
  priority: string | number;
  title: string;
  text: string;
  details: { label: string; text: string }[];
}

const record = (value: unknown): DataRecord =>
  value !== null && typeof value === "object" && !Array.isArray(value) ? value as DataRecord : {};

function text(value: unknown): string {
  if (value == null) return "";
  return typeof value === "object" ? JSON.stringify(value, null, 2) : String(value).trim();
}

function payload(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return value; }
}

export function timelineFilePath(file: string): string {
  const path = file.trim().replace(/^\/?public\//, "/");
  const url = path.startsWith("/") ? path : `/${path}`;
  if (!/^\/(?!\/)[^?#\\:]+\.json(?:\?[^#]*)?$/i.test(url) || url.split(/[/?]/).includes("..")) {
    throw new Error("file 必须是 public 目录中的 JSON 路径");
  }
  return url;
}

const detailLabels: Record<string, string> = {
  detail: "详情", details: "详情", description: "描述", goal: "目标",
  evidence: "证据", confidence: "置信度", severity: "严重性", vulnclass: "漏洞类别",
  asset_ids: "关联资产编号", signature: "签名", generation: "代次",
  anchor_ids: "锚点编号", member_ids: "成员编号",
};

export function readTimelineFile(input: unknown): TimelineFileEntry[] {
  const document = record(input);
  const items = Array.isArray(input) ? input : document.items;
  if (!Array.isArray(items)) throw new Error("JSON 应为条目数组，或包含 items 数组的对象");

  return items.map((value, index) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`第 ${index + 1} 条时间线数据不是对象`);
    }
    const item = record(value);
    const raw = payload(item.payload);
    const body = item.payload == null ? item : record(raw);
    const title = text(item.title ?? body.name);
    const fullText = text(body.summary ?? body.text ?? body.body ?? item.text ?? item.content ?? (typeof raw === "string" ? raw : ""));
    // Digests and free-form text can be very long; leave the full text in native details.
    const shortened = fullText.length > 480;
    const summary = shortened ? `${fullText.slice(0, 480).trimEnd()}…` : fullText;
    const details: TimelineFileEntry["details"] = [];
    if (shortened) details.push({ label: "完整内容", text: fullText });
    const fields = item.payload == null ? ["details", "detail"] : Object.keys(body);
    for (const field of fields) {
      if (["summary", "text", "body", "name"].includes(field)) continue;
      const content = text(body[field]);
      if (content) details.push({ label: detailLabels[field] ?? field, text: content });
    }
    if (item.payload != null && !Object.keys(body).length && typeof raw !== "string" && raw != null) {
      details.push({ label: "原始内容", text: text(raw) });
    }
    if (item.origin != null) details.push({ label: "来源", text: text(item.origin) });
    const assets = record(document.assets)[text(item.id)];
    if (Array.isArray(assets) && assets.length) details.push({
      label: "关联资产",
      text: assets.map(asset => {
        const entry = record(asset);
        return [entry.id != null ? `#${text(entry.id)}` : "", text(entry.label), text(entry.type)].filter(Boolean).join(" · ");
      }).join("\n"),
    });

    // Keep the date and clock from the ISO timestamp, including its original timezone.
    const datetime = text(item.datetime ?? item.ts);
    const iso = /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}(?::\d{2})?))?/.exec(datetime);
    return {
      key: `${text(item.id ?? item.number)}:${index}`,
      time: text(item.time) || iso?.[2] || (iso ? "" : datetime),
      datetime,
      ago: text(item.ago) || iso?.[1] || "",
      kind: text(item.kind ?? item.type) || "note",
      number: typeof item.number === "number" ? item.number : text(item.number ?? item.id),
      status: text(item.status ?? item.state),
      priority: typeof item.priority === "number" ? item.priority : text(item.priority),
      title,
      text: summary,
      details,
    };
  });
}
