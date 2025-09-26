---
"title": "cds"
"director": "ritsu"
"time": "2025.08.22"
types: "cc"
img: "life/plan/cds/1.jpg"
info: "封面：This is cds"
client: "My"
target: 100
current: 20
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

另一个很大一部分是因为我还挺想看看不是那种特别火热的语言体验（总体来说还挺好，意外的丝滑）另一部分是体验感很像是 py，确实如 nim website 所说：“It combines successful concepts from mature languages like Python, Ada and Modula.”

---


:git-info{url="https://github.com/ajeetdsouza/zoxide"}

基本的功能实现的差不多了，学到了很多有用的知识，体验了很多。不过貌似基础的功能 [zoxide](https://github.com/ajeetdsouza/zoxide) 已经实现了。（这就是作为井底之蛙的好处，如果我知道了 zoxide 已经能实现我想要的了，我就不会自己去写，自己去体验）不过 zoxide 雀实很不错，例如他有 Tui，而我还是傻傻停留在字符串输出的表现形式。

```
~ [ cd Code/My/iusx                                                                                                              ] 3:51 PM
My/iusx [ cds save iusx                                                                                                   main * ] 3:52 PM
Saved path 'iusx' -> /Users/uwu/Code/My/iusx
My/iusx [ cds list                                                                                                        main * ] 3:52 PM
iusx -> /Users/uwu/Code/My/iusx
My/iusx [ cd ~                                                                                                            main * ] 3:52 PM
~ [ cds iusx                                                                                                                     ] 3:52 PM
My/iusx [                                                                                                                 main * ] 3:52 PM


~/.cds_config.json:
{
  "iusx": "/Users/uwu/Code/My/iusx"
}
```

尽管如此，zoxide 的确很出色，例如它提供了 TUI 界面，而我目前仍停留在仅通过字符串输出展示信息的方式。所以，我也希望在未来对项目进行如下优化：

- [ ] 1. TUI：例如 `c list` 时候可以检索快捷方式
- [x] 2. 通过 `c c iusx` 进入到目录之后自动执行记录在 `~/.cds_config.json` 中的脚本命令
- [x] 3. Auto: 可以自动记录，例如 `/Users/uwu/Code/My/iusx` 的时候自动记录 `iusx: /Users/uwu/Code/My/iusx` 

要做到上述功能需要配合 shell 环境，不过在此之前我希望将 TODO 2~3 完成后打包到 Homebrew，这样就可以通过 `brew install cds` 来进行安装了（貌似应该写一个安装脚本？。

其实依赖 shell 环境也没什么的，毕竟连 Nim-lang 的 [choosenim](https://github.com/nim-lang/choosenim) 在安装完后也需要手动设置不是吗？

```
choosenim-init: ChooseNim installed in /Users/uwu/.nimble/bin
choosenim-init: You must now ensure that the Nimble bin dir is in your PATH.
choosenim-init: Place the following line in the ~/.profile or ~/.bashrc file.
choosenim-init:     export PATH=/Users/uwu/.nimble/bin:$PATH
```

有时候就是这样，只有自己亲身体验才能体会一些奇妙的感觉。也就是踩坑，而不是照着答案去答题。最近看的 《心灵捕手》和 《萨利机长》刚好有这个情景，印象深刻的是《心灵捕手》中的一段对话：


::wise-info
---
topic: 知识与体验的区别
by: 心灵捕手
---
You've never been out of Boston.

> Nope

So if l asked you about art, you'd probably give me..
the skinny on every art book ever written

Michelangelo. You kno a lot about him.
Life's work. Political aspirations. Him and the pope.

Sexual orientation. the whole works, right?

I bet you can't tell me what it smells like
in the Sistione Chapel

You never actually stood there
looked up ar that beautiful ceiling.

Seen that
::

有的时候就是这样，例如将 Linus 作为主系统自然就会学习到很多与其相关的知识。游玩 Minecraft 之后自然会想要知道光影、Mode、材质是怎么制作的，甚至与好友公共游玩他人服务器的时候脑海中也会浮现出：“我也想开一个服务器” 的这种想法，自然而然的就能接触到 Linux、Windows server，甚至是 Java。



:text-title{t="实现自动记录" type="2"}
要实现这个功能，需要使用到 `dirs`，算是内置命令。例如在 [zsh](https://zsh.sourceforge.io/Doc/Release/Shell-Builtin-Commands.html#Directory-Stack) 和 [bash](https://www.gnu.org/software/bash/manual/html_node/Directory-Stack-Builtins.html) 中均有记载，效果还是很不错的：

```
macOS My/iusx ‹main*› » dirs
~/Code/My/iusx
macOS My/iusx ‹main*› » cd ~/Code/Project/company
macOS Project/company » dirs
~/Code/Project/company ~/Code/My/iusx
macOS Project/company »
```

唯一可惜的是只记录当前 shell 会话的目录栈，关闭终端或 shell 会话后就会丢失。因此还需要 shell 环境配合，最终效果就是每次 `cd` 目录的时候都会存储到 `~/.cds_config.json`:

```
{
  "iusx": {
    "path": "/Users/uwu/Code/My/iusx",
    "commands": [
      "nix-shell"
    ]
  },
  "My": {
    "path": "/Users/uwu/Code/My",
    "commands": []
  },
  "dotfiles": {
    "path": "/Users/uwu/Code/My/dotfiles",
    "commands": []
  },
  "config": {
    "path": "/Users/uwu/Code/My/dotfiles",
    "commands": []
  },
  "cds": {
    "path": "/Users/uwu/Code/My/cds",
    "commands": []
  }
}
```

但是这就会产生一个问题，之后我还需要 TUI 来进行快速访问，例如我进行了如下的操作：

```
macOS My/cds ‹main*› » cd ~
macOS ~ » cd development/flutter/dev
macOS flutter/dev » pwd
/Users/uwu/development/flutter/dev
macOS flutter/dev ‹stable› » cd bots
macOS dev/bots ‹stable› »
```

你会发现我在当前目录什么都没做，只是单纯的浏览，还是被记录下来了，而且很繁杂，几乎每次 cd 的停顿都会被记录：

```
  "dev": {
    "path": "/Users/uwu/development/flutter/dev",
    "commands": []
  },
  "bots": {
    "path": "/Users/uwu/development/flutter/dev/bots",
    "commands": []
  }
```

为此我增加了一个逻辑，也就是每次在当前目录执行命令，权重 `score` +1, 这会方便之后的 TUI 的数据展示，权重越高的越在前面，甚至还有升序降序:

```
{
  "iusx": {
    "path": "/Users/uwu/Code/My/iusx",
    "commands": [
      "nix-shell"
    ],
    "score": 12
  },
  "My": {
    "path": "/Users/uwu/Code/My",
    "commands": [],
    "score": 5
  },
  "cds": {
    "path": "/Users/uwu/Code/My/cds",
    "commands": [],
    "score": 2
  },
  "video": {
    "path": "/Users/uwu/Work/video",
    "commands": [],
    "score": 2
  },
  "company": {
    "path": "/Users/uwu/Code/Project/company",
    "commands": [],
    "score": 2
  }
}
```

不过这些都是通过 shell 实现的，之后可能还需要写一个 Install 的脚本，毕竟连 zoxide 也是这么做的， [src/shell.rs](https://github.com/ajeetdsouza/zoxide/blob/main/src/shell.rs) 写的非常全，不过我貌似只是为了自己用，所以我自己用的舒服就好了，不需要考虑兼容下的问题？（或许吧:

```
make_template!(Bash, "bash.txt");
make_template!(Elvish, "elvish.txt");
make_template!(Fish, "fish.txt");
make_template!(Nushell, "nushell.txt");
make_template!(Posix, "posix.txt");
make_template!(Powershell, "powershell.txt");
make_template!(Tcsh, "tcsh.txt");
make_template!(Xonsh, "xonsh.txt");
make_template!(Zsh, "zsh.txt");
```

::

