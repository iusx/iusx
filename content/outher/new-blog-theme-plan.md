---
"title": "NEW BLOG THEME PLAN" 
"director": "ritsu"
description: "回顾了 Blog 的设计历程，从最初简单的布局到使用 D3.js 实现动态效果，再到探索 Spine 动画技术的可能性。作者反思了过去的“自嗨”心态，意识到技术能力的不足，但也找到了新的方向——借鉴 Pinterest 上的风格，结合手绘或约稿，利用 Spine 实现更专业的交互效果。虽然计划可能耗时较长（甚至跨年），但希望通过学习提升，最终打造一个兼具科技感和美术风格的博客，以此增强自信并摆脱“loser”心态。"
"time": "2025.07.06"
types: "cc"
img: "life/new-blog/1.png"
info: "封面：构造 SMTP 协议发送信息"
client: "My"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:text-sum{:desc="description"}

目前这个 BLOG 大概是在去年的七月份开始筹备的。总共设计了两次，第一版是一个很简单的布局，而第二版是通过 D3.JS 实现了一个类似 “心脏跳动” 的效果。但还是很制式风格，并没有什么特点。在此之前，我沉浸在自嗨的喜悦中，即使知道自己是个 loser，但依然不愿意承认自己是个 loser，每当觉得自己很 loser 的时候。


::text-space
---
img: life/new-blog/2.png
info: 图 1 ｜ 第一版和第二版的 BLOG 设计（感觉第一版还挺好看的，第二版就显得沉默寡闻了
---
::

就会打开 Figma 开始幻想自己是多么腻害，多么 niubbity。沉浸在自己幻想的世界里无法自拔，直到我开始不那么故步自封。在 loser 的这个时间段中，我知道了自己在哪些地方的不足，以及了解了新的知识，例如 spine。

spine 给我带来了一个无限可能。我可以利用 spine runtime 来实现我以前高攀不起的效果甚至是交互。主要还是自己基础不是很牢固，如果基础牢固，就不会有上面沉浸自嗨的环境中麻痹自己。

如果自己很腻害，给 apache 开 20 个 pr 就能混进 apache。给 rust-lang 开 50 个 pr 也能混进 rust。这些 pr 都不是水一个很小的问题，更多事提供 “价值”。归根结底还是自己太菜，庆幸的是自己有很多时间学习。


::text-space
---
img: life/new-blog/3.png
info: 图 2 ｜ 在 pinterest 上发现的 style，很个性，并且布局很合理。是我喜欢的类型，有 tech 的感觉。
---
::

新的 style 会增加些许自信，在觉得自己是 loser 的时候可以看看自己的 blog 安慰下自己，起码美术很好不是吗？风格我已经确定好了，就是类似 图2 的那种。可能是我自己手绘？然后自己拆分下，在放到 spine 上做动画，之后利用下 spine runtime 实现交互。

在这个过程中我可以学习到特别想学的特效。不过自己画难免会有很多问题，或许我会选择花个 1k 的预算约一个画师帮我画三视图，之后自己拆分下。总之可能需要很久才能开始这个 plan，要学的太多了，可能会在今年？明年？完成这个 PLAN？

---

最近学习到了一个新的词汇，叫 [CSS Hack](https://en.wikipedia.org/wiki/CSS_hack) 是水 AOSC 的时候在 group 上有一个大佬指出来的（很严谨，学到很多:

```
table {
  margin: 1em 0;
+ display: block;
+ overflow-x: auto;
}
```

其大概含义就是可能这么写不会生效，例如（Invalid or non-compliant CSS/Unsupported CSS）不过我 firefox 和 chrome 以及 safari 都看了一遍，确实解决了 overflow 的问题，所以我就没继续开 pr 去水（感觉老是水这种没什么意思，但又不敢水大的，一点一点水也很不错啦！毕竟 Linus 说过:

::wise-info
---
topic: The mind behind Linux | Linus Torvalds | TED
by: Linus Benedict Torvalds
---

Some of those people dont't do a lot<br>
There's a lot of people who make small,small changes,
::

在视奸其他大佬之后发现有的大佬是向往无 CSS 、无 JavaScrip 这种追求的。很明显我不是，我想要的是最终效果达到且好看和设计时一样就好了。大概率是我还停留在应用，没有深入 V8,渲染、编译这一阶段。

最近在玩 [《我在疗养院送人上西天》](https://store.steampowered.com/app/2585110/_/) 是一个推箱子玩法，据说是二消？根据我的游玩体验发现是需要用到 math 的。比如通过计算实现最小步数过关，而我没这个追求，我只想过关而已。


::wise-info
---
topic: the mind behind linux | linus torvalds | ted
by: linus benedict torvalds
---

but that's not everybody,<br>
i care about the thechnology<br>
there are people who care about the ui<br>
i can't do ui to save my life.<br><br>
i mean, if i was stranded on an island,<br>
and the only way to get off that island was the make a pretty ui,<br>
i'd die there.<br>
::

 (根据我视奸群u萌得出的一个暴论就是：前端可有可无，需要的时候直接拷打 AI)

很明显我是 "There are people who care about the UI" 的那个人。但我又有那么一点点追求，你可以说我 code ,design, security 都是 🗑 但我都有那么一点点的小成就。这又回到了我初中时纠结的一点，是走 security 还是走 code，我选择的是后者。

因为我当初梳理的结论是 design > code > security > ui 因为 security 和 ui 都是建立在 code 之下的。没有 code 怎么实现，没有实现怎么 security test。之所以没有 desing，是因为 desing 无处不在，code 也需要精心 design 否则就会难以维护。design 决定了 code 的上限与下限，同样也决定了前端的上限与下限。


::wise-info
---
topic: Frontend and backend
by: Wikipedia
---

In software development, frontend refers to the presentation layer that users interact with, while backend involves the data management and processing behind the scenes, and full-stack development refers to mastering both. In the client–server model, the client is usually considered the frontend, handling user-facing tasks, and the server is the backend, managing data and logic. Some presentation tasks may also be performed by the server.
::

前端下限低上限高——比如你写 HTML/JS/CSS 也是前端，混进了 Node.js/W3C/TC39/LWJGL 也是前端，会套个 UI 组件库用个框架也是前端；从工具链来看，有人用记事本写 jQuery，有人参与构建 Babel/Webpack；从图形技术看，有人只会 CSS 画方块，有人用 WebGL/WebGPU 开发 3D 引擎；从标准化角度看，有人只会查 MDN，有人参与 W3C 标准制定。  

同样的，design 也是下限低上限高——你 Figma 套个现成的也叫 UI design，拿了各种 IF、RED、IDEA、Core77 也叫 design；从交互设计看，有人拼凑现成组件，有人发明全新交互范式（如滑动解锁）；从设计系统看，有人用 Ant Design，有人打造 Material Design 这样的行业标准；从动态设计看，有人用 Canva 做动效，有人开发 Rive 这样的专业工具。  

::text-space
---
type: tip
---
肯定会有人觉得我是从事前端、design 的既得利益者，很可惜我并不从事这些行业，我只是当个消磨时间的爱好罢了。
::

很讨厌那些 AI 魔怔人（不过有点背后蛐蛐人的意思，但还好以后都不会遇到了），什么都 AI，真希望 AI 早点淘汰掉这些人，希望他们公司 Leader 早点意识到让 AI 取代下他们工作，再原有的基础上加个 10% 倍 KPI，狠狠替代。

~~一想到这些人会面临失业淘汰跑众包心里就舒服多了（可能有点阴暗角落老鼠思维，但好在没人看我 blog~~

可能这个现象可以用 [Dunning–Kruger effect](https://en.wikipedia.org/wiki/Dunning%E2%80%93Kruger_effect) 来解释，很爽。有时候在想，比我 niubbity 的自然会有比他 niubbity 的当球踢，比我 niubbity 没什么大不了的反正真正的大佬又不会在 Public Group 刷新，都是 LV2、LV3、LV4 的 NPC 再强不过 Top 10%,在弱不过 LV2。


::wise-info
---
topic: Dunning–Kruger effect
by: Wikipedia
---

The Dunning–Kruger effect is defined as the tendency of people with low ability in a specific area to give overly positive assessments of this ability
::

其实有时候在想。当一只井底之蛙没什么不好的，眼界高了，看的大佬们的作品之后难免会妄自菲薄？然后陷入学习循环，导致没有迈出去做的那一步，一直在学习，一直在吹毛求疵。但环境，家庭，运气和性格都是决定一个人走向的因素之一，每个人都是不同的（起码在基因上是这样）

::
