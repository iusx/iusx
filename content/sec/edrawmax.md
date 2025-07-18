---
"title": Edraw Software Watermarking Bypass
"director": "ritsu"
description: "有时候在做流程图时需要一个好用的绘图软件。我尝试过 Draw.io、Visio、Dia、Graphviz、Umbrello、ProcessOn 等。这些软件各有特色，主要比较的是用户体验和免费程度。Edraw 早期界面像 Visio，现在融入了 Figma 等产品的交互方式。使用时发现它支持复制粘贴 SVG 数据，方便导出无水印流程图。我喜欢支持 SVG 的软件，比如 Figma 和 Illustrator。最喜欢的流程图风格是 IETF RFC 文件中的，用制表符绘制的 ASCII-Art，简洁而美观。"
"time": "2021.03.17"
"platform": "cnvd"
types: "cc"
img: "sec/04/1.png"
info: "https://www.edrawsoft.com/"
client: "Edraw Software"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:text-sum{:desc="description"}

有时候在做一些流程图时，就很需要一个上手的绘图软件，我尝试过 draw.io、Visio、dia、Graphviz、Umbrello、processon 这些比较知名且广为流传的流程图绘制程式。我认为这些程式各有特色，其中也不乏同类题材的项目，但主要比的基本上就是用户体验，和白嫖程度。

在有一段时间中，我认为其中还算可以的就是 Edraw，算是摸着 Visio 过河，刚发布的时候和其界面可以说是类似，按照现在的话来说就是致敬。但如果从现在的眼光来看的话，我更可能的会选择 draw.io

自从万兴弄了个墨刀和 pixso 以来，我感觉 Edraw 也算是把目前主流的交互方式给融合进去了，在这里能看到 Figma 和同类型产品的影子。我最初了解万兴的时候，还是一个打着数据恢复和所谓 PDF 预览起家的。随后莫名其妙上市并各种控股一些看似非常棒的项目，可谓是实打实的赶上了时代的末班车。

可见有钱了，确实从外观上就能看出和没钱时候的不同。唯一让我感觉有点无语的是，我想导出流程图的时候，竟然还有水印，挡在中间，无奈我只能花点时间去梳理导出的逻辑，发现 Edraw 竟然支持复制和粘贴 SVG 数据，而其本身的资源也都是 SVG 的，所以我通过复制，粘贴到 Figma 中导出了一个无水印的流程图。

其实我是很喜欢任何和设计有关的软件支持 SVG 的，比如我在做字体设计的时候就喜欢字体在 Figma 中绘制，然后 copy 到 Illustrator 上合并路径。


::text-space
---
img: sec/04/info/1.png
info: 图 2 ｜ 通过邮政发送的计算机软件著作权登记证书，说实话没有想象中的那么开心和愉悦，果然未曾得到的都在骚动。
---
::

很庆幸只是一个逻辑问题 CNVD 竟然给通过了[<sup>4</sup>](#refer-anchor-4)。记得当时之所以用到流程图，是在申报软著的时候，需要编写软件使用说明，由于第一次软件使用说明书写的太潦草给驳回了，所以这一次重新写了一份图文并茂的，过了很久终于通过了。

本来我以不抱任何希望，但有时候上天会开一个小玩笑并赐予希望。虽然一个软著并非什么稀奇的事情，但经历也是很重要的，让我比较惊讶的是全程并不需要多少手续和高昂的价格，仅仅是快递费而已，还是比较震惊的。和专利有太多区别了，专利缴费还是比软著高昂的，但貌似专利比软著更有含金量？

所以怪不得很多时候衡量一个企业是否是高新科技的标准专利数是其中之一，普通人拥有专利最好的方式就是炒作和流量以寻找更好的出价，但其中又要有新颖的观点、又要有较为强的营销能力，同时还要有吸引同类的体质。

每年还需要续缴，加上时间、和推广需要的各种流量包，我觉得专利这种如果说没有什么任务要弄，感觉性价比还是不高的，但你要说情绪价值，我觉得它还是很不错的，毕竟是一个经历。

::text-space
---
img: sec/04/info/2.png
info: 图 1 ｜ IETF RFC 上的流程图，通过简单的制表符表达出的一些流程信息，在 authors 中有明确的写作指南和风格。
---
::

我最喜欢的流程图莫过于 IETF RFC 文件上的，有一种朴实无华的美感，每次都很佩服通过制表符绘制出各种各样的流程图，我之前使用过 [FlowChar](https://github.com/Gusabary/FlowChar)，但我总感觉 IETF 的流程图更加的丰富。

在 RFC 中，有明确的编写指南和风格，比如 IETF 提供的 [authors](https://authors.ietf.org/) 就照顾到了[图表的表达方式](https://authors.ietf.org/diagrams) [<sup>1</sup>](#refer-anchor-1)，可以通过 ASCII-art 和 SVG 两种格式。 也就是通过 [asciiflow](https://asciiflow.com/#/) 绘制，然后转换成 ASCII-art（毕竟总不可能手动去弄这些制表符。

当然如果您觉得上述这些太过枯燥没有挑战性，不符合我们 ASCII-art 应该有的高度，也可以尝试下 [ditaa](https://github.com/stathissideris/ditaa)。如果在此之上你还有针对组件的要求，可以尝试下 [plantuml](https://plantuml.com/) [<sup>2</sup>](#refer-anchor-2)

假设还要追求在 Markdown 中无缝使用，那可以选择下 [mermaid](https://github.com/mermaid-js/mermaid) 虽然很多 Markdown 都支持，比如 Github 的 Markdown 语法，但我总感觉默认的颜色还是很有识别性的。 [<sup>3</sup>](#refer-anchor-3)

但是我最喜欢的，莫过于在 Hacker news [<sup>5</sup>](#refer-anchor-5)中发现到的 [Monodraw](https://monodraw.helftone.com/) 无论是用户体验和便携性。我认为都比上述的要好，甚至是让我感受到 Figma 的舒适性，对于一个绘制 ASCII art 图表来说，简直是一个非常好的产品。

### References

<div id="refer-anchor-1" class="ref" />

- [1] https://authors.ietf.org/diagrams

<div id="refer-anchor-2" class="ref" />

- [2] https://plantuml.com/zh/component-diagram

<div id="refer-anchor-3" class="ref" />

- [3] https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/

<div id="refer-anchor-4" class="ref" />

- [4] https://www.cnvd.org.cn/flaw/show/3173261

<div id="refer-anchor-5" class="ref" />

- [5] https://news.ycombinator.com/item?id=31891226
::
