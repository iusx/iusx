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

::git-info{url="https://github.com/my-learn-project/rea-test-project"}
::

::text-flow
---
title: CardGuard 授权流程
height: 620
text: |
  flowchart TD
      subgraph Manager["管理侧：独立签发工具"]
          Key["加密保存的签名私钥"] --> Issuer["Rust 发卡工具"]
      end
      Issuer --> Token["带数字签名的授权卡密"]
      subgraph Client["CardGuard 主进程"]
          UI["C++ / Qt 桌面界面"]
          UI <-->|"C ABI 调用与返回"| Rust["Rust 授权校验静态库"]
          UI <-->|"最终授权判断"| Policy["xollvm 虚拟化的策略函数"]
          PublicKey["编译时嵌入的公钥"] --> Rust
      end
      Token -->|"用户输入"| UI
      System["本机设备标识与系统时间"] --> Rust
---
::

在 Codex 额度充值之前，我直接 GPT-6.1 Astra Ultra 让他帮我生成一个前端 QT 后端 rust 并且加壳的 demo。一开始它选的是 [VMProtect](https://www.vmpsoft.com/) ，但是这个要花钱（不过好像一般都是用盗版的）。于是我让 GPT 帮我用开源的，它找到了 [xollvm](https://github.com/und3ath/xollvm) 有一说一才 156 个 star（感觉不是很靠谱的样子）

之前学密码学的时候，虽然我只记得什么古典密码。但书上说只有开源的加密算法是最厉害的，闭源的

### xollvm dmeo

::git-info{url="https://github.com/und3ath/xollvm"}
::

::text-flow
---
title: Rust 到 Mac ARM64 程序
height: 420
text: |
  rust[Rust 源码] -->|rustc 编译| ir[LLVM IR]
  ir -->|xollvm 混淆| obf[改写后的 LLVM IR]
  obf -->|LLVM 生成机器码| asm[Mac 上运行的 ARM64 程序]
---
::

要理解 GPT 生成的发卡 demo 还是太复杂了，先从 xollvm 给出的 demo 理解方便一点。LLVM 加壳和传统的加壳区别是：

| 方式 | 在哪里处理 | 典型变化 |
| --- | --- | --- |
| 传统加壳 | 已编译的可执行文件 | 将原程序压缩或加密，加入启动时还原程序的壳代码 |
| LLVM 混淆 | 编译过程中的 LLVM IR | 改写计算表达式、分支或控制流，再生成机器码 |

xollvm 属于第二种。这个实验从 Rust 源码生成 IR，再让 xollvm 改写 IR。它演示的是编译时混淆，不是给一个现成的 EXE 加壳。

::text-code
---
title: Hello,World test
files:
  - /src/hello.rs
  - /src/main.rs
---
```rust
// hello.rs
// puts 是系统提供的“打印一行字符串”函数。
unsafe extern "C" {
    fn puts(text: *const core::ffi::c_char) -> core::ffi::c_int;
}

#[unsafe(no_mangle)]
#[inline(never)]
pub extern "C" fn hello() {
    // SAFETY: c"..." 提供有效、以零结尾的字符串，puts 只在调用期间读取它。
    unsafe {
        puts(c"Hello, world!".as_ptr());
    }
}

```
```rust
// main.rs

#[cfg(not(xollvm))]
mod hello;

#[cfg(xollvm)]
unsafe extern "C" {
    fn hello();
}

fn main() {
    #[cfg(not(xollvm))]
    hello::hello();

    #[cfg(xollvm)]
    // SAFETY: 链接的 hello 来自本示例，没有参数或调用前提。
    unsafe {
        hello();
    }
}
```
::

为了更好的理解这之间的区别，和 xollvm 的作用，我下载了 IDA PRO Free。

#### LLVM

::img-tip{url="a-fun-guide-to-exploring-binaries/LLVM_Logo.png" text="我超为以前就在某 Linux telegram group 中看到了这个小恐龙头像，当时还以为这个是 Linux 什么的，没想到是 LLVM 的 logo" alt="LLVM logo"}
::

又学到了一个新的东西 "LLVM", 我之前只知道 JVM，他们之间的区别是：

| 对比项 | LLVM | JVM |
|---|---|---|
| 核心定位 | 构建编译器的基础设施 | 执行 JVM 字节码的虚拟机规范及其实现 |
| 中间表示 | LLVM IR | JVM 字节码 |
| 常见工作 | 优化代码，生成目标平台的机器码 | 加载字节码，并通过解释、即时编译等方式执行 |
| 普通程序运行时 | 提前编译成机器码后，通常不需要 LLVM 在场 | 通常由 JVM 运行环境承载，运行环境也可以随应用一起提供 |



::
