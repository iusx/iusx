---
"title": "Theme: My blog"
"director": "ritsu"
"time": "2026"
img: "theme/1.png"
plan: "100,100"
---


::::::book-content{:title="title" :img="img" :by="director" :plan="plan"}

::text-title{:t="title"}
::

文章组件速查。每项附写法与效果，统一跟随黑白主题、等宽字体和青色点缀，无需手动导入。

属性写 `title="文字"` 传固定值，`:title="title"` 引用文章 frontmatter；正文放在开始与结束标记之间。嵌套时外层使用更多冒号。

## 页面结构

| 组件 | 用途与参数 |
| --- | --- |
| `book-content` | 本页布局：封面、作者、阅读进度、目录及正文。`title`、`img`、`by`、`plan`；`plan="25,100"` 表示已读 25% |
| `main-content` | 普通文章布局：标题、日期、项目及可选封面。`title`、`time`、`client`、`img`、`info`、`types` |
| `table-of-contents` | `book-content` 已自动包含；从正文标题生成可点击目录，随正文滚动高亮当前小节及所属章节，手机通过“目录”按钮打开 |

两种外层布局选一种，不需要相互嵌套：

```md
:::book-content{:title="title" :img="img" :by="director" :plan="plan"}
正文与文章组件。
:::

:::main-content{title="文章标题" time="2026.10.22" client="My"}
正文与文章组件。
:::
```

`book-content.img` 相对路径从 `/img/book/` 读取；`main-content.img` 从 `/img/` 读取。日期建议用 `年.月.日`，`types` 对应 `/img/page/标记.png`。普通文章内部自动组合 `page-title` 标题区和 `page-image` 图片区。

## 文字排版

### 标题与摘要

`text-title` 默认生成带 `#` 的二级标题；`type="2"` 为三级标题。`id` 可指定锚点。`text-sum` 用 `desc` 显示 overview 摘要。

```md
::text-title{t="标题示例" type="2" id="heading-demo"}
::
::text-sum{desc="用一句话概括文章。"}
::
```

::text-title{t="标题示例" type="2" id="heading-demo"}
::

::text-sum{desc="用一句话概括文章。"}
::

### 提示

`text-tip` 默认左侧细线；`type="big"` 改为完整边框。内容支持 Markdown。

```md
::text-tip
普通提示，支持 **重点** 和 `代码`。
::
::text-tip{type="big"}
需要强调的补充说明。
::
```

::text-tip
普通提示，支持 **重点** 和 `代码`。
::

::text-tip{type="big"}
需要强调的补充说明。
::

### 摘录

`wise-info` 显示主题、引用正文与来源；`topic`、`by` 均可省略。

```md
::wise-info{topic="阅读笔记" by="ritsu"}
把值得记住的句子留在这里。
::
```

::wise-info{topic="阅读笔记" by="ritsu"}
把值得记住的句子留在这里。
::

## 图片与画廊

### 图文注释

`img-tip` 大屏左文右图，小屏图片在上；点击可查看原图。`url` 相对路径从 `/img/book/` 读取，`text` 为图注，`alt` 为图片描述。

```md
::img-tip{url="gimp/test.jpg" text="图 1：图像修复工具对比。" alt="图像修复结果对比"}
::
```

::img-tip{url="gimp/test.jpg" text="图 1：图像修复工具对比。" alt="图像修复结果对比"}
::

### 图组

`text-space` 用 `info` 配图注、`img` 配图片；相对路径从 `/img/` 读取。多图用逗号分隔，默认轮播；`type="flat"` 改为纵向排列。

```md
::text-space{info="图 2：点击箭头或使用方向键切换。" img="book/gimp/test.jpg,book/key-note/2.png"}
::
```

::text-space{info="图 2：点击箭头或使用方向键切换。" img="book/gimp/test.jpg,book/key-note/2.png"}
::

`text-space` 也保留提示模式：`type="tip"` 时只显示正文，忽略 `info`、`img`。

```md
::text-space{type="tip"}
补充说明，与普通 text-tip 的效果相近。
::
```

::text-space{type="tip"}
补充说明，与普通 text-tip 的效果相近。
::

### 全宽图片

`text-space` 省略 `info` 后图片占满正文宽度。`page-image` 是布局与图组内部使用的图片组件，由它们自动调用。

```md
::text-space{img="book/gimp/test.jpg"}
::
```

::text-space{img="book/gimp/test.jpg"}
::

图片也可传 `/img/...` 完整路径。`img-tip.text`、`text-space.info` 支持 HTML；属性中的 `**文字**` 不会作为 Markdown 渲染。

## 信息卡片

### 漏洞记录

`cve-info` 显示编号、CWE 链接及说明。`cwe` 多个编号用逗号分隔；`to` 为编号链接；`type` 的数值 1、2、3 分别为灰色、深色、青色色标。

```md
::cve-info{cve="CVE-2022-36114" cwe="400" :type="3"}
不受控制的资源消耗。
::
```

::cve-info{cve="CVE-2022-36114" cwe="400" :type="3"}
不受控制的资源消耗。
::

### GitHub

`git-info` 在浏览器联网后加载仓库信息、Stars、Forks 和 Issues 数量。省略 `type` 显示仓库；`iss` 追加各最多 5 条打开与关闭的 Issues；`pr` 显示 URL 指定的 PR。

```md
::git-info{url="https://github.com/iusx/cdx"}
::
::git-info{url="https://github.com/jiangxue-analysis/nvim.comment-hide" type="iss"}
::
::git-info{url="https://github.com/adambard/learnxinyminutes-docs/pull/5380" type="pr"}
::
```

::git-info{url="https://github.com/iusx/cdx"}
::

## 代码块

`text-code` 把多个代码块组织成文件列表。`files` 按顺序对应正文里的代码块，支持 YAML 数组或逗号分隔；`active` 可传文件路径或序号，默认第一个。目录名会自动从路径中提取。

````md
::text-code
---
title: Rust 示例
files:
  - /src/hello.rs
  - /src/main.rs
---
```rust
// hello.rs
```
```rust
// main.rs
```
::
````

::text-code
---
title: Rust 示例
files:
  - /src/hello.rs
  - /src/main.rs
---
```rust
// 系统提供的“打印一行字符串”函数。
unsafe extern "C" {
    fn puts(text: *const core::ffi::c_char) -> core::ffi::c_int;
}

#[unsafe(no_mangle)]
#[inline(never)]
pub extern "C" fn hello() {
    // SAFETY: c"..." 提供有效、以零结尾的字符串，puts 只在调用期间读取它。
    unsafe {
        puts(c"Hello, world!".as_ptr());
    }
}
```
```rust
#[cfg(not(xollvm))]
mod hello;

#[cfg(xollvm)]
unsafe extern "C" {
    fn hello();
}

fn main() {
    #[cfg(not(xollvm))]
    hello::hello();

    #[cfg(xollvm)]
    // SAFETY: 链接的 hello 来自本示例，没有参数或调用前提。
    unsafe {
        hello();
    }
}
```
::

## 代码对照

`text-compare` 左右两栏对照代码，适合展示逆向结果与源码。内部放两个 `text-compare-side`，`title` 是栏目标题。中间分隔线可左右拖动调整宽度，双击复位；窄屏自动改为上下排列。

````md
::text-compare{title="hello 对照"}
:::text-compare-side{title="C / 伪代码"}
```c
int _hello(void) { return _puts("Hello, world!"); }
```
:::
:::text-compare-side{title="Rust / 源码"}
```rust
pub extern "C" fn hello() { unsafe { puts(c"Hello, world!".as_ptr()); } }
```
:::
::
````

::text-compare{title="hello 对照"}
:::text-compare-side{title="C / 伪代码"}
```c
int _hello(void)

{
  int iVar1;

  iVar1 = _puts("Hello, world!");
  return iVar1;
}
```
:::
:::text-compare-side{title="Rust / 源码"}
```rust
#[cfg(not(xollvm))]
mod hello;

#[cfg(xollvm)]
unsafe extern "C" {
    fn hello();
}

fn main() {
    #[cfg(not(xollvm))]
    hello::hello();

    #[cfg(xollvm)]
    // SAFETY: 链接的 hello 来自本示例，没有参数或调用前提。
    unsafe {
        hello();
    }
}
```
:::
::

## 时间线

### 手写条目

`text-timeline` 包裹 `timeline-item`。时间在左，类型、编号、状态与正文在右，`#details` 放折叠详情。

```md
::::text-timeline{title="更新记录" date="2026-10-22"}
:::timeline-item{time="16:56:06" kind="fact" number="1" status="done" priority="P1"}
完成组件整理。

#details
支持 **Markdown**，点击后查看。
:::
::::
```

::::text-timeline{title="更新记录" date="2026-10-22"}
:::timeline-item{time="16:56:06" kind="fact" number="1" status="done" priority="P1"}
完成组件整理。

#details
支持 **Markdown**，点击后查看。
:::
::::

`kind`：`fact` 事实、`intent` 意图、`finding` 发现、`digest` 摘要、`goal` 目标、`note` 记录。常用 `status`：`pending/open` 待处理、`active` 进行中、`confirmed` 已确认、`done` 已完成、`blocked` 已阻塞；也支持自定义文字。条目可加 `title`、`ago`、`datetime`、`details-label`，`:expanded="true"` 默认展开详情。

### 读取 JSON

`file` 使用 `public` 下的公开路径。支持 Artex 导出或普通条目数组；默认显示前 **5 条**，点击“显示全部”展开剩余内容。

```md
::text-timeline{title="Artex 任务记录" file="/img/book/a-fun-guide-to-exploring-binaries/artex-broadcast-task-8-20261022T055749Z-redacted.json"}
::
```

::::details
:::summary
查看 JSON 时间线效果
:::

::text-timeline{title="Artex 任务记录" file="/img/book/a-fun-guide-to-exploring-binaries/artex-broadcast-task-8-20261022T055749Z-redacted.json"}
::
::::

## 流程图

类型配色：起点蓝灰、目标薄荷青、意图淡紫、发现柔红、事实暖金、摘要鼠尾草绿；图例与节点同步，随深浅主题调整。

`text-flow` 使用黑白卡片和青色强调，支持分支、汇合与循环，连线文字默认显示。电脑端悬停节点高亮关联，单击锁定详情，单击空白或按 Esc 取消并保留视角；按住空白拖动平移。鼠标在组件内连续停留 1.3 秒后启用滚轮缩放、横向滚动或 Shift + 滚轮平移，等待期间尝试滚轮不会重新计时；移出或切换窗口后重置，重新进入或切回窗口时重新计时。移动端滑动正常滚动文章，轻点节点查看详情，通过按钮缩放。“适配”总览、“起点”返回开始。`height` 默认 `520`。

### 文字传入

`id[文字]` 定义节点，`-->` 连接，`-->|说明|` 添加连线文字。再次引用节点时只写 id；每行一条关系，`#` 开头为注释。可用 `text="a[开始] --> b[完成]"`，多行用下面的 YAML 写法：

```md
::text-flow
---
title: 发布流程
height: 420
text: |
  write[撰写笔记] --> review[校对排版]
  review -->|通过| publish[发布文章]
  review -->|调整| write
---
::
```

::text-flow
---
title: 发布流程
height: 420
text: |
  write[撰写笔记] --> review[校对排版]
  review -->|通过| publish[发布文章]
  review -->|调整| write
---
::

### 文件传入

`file` 从 `public` 读取 `.json`、`.txt`、`.mmd`；文字文件使用上面的同一种语法。JSON 支持下面的标准格式，也能直接使用已有 Artex 导出，自动读取节点、关系和详情。

```json
{
  "nodes": [
    { "id": "a", "label": "开始", "kind": "origin" },
    { "id": "b", "label": "发布文章", "kind": "goal", "status": "done" }
  ],
  "edges": [{ "source": "a", "target": "b", "label": "完成" }]
}
```

节点还可加 `priority` 和 `details: [{ "label": "说明", "text": "详情正文" }]`。`file` 与 `text` 同时传入时优先读取文件，节点文字按纯文本显示。

```md
::text-flow{title="Artex 任务关系" file="/img/book/a-fun-guide-to-exploring-binaries/artex-broadcast-task-8-20261022T055749Z-redacted.json" height="560"}
::
```

::::details
:::summary
查看 Artex 文件效果（106 节点）
:::

::text-flow{title="Artex 任务关系" file="/img/book/a-fun-guide-to-exploring-binaries/artex-broadcast-task-8-20261022T055749Z-redacted.json" height="560"}
::
::::

大图默认从起点以可读比例进入，右上角依次为缩小、原始比例、放大、适配、起点、导出透明背景 PNG 和全屏图标；悬停可查看名称与当前缩放比例。下方“文字列表”提供完整节点文本，画布聚焦后也可用方向键平移、`+` / `-` 缩放、`0` 适配。

## Markdown 与其他组件

表格会自动使用 `ProseTable`，无需手动调用；窄屏宽表可左右滑动。列表、任务清单、引用、代码块与分隔线也直接用 Markdown。

```md
| 组件 | 用途 | 来源 |
| --- | --- | --- |
| text-tip | 提示 | 手写 |

- [x] 已完成
- [ ] 待处理
```

| 组件 | 用途 | 来源 |
| --- | --- | --- |
| text-tip | 提示 | 手写 |

- [x] 已完成
- [ ] 待处理

以下组件保留写法说明：

| 组件 | 写法与当前效果 |
| --- | --- |
| `game-info` | `::game-info{img="/img/game/example.png" size="160" love="4"}`，正文放游戏短评，以 `::` 结束。背景叠加 Logo、下方五星评分；示例需自备背景及同名 `/img/game/logo/example.png`，当前缺少 Logo 资源 |
| `text-an-next` | `::text-an-next{url="/"}`，以 `::` 结束。显示“返回首页”，1 秒后自动跳首页；当前 `url` 未参与跳转，因此此页不挂载预览 |
| `todo-plan` | 目前是空组件，没有可见效果；待办可直接使用上面的 Markdown 清单 |
| `page-home` | 首页专用，使用 `::page-home` 并以 `::` 结束；显示 D3 节点图和导航，不用于正文 |

::::::
