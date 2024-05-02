---
title: GraphQL Misconfiguration in CWE-16 Github API 
description: "这是我第一次提交漏洞获得赏金和周边奖励的漏洞，所以我印象深刻。自我全身心投入产品设计和开发以来，再一次发现较为知名厂商或平台的安全缺陷，可以当做是我的里程碑。"
director: "RHYME.Q"
time: "2023.12.04"
type: "github"
img: "02/1.png"
info: "https://github.com/"
types: "cc"
client: "Github"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:text-sum{:desc="description"}

我很喜欢 Github 的章鱼猫，我也遇到过身边有好友将章鱼猫当做自己的头像来使用。封面上的章鱼猫来自 [GitHub Octocats](https://octodex.github.com/) 他的设计师是 [@James Kang](https://jeejkang.com/Information)，您可以在 [myOctocat](https://myoctocat.com/) 中创建属于自己的章鱼猫。

在 2011 年中，GitHub 决定是时候升级他们的吉祥物 Octocat 了,所以 Github 邀请了很多设计师对章鱼猫进行创作，如 [Cameron McEfee](https://cameronmcefee.com/work/the-octocat/)、[@James Kang](https://jeejkang.com/Information)、[@KimEstoesta](https://www.kimestoesta.com/) …… 等

::text-space
---
type: tip
---
@Cameron McEfee: 从笔记本电脑上的贴花和衣服上的图形，到每个酒吧墙上、电线杆和街道标志上贴的贴纸，GitHub 的吉祥物 Octocat 是科技行业最知名的符号之一。
::

其中 James Kang 设计的章鱼猫之一的 Private Investocat 作为 Github Security - GitHub Bug Bounty 的标志性头像。

同时我还收获到了来自 Github Bug Bounty 的 $200 USD ≈ 1,439 CNY 漏洞赏金，是我在安全道路中，第一次获得如此高昂的现金奖励。

::text-space
---
img: 02/info/1.png
info: 图 1 | 我很幸运在他们立项后的 13 年后，获得了它们的实体周边贴纸和胸针。他们的设计师是 @KimEstoesta 和 @Cameron McEfee
---
::

可惜我的定位一直就是团队中的 ACD（辅助）成长缓慢容易给单杀。属于多领域都有一定的建树和少数认可，但并没有较大的影响力和完善的项目支撑。

自四年前意识到安全是基于开发之下的存在后，我便开始尝试慢慢往开发方面转型，曾经我的老师之前说过：“如果真的有天赋，那不应该将时间投入到应用和框架当中，应该聚焦原理和底层逻辑的设计”。

很明显我属于任何天赋为 0，基础薄弱，一生中无法有较大的成就。在我认识到自身的差距以后，我开始变得不善于与人交谈，退出了所有社区群组，慢慢提升自己。

但等我真正见识到那些在各项比赛中大放异彩的选手后，以及在各类排行榜轻松拿下 10W、30W 奖励赏金的安全专家后，我开始没了当年的自信。

慢慢的我意识到，有时候也许并不需要很好看的界面、很优雅的 Code，很完美的逻辑处理甚至是低的安全性，只需要一个噱头而已，让他们知道你可以就行了，并不需要做的很完美。

我身边有很多例子，在发展到一定程度后，就会产生一种 “工匠精神”，开始意识到之前做的并不好，因此追求更高的标准。

因此我一生中最敬佩的只有两种人，一种是追求这种境界成功的或正在追求这种境界的。而另一种是没有追求这种境界的，一直停留在最开始阶段的人。

::text-space
---
img: 02/info/2.png,02/info/3.png
info: 图 2 | 我的第一个 pr 和来自 gitroll 的分析（我个人认为是有点虚高了的，但如果算上综合实力，还算正常。
---
::

我的第一份 Github Pr 来自三年前的 Node.js,当时我还在学校。学习 Node.js 途中认识到了 [expressjs](https://expressjs.com/)。毫无疑问的说，我第一次感受到来自开源社区的热情，并不会因为我 code 写的不那么优美而点评，反而会给出 TA 们的建议和如果是 TA，TA 会怎么写这段 code 的。

值得庆幸的是，最近 Twitter 上火起来了 Github 的评分画像，我的 gitroll 是 8.97。我并不觉得这个衡量标准很权威，甚至不应该被用作衡量一个人的 code 水平，但。将 gitroll 提升到 9 甚至是接近 10，还是有一定的意义所在的。
::