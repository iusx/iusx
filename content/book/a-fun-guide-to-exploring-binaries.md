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
  - run.py
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

```python
#!/usr/bin/env python3
"""构建真正的 xollvm Hello World，并比较运行输出和文件中的字符串。"""

import os
from pathlib import Path
import re
import shutil
import subprocess
import sys

DEMO = Path(__file__).resolve().parent
ROOT = DEMO.parents[1]
OUT = DEMO / "artifacts"


def run(*args: object) -> bytes:
    return subprocess.run([str(arg) for arg in args], check=True, stdout=subprocess.PIPE).stdout


def main() -> None:
    for tool in ("rustc",):
        if not shutil.which(tool):
            raise SystemExit(f"需要 {tool}")
    prefixes = ([Path(os.environ["LLVM_PREFIX"])] if "LLVM_PREFIX" in os.environ else [
        Path("/opt/homebrew/opt/llvm@22"), Path("/usr/local/opt/llvm@22"),
        Path("/usr/lib/llvm-22"), Path("/usr/lib/llvm-23"),
    ])
    llvm = next((path / "bin" for path in prefixes if (path / "bin/opt").is_file()), None)
    if llvm is None:
        raise SystemExit("需要 LLVM 22/23；可设置 LLVM_PREFIX 指向其安装目录。")
    version = run(llvm / "llvm-config", "--version").decode().strip()
    if version.split(".")[0] not in {"22", "23"}:
        raise SystemExit(f"需要 LLVM 22/23，实际为 {version}")
    plugins = ([Path(os.environ["OBFUSCATOR_PLUGIN"])] if "OBFUSCATOR_PLUGIN" in os.environ else [
        ROOT / "build/Obfuscator.dylib", ROOT / "build/Obfuscator.so",
    ])
    plugin = next((path.resolve() for path in plugins if path.is_file()), None)
    if plugin is None:
        raise SystemExit("请先构建 xollvm 插件，步骤见 ../rust-basics/README.zh-CN.md。")
    OUT.mkdir(exist_ok=True)

    # 只导出打印函数的 IR，避免把 Rust 标准库一起送入混淆器。
    # 导出阶段用 O0，避免提前生成 tail call 后又被 strenc 引入栈缓冲。
    # 普通版和混淆版的最终对象仍然统一使用 O2 编译。
    run("rustc", "--edition=2024", "--crate-type=lib", "--crate-name=hello",
        "--emit=llvm-ir", "-C", "opt-level=0", "-C", "panic=abort",
        DEMO / "src/hello.rs", "-o", OUT / "plain.ll")
    ir = (OUT / "plain.ll").read_text()
    spec = b"obf: strenc(cipher=xor)\0"
    encoded = "".join(f"\\{byte:02X}" for byte in spec)
    annotation = f'''
@.hello.spec = private constant [{len(spec)} x i8] c"{encoded}", section "llvm.metadata"
@llvm.global.annotations = appending global [1 x {{ ptr, ptr, ptr, i32, ptr }}] [{{ ptr, ptr, ptr, i32, ptr }} {{ ptr @hello, ptr @.hello.spec, ptr null, i32 1, ptr null }}], section "llvm.metadata"
'''
    offset = re.search(r"^define\b", ir, re.MULTILINE).start()
    (OUT / "annotated.ll").write_text(ir[:offset] + annotation + ir[offset:])
    with (OUT / "obfuscation.log").open("wb") as log:
        subprocess.run([str(llvm / "opt"), f"-load-pass-plugin={plugin}",
                        "-passes=obfuscation,verify", "-obf-seed=42", "-obf-verify",
                        "-obf-verbose", str(OUT / "annotated.ll"), "-S", "-o",
                        str(OUT / "obfuscated.ll")], check=True, stdout=log, stderr=log)

    triple = re.search(r'target triple = "([^"]+)"', ir).group(1)
    for mode, name in (("plain", "normal"), ("obfuscated", "obfuscated")):
        compiler_args = [llvm / "clang", "-target", triple, "-O2", "-c",
                         OUT / f"{mode}.ll", "-o", OUT / f"{mode}.o"]
        if sys.platform == "darwin":
            compiler_args.extend(["-isysroot", run("xcrun", "--show-sdk-path").decode().strip()])
        run(*compiler_args)
        disassembler_args = [llvm / "llvm-objdump", "--disassemble", "--no-show-raw-insn"]
        # Mach-O 专用视图能直接显示 _puts、解密函数等符号，便于新手阅读。
        disassembler_args.append("--macho" if sys.platform == "darwin" else "--reloc")
        (OUT / f"{mode}.s").write_bytes(run(*disassembler_args, OUT / f"{mode}.o"))
        run("rustc", "--edition=2024", "--cfg=xollvm", "--check-cfg=cfg(xollvm)",
            "-C", "opt-level=2", "-C", "panic=abort", "-C", f"link-arg={OUT / f'{mode}.o'}",
            DEMO / "src/main.rs", "-o", OUT / name)
        output = run(OUT / name)
        (OUT / f"{name}-output.txt").write_bytes(output)
        if output != b"Hello, world!\n":
            raise SystemExit(f"{name} 输出不符合预期：{output!r}")

    # 直接搜索文件字节，比 strings 是否恰好将它识别为独立字符串更明确。
    plaintext = b"Hello, world!"
    if plaintext not in (OUT / "normal").read_bytes():
        raise SystemExit("普通版中未找到预期明文，实验对照不成立。")
    if plaintext in (OUT / "obfuscated").read_bytes():
        raise SystemExit("混淆版仍含连续明文，不能认为本次字符串混淆生效。")
    print("普通版运行：Hello, world!")
    print("混淆版运行：Hello, world!")
    print("搜索可执行文件中的 Hello, world!：普通版找到；混淆版未找到。")
    print("混淆版执行时先还原字符串，再打印。产物位于 artifacts/。")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        raise SystemExit(f"执行失败：{error.cmd}（详细混淆日志见 artifacts/obfuscation.log）") from error

```
::

然后分别运行生成的程序：

```bash
./artifacts/normal       # 运行普通版
./artifacts/obfuscated   # 运行经过 xollvm 混淆的版本
```

两次都打印：

```text
Hello, world!
```

::git-info{url="https://github.com/NationalSecurityAgency/ghidra"}
::

从字符串和人类可读的方式查看，这两次都是一样的。为了更好的理解这之间的区别，和 xollvm 的作用，我下载了 ~~IDA PRO Free。~~(free 的分析不了 ARM64 的，只能用 [Ghidra](https://github.com/NationalSecurityAgency/ghidra)了。

#### normal

1. 打开后选 File → New Project → Non-Shared Project。
2. 用 File → Import File 导入 artifacts/normal，双击打开并同意自动分析。
3. 在 Window → Functions 中搜索 `_hello`
4. 在 Functions 窗口中选中 `_hello`, 在顶部导航栏 Window -> Decompiler

::text-compare{title="hello 对照"}
:::text-compare-side{title="Ghidra outputs"}
```c
int _hello(void)

{
  int iVar1;
  
  iVar1 = _puts("Hello, world!");
  return iVar1;
}
```
:::
:::text-compare-side{title="Rust / 源码"}
```rust
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
:::
::

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
