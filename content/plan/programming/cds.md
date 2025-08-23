---
"title": "cds"
"director": "ritsu"
"time": "2025.08.22"
types: "cc"
img: "life/plan/cds/1.jpg"
info: "封面：This is cds"
client: "My"
target: 100
current: 1
displayType: "percent"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:git-info{url="https://github.com/iusx/cdx"}

最近发现了一个对我来说还挺有用的一个需求，例如每次我都需要进入到某个目录，但是每次我都是傻傻的不断用 `cd` 去进。虽说我的 neovim 可以通过 Frecency/MRU 进到最近的 project 中，以及进到该目录后运行 `nix-shell` > `nvim .` 这种很傻的操作。（但我感觉还挺有仪式感的，尤其是碰到 nixpkgs 更新）

所以我希望写一个小工具来自动帮我完成这些操作，虽然说 `zsh` 可以写脚本，但是我还是觉得写一个单独的命令出来会比较好。就当是练手了，打算使用 👑 nim 来写（顺便让我的插件支持 nim 的注释）来体验下不同的风景，看看能学到什么与众不同的，毕竟体验最重要。


::text-space
---
type: tip
---
例如把这个小工具打包上传到 apt-get、brew 甚至是 winget。可以自己第一次体验下打包到分发的乐趣，比单独写一个 zsh 脚本体验得多。
::

也就是说这个工具可以帮我记录每次 cd 的目录，以及每次进到目录执行什么命令。我的想法是可以设置成自动的，也可以设置成手动的。并且配置文件放到 `~/.cds` 中。


:text-title{t="为什么用 nim?" type="2"}

:git-info{url="https://github.com/adambard/learnxinyminutes-docs/pull/5380" type="pr"}

我对 nim 的印象完全是他的 logo 是 👑。也不算是特别小众，毕竟我看第三方的安利文竟然还提供了 Chinese（[Y分钟速成X](https://learnxinyminutes.com/zh-cn/nim/)) 比较意外的是在随便逛逛的途中还水了一个 pr（但感觉合的概率不是很大？毕竟我看 en page 被作者标注了 `or [up-to-date community version]` 也顺便借此机会给我的 blog 加了一个 git-pr 的信息展示。（感觉现在的还是太麻烦，以后打算加一个 type="pr-user" 的，直接列举我开的 pr)


::

