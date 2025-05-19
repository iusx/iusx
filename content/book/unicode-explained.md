---
"title": "Unicode Explained"
"director": "Jukka K. Korpela"
"time": "2025"
img: "11/1.png"
plan: "0,71"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{t="为什么要看这本书？"}

起因是在 neovim 群中看到了群友的名字是 `panic!("")` 每次 @ 他的时候文字都会被 `""` 包裹起来。`@panic!("类似你看到的这个情况，这个问题不仅是在群组，就算在浏览器、终端环境下都是存在的。")` 实际上我并没有将文字写在 `""` 中，而是默认这样的，这个用到的就是 `U+2067` 

```
panic!("\U+2067")
```

不过 unicode 在日常生活中是经常应用的, 比如在 bilibili 就经常有用 Unicode 字符来弄一些标题，例如: 𝑾𝒆 𝑨𝒓𝒆 𝑳𝒐𝒔𝒆𝒓、𝓦𝓮 𝓐𝓻𝓮 𝓛𝓸𝓼𝓮𝓻 显得与众不同，有时候也会有歌名用 unicode 字符显得比较独特。这些都可以通过 [Unicode Text Converter](https://qaz.wtf/u/convert.cgi?text=We+Are+Loser) 来进行生成和转换。

---

# Trojan Source 1
:text-title{t="Trojan Source"}

所以我尝试 Google 了很多次，但都是搜索不到相关的，更多的是 rust 和 go 相关的结果。之后[灵云](https://github.com/liinyun)说这是 **UTF-8的奇妙魔力**，我才详细的了解了 unicode。并且找到了一个非常有趣的 CVE 编号，即 [CVE-2021-42574](https://nvd.nist.gov/vuln/detail/CVE-2021-42574) 这种类似的缺陷叫作 ["Trojan Source"](https://en.wikipedia.org/wiki/Trojan_Source)，中文直译就是 **木马来源**，泛指 **不可见的漏洞**。

维基百科的解释是："它滥用 Unicode 的双向字符来显示源代码 ，而不是源代码的实际执行。**该漏洞利用了不同阅读方向的书写脚本在计算机上的显示和编码方式。**" 根据维基百科提供的详细信息，貌似可以快速入门 unicode。但我的计划是先阅读这本书，了解 unicode 做什么，有什么用在进一步学习。

最近有了一个利用 unicode 进行供应链攻击的例子，攻击者利用 Unicode 字符插入不可见的数据，但在 Github 中看起来是和原来一样的，只是不可见。详情可以阅读 [GitHub now provides a warning about hidden Unicode text](https://github.blog/changelog/2025-05-01-github-now-provides-a-warning-about-hidden-unicode-text/)
有趣的是，这一问题导致了 Github 所有使用 Unicode 特殊字符的提交被严格限制，如果提交的信息包含 unicode code，那么会有一个警告：

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

| 字符   | 名称                                 | 类型 | bidi 类别 | 简介说明                           |
|----------|--------------------------------------|------|-----------|------------------------------------|
| u+200e   | left-to-right mark (lrm)             | cf   | l         | 插入一个不可见的 ltr 方向提示符    |
| u+202a   | left-to-right embedding (lre)        | cf   | lre       | 开始一个嵌入式 ltr 片段，需 `pdf` 结束 |
| u+202d   | left-to-right override (lro)         | cf   | lro       | 强制后续文本以 ltr 显示，需 `pdf` 结束 |
| u+2066   | left-to-right isolate (lri)          | cf   | lri       | 开始 ltr 隔离段，推荐用法，需 `pdi` 结束 |
| u+2067   | right-to-left isolate (rli)          | cf   | rli       | 开始 rtl 隔离段，推荐用法，需 `pdi` 结束 |
| u+200f   | right-to-left mark (rlm)             | cf   | r         | 插入一个不可见的 rtl 方向提示符    |
| u+202b   | right-to-left embedding (rle)        | cf   | rle       | 开始一个嵌入式 rtl 片段，需 `pdf` 结束 |
| u+202e   | right-to-left override (rlo)         | cf   | rlo       | 强制后续文本以 rtl 显示，需 `pdf` 结束 |
| u+1bc77  | duployan affix attached... (略)      | lo   | l         | 杜波洛扬速记字符，天然 ltr，可显示 |

像是 `\u5b87` 这种的，一般称之为 [UTF-16](https://en.wikipedia.org/wiki/UTF-16),在上面的 Unicode 字符中，`u2066` 这个系 [LEFT-TO-RIGHT](https://www.compart.com/en/unicode/U+2066#UNC_DB) 这个序列的，根据维基百科 [Bidirectional text](https://en.wikipedia.org/wiki/Bidirectional_text) 的介绍，这种被称之为 “双向文本”, 用于波斯语和阿拉伯语甚至是数学表达式。

由于用了 `u2067`, 这会导致渲染的时候会隔断 `🍋`，别人 @ 我的时候就会夹着消息，比如 @ 我的时候输入 Hello 就会变成：

```
@宇宙无敌柠檬王 Hello 🍋
---如果是正常的
@宇宙无敌柠檬王🍋 Hello
```

---

## 字符格式 2
:text-title{t="字符格式"}

| 字符   | 名称                                 | 类型 | bidi 类别 | 简介说明                           |
|----------|--------------------------------------|------|-----------|------------------------------------|
| u+200e   | left-to-right mark (lrm)             | cf   | l         | 插入一个不可见的 ltr 方向提示符    |
| u+202a   | left-to-right embedding (lre)        | cf   | lre       | 开始一个嵌入式 ltr 片段，需 `pdf` 结束 |
| u+202d   | left-to-right override (lro)         | cf   | lro       | 强制后续文本以 ltr 显示，需 `pdf` 结束 |
| u+2066   | left-to-right isolate (lri)          | cf   | lri       | 开始 ltr 隔离段，推荐用法，需 `pdi` 结束 |
| u+2067   | right-to-left isolate (rli)          | cf   | rli       | 开始 rtl 隔离段，推荐用法，需 `pdi` 结束 |
| u+200f   | right-to-left mark (rlm)             | cf   | r         | 插入一个不可见的 rtl 方向提示符    |
| u+202b   | right-to-left embedding (rle)        | cf   | rle       | 开始一个嵌入式 rtl 片段，需 `pdf` 结束 |
| u+202e   | right-to-left override (rlo)         | cf   | rlo       | 强制后续文本以 rtl 显示，需 `pdf` 结束 |
| u+1bc77  | duployan affix attached... (略)      | lo   | l         | 杜波洛扬速记字符，天然 ltr，可显示 |

如果只看上面的这些描述，或者说 Unicode 的标准原文。那您肯定有很多疑惑，看不懂各种缩写，感觉超级高端和高攀不起。上面图表的原文是：

```
--- LEFT-TO-RIGHT
200E;LEFT-TO-RIGHT MARK;Cf;0;L;;;;;N;;;;;
202A;LEFT-TO-RIGHT EMBEDDING;Cf;0;LRE;;;;;N;;;;;
202D;LEFT-TO-RIGHT OVERRIDE;Cf;0;LRO;;;;;N;;;;;
2066;LEFT-TO-RIGHT ISOLATE;Cf;0;LRI;;;;;N;;;;;
1BC77;DUPLOYAN AFFIX ATTACHED LEFT-TO-RIGHT SECANT;Lo;0;L;;;;;N;;;;;

--- RIGHT-TO-LEFT
2067;RIGHT-TO-LEFT ISOLATE;Cf;0;RLI;;;;;N;;;;;
200F;RIGHT-TO-LEFT MARK;Cf;0;R;;;;;N;;;;;
202B;RIGHT-TO-LEFT EMBEDDING;Cf;0;RLE;;;;;N;;;;;
202E;RIGHT-TO-LEFT OVERRIDE;Cf;0;RLO;;;;;N;;;;;
```

这些数据来自 [Unicode Character Database](https://www.unicode.org/Public/UNIDATA/UnicodeData.txt) 也就是 Unicode 字符库。这些字段结构在 [UDC:Unicode® Standard Annex #44](https://www.unicode.org/reports/tr44/#UnicodeData.txt) 中皆有说明（除非是 Unicode 相关行业的，否则需要一个一个对照。或许我会写一个转换器？)

| Project | Info | Title |
| --- | --- | --- | 
| 数据来源 | UnicodeData.txt | |
| 格式说明 | [Unicode® Standard Annex #44](https://www.unicode.org/reports/tr44/#UnicodeData.txt) | 看懂 Unicode 的神奇魔法 |
| Bidi 类别 | [Unicode® Standard Annex #9](https://www.unicode.org/reports/tr9/) |Unicode Bidirectional Algorithm 双向算法: 如何正确的显示从左还是从右到左的内容 |

由于实在是太多了，以 `200E;LEFT-TO-RIGHT MARK;Cf;0;L;;;;;N;;;;;` 为例，如果要读懂，先拆分以更好的理解：

```
                                   200E;LEFT-TO-RIGHT MARK;Cf;0;L;;;;;N;;;;;
                      Code Point-> |  200E;                                 
      Implicit Directional Marks-> +---->  LEFT-TO-RIGHT MARK;              
         General_Category Values-> +---->  Cf;                              
Canonical Combining Class Values-> +---->  0;                               
   Bidirectional Character Types->-+--+->  L;;;;;                           
                        Bidi_Mirrored +->  N;;;;;                           
```

一般需要将 #44 和 #9 切换起来查询才能理解，所以真的很需要一个转义的工具（我打算自己写一个），上面列出了一个字符格式的拆分，以及这些缩写属于那些部分的内容。一句话概述这个字符那就是：

::text-tip{type="big"}
U200E 是一个[从左到右的(格式控制字符)] 尽管自身并不显示
::

::text-space
---
type: tip
---
数据文件 UnicodeData.txt 在每条记录中定义了多个属性值。
当某个字段为空（即两个分号之间没有值）时，表示该属性使用该码点的默认值。<br><br>
The data file UnicodeData.txt defines many property values in each record.
When a field in a data line for a code point is empty, that indicates that the property takes the default value for that code point.
For example:

<code>0022;QUOTATION MARK;Po;0;ON;;;;;N;;;;;</code>
::

我知道你肯定会在意 `L;;;;;` 中为什么这么多 `;;;` 是不是有什么特殊含义？在 #44 中的 Empty Fields 部分说明了一些愿意，也就是说这些 `;;;` 空的字段默认值：

::
