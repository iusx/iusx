# Content 时间线

在 `content/**/*.md` 中使用 `text-timeline` 和 `timeline-item`，无需手动导入。每个 `text-timeline` 可以表示一天或一组事件，按 Markdown 中的顺序展示。

## 从 JSON 文件读取

你的 Artex 导出文件可以直接这样使用：

```md
::text-timeline{title="Artex 任务记录" file="/img/book/a-fun-guide-to-exploring-binaries/artex-broadcast-task-8-20261022T055749Z-redacted.json"}
::
```

`file` 是 `public` 下的公开路径，推荐省略 `public` 前缀；`public/img/...json` 也兼容。文件模式自动渲染数据，不需要再手写 `timeline-item`。不传 `file` 时保留下面的插槽写法。

文件时间线默认只渲染前 5 条。超过 5 条时，底部显示“显示全部”按钮及剩余数量，点击后一次展开全部；不超过 5 条时不显示按钮。现有 `file` 用法无需调整。

支持 Artex `artex.broadcast.v1` 导出，以及普通条目数组或 `{ "items": [...] }`。普通条目使用 `time`、`datetime`、`ago`、`kind`、`number`、`status`、`priority`、`title`、`text`、`details` 等字段，例如：

```json
[
  { "time": "16:56:06", "kind": "fact", "number": 128, "status": "confirmed", "text": "完成布局优化", "details": "在不同屏幕宽度下验证。" }
]
```

Artex 数据中的 `ts/type/id/state` 自动对应时间、类型、编号及状态。`payload` 可以是 JSON 字符串或对象，自动读取 `summary`、`text` 或 `body`；额外字段、来源和关联资产放入折叠详情。超过 480 字符的正文显示摘要，全文保留在详情中。按文件原有顺序展示，时间使用 `ts` 中的日期和时钟，不受浏览器时区影响。

JSON 内容按纯文本显示，保留换行；其中的 HTML 和脚本不会作为网页执行。单条 `payload` 无法解析时显示其原始文本。文件不存在、JSON 无效或缺少条目数组时显示错误及重试按钮，空数组显示空状态。数据在服务端读取，客户端复用结果。

## 在 Markdown 中手写

```md
::::text-timeline{title="更新记录" date="2026 年 10 月 22 日" datetime="2026-10-22"}

:::timeline-item{time="16:56:06" kind="fact" number="128" status="confirmed" title="修复书库的大屏布局"}
封面改为自适应网格，保持原始比例。

#details
- 按可用宽度自动增加列数。
- 手机保留两列。
- 支持 **键盘聚焦** 和阅读进度提示。
:::

:::timeline-item{time="16:56:03" kind="intent" number="127" status="active" priority="P1"}
整理文章组件，让技术笔记可以直接复用。
:::

:::timeline-item{time="16:44:06" kind="note" status="done"}
完成第一版。正文支持普通 Markdown、[链接](/book) 和 `行内代码`。
:::

::::
```

父组件 `text-timeline` 的 `title`、`date`、`datetime` 都可省略。`date` 是展示文字；`datetime` 可填写 ISO 日期供语义化的 `<time>` 使用。

条目属性：

| 属性 | 说明 |
| --- | --- |
| `time` | 展示时间，例如 `16:56:06`；省略时显示短横线 |
| `datetime` | 可选的 ISO 日期时间，例如 `2026-10-22T16:56:06+08:00` |
| `ago` | 可选的补充文字，例如 `6 天前`，按原文显示，不启动计时器 |
| `kind` | `fact` 事实、`intent` 意图、`finding` 发现、`digest` 摘要、`goal` 目标、`note` 记录；默认 `note`，也支持自定义文字 |
| `number` | 可选的条目编号，自动加 `#` |
| `status` | `pending/open` 待处理、`active` 进行中、`confirmed` 已确认、`done` 已完成、`blocked` 已阻塞、`exhausted` 预算耗尽、`stopped` 已停止、`met` 已达成、`origin` 起点；也支持自定义文字 |
| `priority` | 可选的优先级，例如 `P1`；纯数字 `1` 也会显示为 `P1` |
| `title` | 可选的小标题，正文仍写在条目内部 |
| `details-label` | 详情展开文字，默认“查看详情” |
| `:expanded="true"` | 默认展开详情 |

默认插槽是正文，`#details` 是可选的折叠详情，支持段落、列表和代码块。没有 `#details` 时不显示展开控件。详情使用原生 `<details>`，键盘和无 JavaScript 环境均可操作。

在现有文章组件内部嵌套时，外层使用更多冒号，例如 `:::::main-content` → `::::text-timeline` → `:::timeline-item`；结束标记与各自的起始标记对应。

组件继承文章的 `--article-*` 主题变量：浅色为白底深灰文字与深青色点缀，深色为黑底灰字与薄荷青色点缀；状态文字不会只依靠颜色区分。小屏幕会把时间移到内容上方，正文和标签自动换行。
