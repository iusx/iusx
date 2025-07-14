---
"title": "System config"
"director": "MY"
"time": "2025"
img: "17/1.png"
plan: "100,100"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{t="Nix"}
# 为什么用 Nix? 2

也是视奸 群u萌 看到的，了解了下发现是 2003 年就开始发布了，至今已经 22 年了。（第一印象还以为是一个发行版，确实有，[NixOS](https://nixos.org/)）。再看看自己的系统环境确实有点乱，于是就有了重装系统的念头。新的系统毫不犹豫就用上了 Nix，不过我用的是 [DeterminateSystems](https://github.com/DeterminateSystems/nix-installer) 家的（好像是对 macOS 有优化？）个人感觉 Nix 貌似还挺成熟了，我看很多 community contributor 都是 [tweag](https://www.tweag.io/) 的员工？


::text-space
---
type: tip
---
记录一些自己常用的（用的时候可以翻翻
::

| command | info | e.g |
| --- | --- | --- |
| nix-shell | 创建一个隔离环境 或是 **以使用声明式配置文件创建可重现的 shell 环境** | nix-shell -p nodejs --run 'node -v' |
| nix-collect-garbage -d | 快速清理环境(但下次再进到 `nix-shell` 环境下载有点慢) | 有点像是 `nix-env` & `nix-store` 的结合体哈哈好爽。 |

不过对我来说 `nix-shell` 貌似就很满足我的需求了。剩下的 `nix-env`（升级/卸载）只是 ​​在借阅记录（profile generation）中划掉某本书的名字​​，但书（包）仍然放在书架上 `（/nix/store）`

::
