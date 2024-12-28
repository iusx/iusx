---
title: GraphQL Misconfiguration in CWE-16 Github API 
description: "这是我第一次提交漏洞缺陷并且获得赏金等奖励，所以对我来说还是比较难忘的。由于我已经全身心投入到产品设计和开发中，再次发现知名公司或平台的安全漏洞对我来说就像达到了一个里程碑。"
director: "ritsu"
time: "2023.12.04"
platform: "github"
img: "02/1.png"
info: "https://hackerone.com/iepn"
types: "cc"
client: "Github"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:text-sum{:desc="description"}

我非常喜欢 GitHub Octocat，甚至有朋友用它作为头像。封面上的 Octocat 来自 [GitHub Octocats](https://octodex.github.com/)，由 [@James Kang](https://jeejkang.com/Information) 设计。您可以在 [myOctocat](https://myoctocat.com/) 创建自己的 Octocat。 2011 年，GitHub 决定是时候升级他们的吉祥物 Octocat 了。他们邀请了许多设计师来创建自己的版本，包括 [Cameron McEfee](https://cameronmcefee.com/work/the-octocat/)、[@James Kang](https://jeejkang.com/Information)、[@KimEstoesta](https://www.kimestoesta.com/) 等。

::text-space
---
type: tip
---
@Cameron McEfee：从笔记本电脑上的贴纸和衣服上的图案到酒吧墙壁、电线杆和街道标志上的贴纸，Octocat 是科技行业最知名的标志之一。
::

由 James Kang 设计的 Octocats 之一——Private Investocat，是 GitHub Security - GitHub Bug Bounty 的标志性头像。我还从 GitHub Bug Bounty 获得了 200 美元≈1,439 元人民币的漏洞赏金，这是我在安全旅程中第一次获得如此丰厚的现金奖励。

::text-space
---
img: 02/info/1.png
info: Figure 1 | I was lucky enough to receive their physical stickers and pins 13 years after they were proposed.  Their designers are @KimEstoesta and @Cameron McEfee.
---
::

可惜我的角色一直是团队里的ADC（辅助），成长缓慢，容易被单枪匹马干掉。在各个领域都有所成就，认可度有限，但缺乏影响力和坚实的项目支持。

四年前，当我意识到开发之下还有安全时，我开始慢慢向开发转型。我的一位老师曾说过，“如果你真的有天赋，就不要把时间花在应用和框架上，而应该专注于设计原理和底层逻辑。”

显然，我天赋为零，基础薄弱，一辈子也成不了大事。意识到自己的不足后，我变得不那么擅长社交，退出了所有的社区团体，专注于自我提升。然而，当我真正看到各种比赛中的优秀选手和安全专家在各种排行榜上轻松获得十几万、三十万的奖励，一个扫描器就能扫出无数个 CNVD 甚至 CVE 时，我失去了过去的自信。

渐渐地，我发现有时候你不需要漂亮的界面，不需要优雅的代码，不需要完美的逻辑处理，甚至不需要很高的安全性，你只需要一个噱头让他们知道你能行，不需要完美。我身边有很多例子，他们在发展到一定程度后，发展出一种“工匠精神”，意识到自己之前做的不够好，努力追求更高的标准。所以我一生中最敬佩的两类人，一类是已经达到或正在追求这种程度的人，一类是没有追求这种程度，一直停留在初级阶段的人。

我的第一条 GitHub PR 来自于 Node.js，三年前我还在上学。在学习 Node.js 的过程中，我了解到了 [expressjs](https://expressjs.com/)。毫无疑问，我第一次感受到了来自开源社区的热情，他们没有批评我的代码不够优雅，而是给出了建议，并告诉我如果换做是 TA，TA 会如何写 Code。
::
