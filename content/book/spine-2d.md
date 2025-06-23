---
"title": "Spine 2D"
"director": "My"
"time": "2025"
img: "15/1.png"
plan: "100,100"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{:t="为什么是 Spine 2D"}
市面上同类型的产品有很多，例如 Live 2D、Pixelover、Rive 甚至是 Loongbones。有些效果 Adobe 的 AE 都可以做。但我为什么选择 Spine 2D 呢？无论如何，我看一个产品的角度是很片面的。我会从以下几点看待一个产品的实力：

1. 官网设计
2. 公司 Logo
3. 宣传物料
4. 产品打磨程度
5. 定价
6. 功能

一般的情况下，我会为设计买单。那么自然淘汰掉了 Loongbones。但根据产品的打磨程度来说，我认为 Spine 2D 是无可厚非的。三年前我有幸接触过 Spine 2D，我甚至没有学过，打开界面的那一刻。我就知道如何操作，如何做出交互、动画，骨骼的绑定。那么自然而然的，Live 2D 和 Spine 2D 会进入到我的决赛圈。

之所以最后选择了 Spine 2D，更多的是它的 runtime 以及买断的定价、产品的打磨和稳定的 Team。虽然官网不比 Live 2D 的那么商业化，显得很「技术流」。但在游戏领域积攒了很多的口碑（在 YT 和 A 站上看到了很多大佬，🇰🇷 动画真的没的说），以及 4.2 带来的物理效果无非让 Spine 2D 上了一个台阶。无论是生态上、还是定价以及产品的打磨程度。

Rive 很不错，都是很新的产品链生态，例如 Figma to Rive，而 Spine 还是 PS to Spine。Rive 的整个官网和宣发物料也很用心，特别是大量的案例和 Runtime 展示，而 Spine 有，但是很低调（官网和宣发都很低调，不如 Live 2D 和 Rive 的包装，但产品打磨的很好。）

但我最后还是选择 Spine 2D（用户体验很好，还是买断制，runtime 也比较用心，虽然不是特别新，但生态和社区还是有点活力的）

我是愿意为 Spine 2D 付费的。因为我可以做游戏素材，做动画、利用 runtime 做交互甚至是 GAME，可以接触和学习到 U3D\UE、Godot 方面的技术栈。(虽然看起来是 49 年入国军，但当一个消磨时间的爱好也挺好的，会感觉时间过的很快，在没意思的时候还可以做一些鬼畜的表情取悦自己。)


::text-space
---
type: tip
---
不过 Pixelover 好像没有 runtime 只能做动画，但 2D 和 3D 的结合还是很有趣的。

(2025-6-22 已经买了 Pixelover，看大佬说这个是转成完美像素风图片的，然后还可以做动画，骨骼甚至是 3D，唯一缺点就是有点卡)
::

之后如果有机会，我会选择购买并体验下 Pixelover，感觉潜力也是很大的）但像素类型貌似很深受某些公司的喜欢，因为 AI 生成的像素风格会天然的有遮瑕效果，并且规避画师讨伐的风险。


---

# runtime 1
:text-title{t="Spine 2D runtime"}

在此之前我们需要阅读下一些文档（Spine 2D 本地化做的挺好的，有很多 Lang。）

1. [Skeleton Viewer](https://zh.esotericsoftware.com/spine-skeleton-viewer#Skeleton-Viewer): 测试从Spine导出的skeleton数据
2. [JSON 导出文件格式](https://zh.esotericsoftware.com/spine-json-format#JSON-%E5%AF%BC%E5%87%BA%E6%96%87%E4%BB%B6%E6%A0%BC%E5%BC%8F):  Spine 2D 导出后的 Json 数据格式和介绍
3. [spine-runtimes examples](https://github.com/EsotericSoftware/spine-runtimes): 一些 runtime 例子和 README。

::text-space
---
type: tip
---
有一说一 Spine 2D 的 Runtime 是真的丰富哇，注释和文档都很全，很快就能上手了。
::

--- 

:text-title{t="bilibili 小电视练习"}
## bilibili 1

<iframe width="100%" height="815" src="https://stackblitz.com/edit/stackblitz-starters-b833pmbs?embed=1&file=index.html"  frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


不要问为什么一个注释都没有，因为我用了 [nvim.comment-hide](https://github.com/jiangxue-analysis/nvim.comment-hide) 把注释全部去掉了，只有我自己可以看到（Spine 2d 的 runtime 注释是非常多的，很方便学习）之所以是拿 bilibili 的小电视来练习。并不是我多么喜欢，多么高强度在这个地方冲浪。


::img-tip
---
url: 15/img/1.gif
text: 图 1 | Octocats 盯着你的输入框.gif（超级可爱
---
::

更多的是看到了 Github 的 Octocats 交互设计，也就是 [copilot](https://github.com/copilot) 页面下那个小章鱼盯着输入框的交互。当时的我觉得非常震撼，觉得很厉害。于是我买 spine 2D 的出发点也是实现类似的效果。（庆幸的是我实现了） 

::img-tip
---
url: 15/img/2.gif
text: 图 2 | 在很多 blog 中很常见的看板娘 
---
::

当然还有类似的效果，例如 [看板娘](https://github.com/stevenjoezhang/live2d-widget) 放到 blog，角色的表情，目光跟随鼠标的效果。之前的我看到类似的效果只知道是如何实现的，而不知道是如何做的。经过这次 Spine 2D 的学习，我已经了解了这种效果是如何实现、如果做的。通过 Spine2d runtime 让 Ik 跟随鼠标，如果点击则播放 `blink` 动画。
::
