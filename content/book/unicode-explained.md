---
"title": "Unicode Explained"
"director": "Jukka K. Korpela"
"time": "2025"
img: "11/1.png"
plan: "0,71"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{t="为什么要看这本书？"}

起因是在 neovim 群中看到了群友的名字是 `panic!("⁧;("` 每次 @ 他的时候文字都会被 `""` 包裹起来。类似你看到的这个情况，这个问题不仅是在群组，就算在浏览器、终端环境下都是存在的。实际上我并没有将文字写在 `""` 中，而是默认这样的。

不过 unicode 在日常生活中是经常应用的, 比如在 bilibili 就经常有用 Unicode 字符来弄一些标题，例如: 𝑾𝒆 𝑨𝒓𝒆 𝑳𝒐𝒔𝒆𝒓、𝓦𝓮 𝓐𝓻𝓮 𝓛𝓸𝓼𝓮𝓻 显得与众不同，有时候也会有歌名用 unicode 字符显得比较独特。这些都可以通过 [Unicode Text Converter](https://qaz.wtf/u/convert.cgi?text=We+Are+Loser) 来进行生成和转换。

---

# Trojan Source 1
:text-title{t="Trojan Source"}

所以我尝试 Google 了很多次，但都是搜索不到相关的，更多的是 rust 和 go 相关的结果。之后一位群友说这是 **utf-8的奇妙魔力**，我才详细的了解了 unicode。并且找到了一个非常有趣的 CVE 编号，即 [CVE-2021-42574](https://nvd.nist.gov/vuln/detail/CVE-2021-42574) 这种类似的缺陷叫作 ["Trojan Source"](https://en.wikipedia.org/wiki/Trojan_Source)，中文直译就是 **木马来源**，泛指 **不可见的漏洞**。

维基百科的解释是："它滥用 Unicode 的双向字符来显示源代码 ，而不是源代码的实际执行。**该漏洞利用了不同阅读方向的书写脚本在计算机上的显示和编码方式。**" 根据维基百科提供的详细信息，貌似可以快速入门 unicode。但我的计划是先阅读这本书，了解 unicode 做什么，有什么用在进一步学习。

有趣的是，这一 CVE 影响了类似所有使用 Unicode 规范的环境，例如 Github。如果提交的信息包含 unicode code，那么会有一个警告：

::text-tip{type="big"}
This diff contains bidirectional Unicode text that may be interpreted or compiled differently than what appears below. To review, open the file in an editor that reveals hidden Unicode characters. [Learn more about bidirectional Unicode characters](https://github.blog/changelog/2021-10-31-warning-about-bidirectional-unicode-text/)
::

::
