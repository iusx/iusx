---
"title": "Seven Languages in Seven Weeks"
"director": "Bruce A. Tate"
"time": "2025.01.08"
img: "08/1.png"
plan: "01"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{:t="回顾下自己的十年经历"}

# 总结自己 0

如果从 2015 那个对计算机懵懂的我来说，到 2025 年已经过了十年。可以说对计算机方面拥有了十年的兴趣。假如从 2018 我第一个漏洞算起，至今已经过了七年。再从 2020 我打算学习设计开始，已经过了五年。

我觉得自己有很大的缺陷，基础不是特别牢固。之前做全栈的时候就有朋友指出我的基础不是特别好，最常说的话就是：“基础不牢，地动山摇”。做出的项目只是看起来很不错，但如果深挖细节，性能的处理就有一小部分的问题。虽然我总以 "安全爱好者" 作为 title，但我貌似并没有发现过比较知名且威胁较大的漏洞。

更不用说什么 EDUSRC、MSRC、TSRC 这些了，仅仅是公益 SRC 和 CNVD 以及 Hackerone 这些，我所发现到的或提交的更多是大佬吃剩的边角料，甚至是不屑一顾的。但我之前缺奉为瑰宝，以筑起我那脆弱且不堪一击的自信。

我还是比较庆幸自己无论做什么起码都能有一点成就的。虽然这个成就不高，但足以出去找个班上不至于饿死。做设计会有很多朋友支援下我;做安全拿到了漏洞赏金（虽然不多）;做全栈起码能混到小公司 offer；做舆情分析的时候，能被专业的人发现，引导我继续做下去。所以我还是比较幸运的，起码有点东西，虽然不多。

看完这本书后，我觉得是时候筹备下我的代表作了。因为之前很多人觉得我是臭做设计的，甚至还有人说我是个臭美工！完全无视掉了我全栈和安全架构方面的才华。所以在这之后，我会筹备一个全栈的代表作；另一个是安全架构的代表作。至于设计的代表作已经有了，再往后无非是作品。我觉得代表作这个东西首先是能给人用的，其次才是给人看的；这样说服力大一点。

之所以看这本书。首先是我觉得自己 Code 方面还是比较有问题，写 Code 总是很磨叽，和那种一写 code 就是写一天的有很大的差距。其次是我承认是被这本书的标题所吸引，作者懂不懂语言不重要，但他一定懂营销。我还不知道这本书有没有被 Percipio 收入，反正我 ACM 会员资格是到期了。这里我想吐槽下 ACM 的续费规则，我有钱的时候是想提前续费的，但 ACM 只能是快过期的时候才能续费。等真快过期的时候，我反而没钱续费了。

无奈只能找盗版 PDF 来看。这里强烈推荐 [Skip](https://skim-app.sourceforge.io/) 我觉得作为一款 PDF 阅读器来说，做到了快、文字能复制、复制的文字和 PDF 内容是一样的这种难度比较高的水准。甚至还是开源的，简直真的是太伟大了。我用过比较多的 PDF 阅读器，比如 Adobe Acrobat、PDF Expert。甚至是 福昕 PDF ，WPS PDF，给我的感觉都是卡顿还有比较大的复制问题，就是复制的文字和 PDF 里面的文字不一样。

和 Chrome 等浏览器自带的 PDF 阅读器比我认为无非是多了个签名和画线、笔记类的扩充。忘记了阅读的这第一要素，特别是像我这种 English 比较差需要 Copy 文字翻译的，比较不由好。所以对于 Skip 我是强烈推荐的。

---


:text-title{:t="前言"}

# 前言 2

又到了一个非常具有代表性的篇幅，也就是：“What Readers Are Saying About Seven Languages in Seven Weeks” 你会看到国内那种类似 xxx 专家，xxx 公司 xxx 总监 xxx 团队 xxx 实验室对某本书的友情肯定和推荐。你别说你还真别说，如果这本书讲的是思维逻辑和拆解，那确实是很不错的。但如果是技术性的，那可能从 2010 年发售至今 2025 年历经十多年的发展，技术也可能会淘汰，语法可能会变，但逻辑和思维，依然是那套惯式。

在这本书的前言中，作者透露出在 2009~2010 的时间段经历了很多人生的体验。例如他那 40 多岁的弟弟经历了心脏搭桥手术；三月底，他的妹妹确诊的乳腺癌；同月，他的母亲确诊晚期癌症。短短几天就去世了。

在这期间内，作者虽然伤心欲绝。但他回想起母亲的点点滴滴，与母亲的每次相处，特别是在作者离家前上了母亲的几节美术课，虽然作者的画很糟糕。但母亲总能将破碎不堪的画幅玩就回来成为一件精美的艺术作品。这需要天赋和经验才能将一副处在崩溃边缘的画作挽救回来。

不知你是否接触过绘画、美术。在我初中最后一年时，我因成绩垫底转到了美术班，我比较遗憾没有接触到绘画的全过程。绘画这门艺术，你需要经历过前期的 **构图、草稿、描边、上色、光影** 如果你是素描类的作品，还需要经历前期的封边到最后将美纹纸胶带撕下的过程。在作画前期，你需要构思好要画什么，然后通过一些技巧完成构图。比如透视、人体结构等。然后就是用铅笔打草稿，打草稿的过程要求一笔带过，如果不能一笔，那就需要勤加练习。所以在美术课中你会看到一开始要求画线，无论板绘还是素描都是这样。

::text-tip
美术一般讲究人较多，水彩纸要用 Arches、素描纸要用 Canson、铅笔要用 Marie's，高级点的铅笔还有 Derwent。水彩颜料要用 Winsor & Newton、白夜，一张不起眼的纸每张也许都是几块钱的。
::

学会画线后，就需要学会光影。光的照射范围和影子，在素描中，只有黑色和白色，因此需要用到擦纸笔甚至可塑橡皮来实现。当然有些功力比较深的喜欢用手进行擦来延续黑色。

如果你是走那种水彩、或者板绘，数字传媒的。可能会经历构图、草稿、描边的这个过程。然后就是上色、光影的应用。所以这个阶段，就和开发很类似。前期实现一个功能，然后用一个简陋的 GUi 进行交互。后期再将 GUi 进行美化和布局的排列。那么恭喜你，你已经成为了一个优秀的 Web 开发工程师，俗称前端。

但对于后端，更多的是 code 和 code 之间功能的划分，每个 code 负责不同的功能，最后连点成线，打通 API 和 GUI 之间的联系。组成一个能跑的 base 或 GUI 程序，或者输出一个接口作为 API。那么恭喜你，你成为了软件开发工程师或后端工程师。

一个简简单单的前言，就透露出作者对于软件设计和软件工程的功底。即使过了十多年，这套逻辑和拆解也亦然可以套在现代软件工程中，如果读者理解过 MVC 架构，那简直就是异曲同工。

::text-tip
When I told my mother that I would dedicate this book to her, she
said that she would like that, but she had nothing to do with com-
puters. That is true enough. The very thought of Windows would leave
her helpless. But Mom, you have had everything to do with me. Your
well-timed words of encouragement inspired me, your love of creativity
shaped me, and your enthusiasm and love of life guide me even now.
As I think about these experiences, I can’t help but feel a little better
and a little stronger because I, too, am a canvas shaped by the master.
This book is dedicated with love to Lynda Lyle Tate, 1936–2010.
::

所以在前沿的结尾，作者说目前对作者的影响很大。这无关他的目前连 Windows 都不会用，而是传授给了儿子拆解的艺术。看一个产品如果从成品看肯定是高攀不起的，但如果一步一步的拆解，一个一个的功能实现，就会发现也不是那么的特别高攀不起。

---

:text-title{:t="作者的致谢"}

在致谢阶段，作者展示出了这本书的含金量，甚至比开篇那几位挂名推荐的还重量级。首先映入眼帘的是 Ruby community：

1. [松本行弘(Matz)](https://ja.wikipedia.org/wiki/%E3%81%BE%E3%81%A4%E3%82%82%E3%81%A8%E3%82%86%E3%81%8D%E3%81%B2%E3%82%8D) 他最著名的是 Ruby 编程语言及其原始参考实现 Matz 的 Ruby 解释器的首席设计师；

2. [Charles Nutter](https://github.com/headius) —— [Jruby](https://en.wikipedia.org/wiki/JRuby) 的作者之一，能在 Java 和 Ruby 代码之间进行完全双向访问（类似于 Python 语言的 Jython ）。

3. [Evan Phoenix](https://github.com/evanphx) —— [Rubinius](https://en.wikipedia.org/wiki/Rubinius) 的作者；旨在 “为运行 Ruby 代码提供丰富、高性能的环境” 

4. [Tim Bray](https://en.wikipedia.org/wiki/Tim_Bray) —— 原始 XML 规范的共同作者之一;

我之前浏览过 [Ruby China](https://ruby-china.org/)，那时候我有一个对 Ruby 的问题。但 Ruby China community 有一个会员限制。注册完需要三个月后才能发帖或发消息，结果就是一天后我的问题被我自己解决了，之后我就再也没有浏览过这个社区。

接下来的就是 Io community, 并不是国内 IO 竞赛的那个 IO。而是 Io Programming Language：

1. [Jeremy Tregunna](https://github.com/jeremytregunna) —— [ioLang](https://github.com/jeremytregunna) 的作者之一;Io 的目标是探索概念统一和动态语言，因此权衡往往倾向于简单性和灵活性而不是性能。

2. [Steve Dekorte](https://github.com/stevedekorte) —— Iolang 的作者之一；Iolang 于 2002 年创建，当时他试图用他的语言 Cel 来帮助朋友 Dru Nelson。他发现自己确实不太了解语言的工作原理，并开始编写一种小型语言来更好地理解问题。(ps: 我什么时候才能拥有这样的好朋友)

光从描述，我已经对 Iolang 开始有兴趣了，特别句尾处的: "You captured the imagination of the beta readers and cre-
ated the favorite language of many of them.(您俘获了测试读者的想象力并创造了许多人最喜欢的语言。)"

Iolang 作为动态语言，在类型阶段就比较宽松，比较灵活，例如:

```
x = 42        # 整数
x = "Hello"   # 重新赋值为字符串
```

而静态语言呢，类似 Typescript 这种类型比较强硬的：

```
let x: number = 42;
x = "Hello"; // 编译错误：类型不匹配
```

当然他们各具特点，灵活性、性能各有千秋，适应的项目需求也不同，有的适合大型的，多人合作开发，有的适合写个脚本或前期功能论证阶段的原型设计。动态语言的刻板印象就是 易上手、Code 简洁、类型宽松、快速开发、运行时发现等作为优点。我们列举几个常见的静态和动态语言：

| 动态语言 | 静态语言 |
| --- | --- |
| Python | C/C++ |
| Ruby | Java |
| JavaScript | Go |
| PHP | TypeScript |
| Lua | Rust |
| Io | Swift |

* 相信能在 Wikipedia 中留名的各位英杰的实力。

::
