---
"title": "快捷键备忘录"
"director": "N/A"
"time": "2025"
img: "10/1.png"
plan: "100,100"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{:t="快捷键备忘录"}
快捷键是一个非常棒的一个工具，但是我很多时候可能并不会那么经常使用，但又会在需要的时候重新拾起这方面的工作。因此我会将一些比较不常用，但又可能会在未来某个时间段重新使用的快捷键记录下来。

---

# blender 1
:text-title{t="Blender"}

正如你所见这是建模工具，是不是很意外我其实也会建模，有不少项目需要 3D 的设计素材。包括在一些新兴前端项目中，可能会使用类似 Three.js 这样的技术栈，都是需要 blender 来进行配合的，虽然我一般都是 blender to spline。

| KEY | INFO | EXP |
| --- | --- | --- |
| Shift+D | 复制对象 | |
| F2 | 重命名 |  |
| Control/Ctrol + I | 遮罩反转 | |
| M | 遮罩 | |
| Control/Ctrol + Space | 全屏窗口 | |
| / | 单独显示当前 3D 资源 | |
| N | 集合节点命名 tag | |
| Control/Ctrol + B | 倒角 | |
| M | 将选中的对象移动到某个集合中 | |
| Command+L | 关联/传递数据 | 将颜色关联到五个对象中 |
| Command+a | 应用 | 如果改变了大小没有应用缩放，那么可能在 Shading 中无法显示 |
| / | 单独查看 | 如果全选可以全部查看 |
| N | 显示、隐藏侧栏 | |



---

# neovim 2
:text-title{t="Neovim"}

我之所以用 Neovim 当自己主要的编辑器，很大一部分原因是因为：“差生文具多” 这句话。其次是各种 Buff 叠加。自从使用 Neovim 作为主要的 Code 工具后发生了很多改变，比如接触到了很多 LSP，以及 Lua 相关的知识，甚至是 vim （在此之前我几乎认为 vim 只是个臭编辑文件的，没想到他抽象了很多系统层面的东西，可以更好的编写扩展，类似 Low code？）

其次是记住了很多快捷键，以及命令，确实增加了一些效率。而且赏心悦目。目前我使用的是 Kitty + Neovim。由于 Kitty 不支持 Iterm2 的 Quake (全局热键召唤终端，听起来就很厉害), 所以我也搭配使用了 Hammerspoon，可以通过 `control+a` 来进行显示和隐藏 kitty，很舒服：

```
hs.hotkey.bind({"ctrl"}, "a", function()
    local appName = "kitty"
    local app = hs.application.find(appName)

    if app then
        if app:isFrontmost() then
            app:hide()
        else
            app:unhide()
            app:activate()
        end
    else
        hs.application.launchOrFocus(appName)
    end
end)
```

同时我还开启了 Kitty 的 `cursor_trail` ，可以让光标更加的丝滑，动画效果很好看。增加了一些 Buff。我觉得坚持使用 Neovim 的很大一部分原因是叠加了很多 Buff。诸如：Tech style 确实如果要定制一款自己用的舒服的 Neovim 需要一点时间。比如可以了解到 LSP（我理解的就是 Code 补全），以及很系统层面的（做插件需要用到）

之所以将 Neovim 作为封面，因为似乎我花在上面改颜色的时间很长（当然后面可能会写一些插件，比如将我之前写的插件从支持 vscode 到支持 neovim 也说不定。）总之比我花在 Linux 定制桌面的时间要长（i3 真的很帅，很有一种 Tech style）


---

我 Neovim 的开屏封面是一个 ASCII art 风格的一个曲线。只是随便 copy 的，感觉很有意境？或者很简洁也很好看。但 [Hank](https://github.com/HCHogan) 说这个曲线很像目前在学的电力系统相关的概念：

```

     .-.                                                  
    /   \         .-.                                     
   /     \       /   \       .-.     .-.     _  _         
+-/-------\-----/-----\-----/---\---/---\---/-\-/-\/\/--- 
 /         \   /       \   /     '-'     -'               
/           '-'                                           

```

在电力系统中，这个曲线相当于一个 “同步振荡”，这个曲线表示的就是发电机受到干扰以后能不能自己恢复稳态，即：当一个同步发电机受到扰动（如短路、电压跌落或频率波动）后，它的转子角是否能回到一个稳定的平衡位置。

如果能回到原来的状态，那叫做暂态稳定或小干扰稳定性（small-signal stability）。如果不能，那就是发电机失步（loss of synchronism），系统可能面临崩溃风险。

---

## highlight 2
:text-title{t=":highlight" type="2"}

虽然 Neovim 本身的配色方案很少，但加入了一些插件，配色方案很容易到 99999, 因此就需要 [highlight](https://neovim.io/doc/user/syntax.html#_13.-highlight-command) 来查询一些颜色。之后我会用 ` vim.api.nvim_set_hl` 无情的将他替换掉。(因为我使用的是 [nvim-noirbuddy](https://github.com/jesseleite/nvim-noirbuddy) 也就是极简颜色，就一两个颜色，所以需要一个一个改（相当于自己做了个配色主题？)

::img-tip
---
url: 12/1.png
text: 由于我是双向识别障碍+色盲，所以在颜色很多的地方会感觉大脑凌乱，刚好 nvim-noirbuddy 这种单色的主题可以让我看清楚字。
---
::

```
local noiropts = {
  preset = "minimal",
  colors = {
    primary = "#00D9BD",
    background = "#000000",
  },
}

return {
  {
    "jesseleite/nvim-noirbuddy",
    dependencies = {
      "tjdevries/colorbuddy.nvim",
    },
    lazy = false,
    priority = 1000,
    config = function()
      require("noirbuddy").setup(noiropts)
    end,
  },
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = function()
        require("noirbuddy").setup(noiropts)
        vim.api.nvim_set_hl(0, "CursorLineNr", { fg = "#00D9BD", bold = true })
        vim.api.nvim_set_hl(0, "WinSeparator", { fg = "#323232", bg = "NONE" })
     end,
    },
  },
}
```

## Substitute 2
:text-title{t="Substitute" type='2'}

其实看 [Substitute](https://neovim.io/doc/user/change.html#%3Asubstitute) 原文就挺好的，但是我太懒了，English 很弱鸡。所以我的理解 `:s` 就是将这个用于全局替换。

```
:[range]s[ubstitute]/{pattern}/{string}/[flags] [count]
```

虽然有很多参数，但我常用的就两个：

```
:%s/foo/bar/g
---
:%g/foo/d
```



::
