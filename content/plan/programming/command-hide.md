---
"title": "command-hide" 
"director": "ritsu"
"time": "2025.03.31"
types: "cc"
img: "des/01/hide.jpg"
info: "封面：command-hide.vscode version"
client: "My"
target: 100
current: 99.99
displayType: "percent"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:git-info{url="https://github.com/jiangxue-analysis/vscode-comment-hide"}

:git-info{url="https://github.com/jiangxue-analysis/nvim.comment-hide" type="iss"}


我写了差不多一篇小软文，题目为 [VSCode plugin comment-hide: Dare to write comments!](https://dev.to/brights/why-doesnt-anyone-want-to-write-code-comments-anymore-40jf) 这篇文章打算投稿到 chokcoco 的 icss 前端趣闻的，但貌似大佬比较忙没时间审稿了（确信！）只好翻译成 English 发到 dev.to 上。如你所见我写了两个版本，一个是 VScode 另一个是 Neovim plugin。

::text-space
---
type: tip
---
之所以发 dev.to 很大程度上是一个账号可以刷 10 个赞，且一个 gmail 可以注册三次 DEV。风控并不是很严重，基本上很容易刷到 50 赞到社区首页。之后就会有一大堆 bot 搬到国内的内容农场（很有意思就对了）不过转化率很低，没 reddit 那么高。
::


之所以有两个版本是我中途切换到 neovim 了。因为在项目中 VScode 经常崩溃，甚至是闪退？Lsp 动不动就不起作用。只好换成了 neovim，前期用的是 Lazyvim。但用的时候发现动不动就给我报错，fzf 也一些子就各种 warnning 很烦。于是只好把 Lazyvim 删了换成了 [lazy.nvim](https://github.com/folke/lazy.nvim)。

需要什么我自己配什么，有一说一和搭积木一样，仿佛时间过得很快。参考了 [dragove/nvim/.config/nvim](https://github.com/dragove/dotfiles/tree/master/nvim/.config/nvim) 的结构，看起来就很专业，自己配的话确实很舒服，完全按照自己的需求来搭配。解决了很多 Lazyvim 会遇到的问题，如果遇到了问题还可以调试下是那个 plugin 出现的，来进行点对点的解决，不会手忙脚乱。

---

由于我自己长时间用的都是 neovim，所以 vscode 的版本被我 archive 掉了。基本上逻辑用的都是正则来进行匹配，因此移植到 neovim 上比较简单。至于为什么写这个插件，可能是抱着长时间接触 Code 做准备吧。因为 code 有注释确实能方便阅读并理解。但如果作为公开的话，雀实会发生一些问题，例如：“怎么这么简单的逻辑还要写注释！”

因此我觉得如果要公开的话，或者说每个人都能看到的话，我更希望将注释删掉。这样就可以装作很腻害的样子，注释只能自己看到。不过经历了我自己的长期使用，如果遇到类似 vue 这种一个文件有 html、css、js 的，只能处理简单的注释，比如如果在 `<template></template>` 中出现了 `<p>//</p>` 就也会被认定是注释去除。

要解决这个问题的话可能需要重构逻辑，例如对这种文件进行单独匹配，比如 vue 就需要单独调用 `js\html\css` 三个注释逻辑，而不是目前的这种：

```
vue = { multi_patterns.html, single_patterns.slash, multi_patterns.c },
```

也就是说需要 `<script>` 用 js 的注释, `<template>` 用 `html` 的注释，`style` 用 `css` 的注释，不过我目前就只遇到过一次，如果遇到四五次的话，可能会修复这个问题（毕竟改动貌似挺大的（可能我成为不了一位优秀的 Coder 是有原因的，很大一部分原因是因为我懒。

::
