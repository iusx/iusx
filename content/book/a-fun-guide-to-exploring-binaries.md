---
"title": "たのしいバイナリの歩き方"
"director": "Kenji Aiko"
"time": "2026"
img: "a-fun-guide-to-exploring-binaries/1.png"
plan: "1,100"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{:t="为什么我不学逆向？"}

在那个信息匮乏的年代，想学逆向要么啃书要么看视频。但就算是看了视频也没有什么帮助，因为涉及底层学起来还是很枯燥的，不像是 Web Security 找个靶场或者 Google 黑语法 `inurl:php? intitle:新闻动态` 就能检验最新学到的 OWASP TOP 10。跑一跑最新学到的 sqlmap。而逆向学的就多了，开始就是 IDA PRO，不像是 Burp 就一个抓包，改改参数。

随着 AI 越来越强，我自己也尝试了下 Artex，接入了 deepseek-flash。确实比我聪明和厉害许多，因为我至今从未弱密码成功过，也没进入过任何一个企业的后台，而它做到了。我下达的任务非常简单，就是 **拿下后台的管理员权限** 总共花了五块钱不到。但人总是贪心的，进入到后台后我又想获取服务器和数据库权限。但花了差不多 ¥60 仍然处于信息搜集阶段：

::text-tip
一开始我选择了 deepseek-pro 因为我觉得 pro 肯定比 flash 厉害许多，结果通过朋友得知 pro 又慢又贵还不聪明，白白浪费了 ¥49.16 大洋。
::


::text-flow{title="Artex 探索流程" file="/img/book/a-fun-guide-to-exploring-binaries/artex-exploration-graph-task-8-20261022T070916Z-redacted.json" height="560"}
::

所以在看本书之前，我会先尝试下 AI 时代特有的方式，例如 REA 和 Artex，前者针对逆向，后者则是 Web 渗透。我希望自己通过 rust 编译一个密钥发卡程序，然后连接服务器，然后加壳做一个测试 demo。看看 REA 能不能绕过我的 API 校验实现破解 Adobe 类似的效果。而 Artex 则是随便找一个生产环境进行测试。

## 简陋的发卡程序测试

在 Codex 额度充值之前，我直接 GPT-6.1 Astra Ultra 让他帮我生成一个前端 QT 后端 rust 并且加壳的 demo。一开始它选的是 [VMProtect](https://www.vmpsoft.com/) ，但是这个要花钱（不过好像一般都是用盗版的）。于是我让 GPT 帮我用开源的，它找到了 [xollvm](https://github.com/und3ath/xollvm) 有一说一才 156 个 star。

### LLVM
::
