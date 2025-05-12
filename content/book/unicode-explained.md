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

---

# 转义 3
:text-title{t="Unicode 转义序列"}

Unicode 转义序列又称之为 Escaped Unicode characters, 可以参考 [Escape character ](https://en.wikipedia.org/wiki/Escape_character) **。就是说将一个字符转义成另一个编码** 的过程, 基于 Unicode 的各种编码，可以做很多事情。这也意味着需要做很多类似转义的操作，可以用在线工具或 code lang 来完成这个过程，如使用 PY 的 [`s.encode`](https://docs.python.org/3/howto/unicode.html) 对象方法：

```
s = '你好'
unicode_str = s.encode('unicode_escape').decode()
print(unicode_str)  # 输出: \u4f60\u597d
```

之后，我们拿到 `\u4f60\u597d` 到 [CyberChef](https://gchq.github.io/CyberChef/) 来进行添加 Unicode 字符，之后将 output 结果 copy 到剪贴板中即可使用（需要添加 `Unescape string` 模块）例如：

```
\u5b87\u5b99\u65e0\u654c\u67e0\u6aac\u738b\u2067\uD83C\uDF4B
```


这是是一串 Unicode 字符，转义成字符串就是：

```
宇宙无敌柠檬王⁧🍋
```

| 字符   | 名称                                 | 类型 | Bidi 类别 | 简介说明                           |
|----------|--------------------------------------|------|-----------|------------------------------------|
| U+200E   | LEFT-TO-RIGHT MARK (LRM)             | Cf   | L         | 插入一个不可见的 LTR 方向提示符    |
| U+202A   | LEFT-TO-RIGHT EMBEDDING (LRE)        | Cf   | LRE       | 开始一个嵌入式 LTR 片段，需 `PDF` 结束 |
| U+202D   | LEFT-TO-RIGHT OVERRIDE (LRO)         | Cf   | LRO       | 强制后续文本以 LTR 显示，需 `PDF` 结束 |
| U+2066   | LEFT-TO-RIGHT ISOLATE (LRI)          | Cf   | LRI       | 开始 LTR 隔离段，推荐用法，需 `PDI` 结束 |
| U+2067   | RIGHT-TO-LEFT ISOLATE (RLI)          | Cf   | RLI       | 开始 RTL 隔离段，推荐用法，需 `PDI` 结束 |
| U+200F   | RIGHT-TO-LEFT MARK (RLM)             | Cf   | R         | 插入一个不可见的 RTL 方向提示符    |
| U+202B   | RIGHT-TO-LEFT EMBEDDING (RLE)        | Cf   | RLE       | 开始一个嵌入式 RTL 片段，需 `PDF` 结束 |
| U+202E   | RIGHT-TO-LEFT OVERRIDE (RLO)         | Cf   | RLO       | 强制后续文本以 RTL 显示，需 `PDF` 结束 |
| U+1BC77  | DUPLOYAN AFFIX ATTACHED... (略)      | Lo   | L         | 杜波洛扬速记字符，天然 LTR，可显示 |

像是 `\u5b87` 这种的，一般称之为 [UTF-16](https://en.wikipedia.org/wiki/UTF-16),在上面的 Unicode 字符中，`u2066` 这个系 [LEFT-TO-RIGHT](https://www.compart.com/en/unicode/U+2066#UNC_DB) 这个序列的，根据维基百科 [Bidirectional text](https://en.wikipedia.org/wiki/Bidirectional_text) 的介绍，这种被称之为 “双向文本”, 用于波斯语和阿拉伯语甚至是数学表达式。

由于用了 `u2067`, 这会导致渲染的时候会隔断 `🍋`，别人 @ 我的时候就会夹着消息，比如 @ 我的时候输入 Hello 就会变成：

```
@宇宙无敌柠檬王 Hello 🍋
---如果是正常的
@宇宙无敌柠檬王🍋 Hello
```

::
