---
"title": "Seven Languages in Seven Weeks"
"director": "Bruce A. Tate"
"time": "2025.01.08"
img: "08/1.png"
plan: "153,323"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}



# Prolog 1
:text-title{t="Prolog"}

在本书刚开始的时候我就对 Prolog 和 io lang 拥有了兴趣。因为他们是我未曾看见过的（貌似比较冷门？），其中我在搜集 Prolog 相关的资料后发现，有一位大佬可以通过逻辑来和鲸鱼对话，这让我非常有兴趣了解这门语言，或许学完了可以和猫猫对话。


## 逻辑知识库 2 
:text-title{t="逻辑知识库"}

逻辑知识库是 Prolog 的核心，我将它理解为一些数据的存储，它由以下信息构成：

| 构建块 | 例子 |
| --- | --- |
| **事实（Facts）** | 对某个世界的基本断言。（例如：“Babe 是一只猪”，“猪喜欢泥巴”。） |
| **规则（Rules）** | 关于这些事实的推论。（例如：“如果某动物是猪，那么它喜欢泥巴。”） |
| **查询（Query）** | 关于这个世界的提问。（例如：“Babe 喜欢泥巴吗？”） |

如果要运行、体验 Prolog，我更推荐 swi 的 [wasm](https://wasm.swi-prolog.org/wasm/tinker)。目前，prolog 分别有 SWI 和 CIAO。他们都是 Prolog 的 **实现**。不过我更喜欢 SWI，因为他提供了在线的 Prolog 编辑器？我有了解过他们两个实现的作者，发现他们都是老师，都为 prolog 坚持了很久。

在 Prolog 中，**在 Prolog 中，首字母大小写很重要**：

1. 小写字母开头的单词是原子（atom），表示固定的值（类似于 Ruby 的符号）。
2. 大写字母或下划线开头的单词是变量（variable），值可以改变。

例如，一个简单的逻辑推理：

```
% 定义事实
likes(wallace, cheese).
likes(grommit, cheese).
likes(wendolene, sheep).

% 定义规则：朋友关系
friend(X, Y) :- \+(X = Y), likes(X, Z), likes(Y, Z).
---
如果 X 和 Y 是不同的人，并且他们都喜欢同一个 Z，那么 X 和 Y 是朋友。

% 定义解释输出规则
explain_likes(Person, Item) :-
    ( likes(Person, Item) ->
        format('~w 喜欢 ~w。~n', [Person, Item])
    ;   format('~w 不喜欢 ~w，因为没有相关事实支持。~n', [Person, Item])
    ).

explain_friend(X, Y) :-
    ( friend(X, Y) ->
        format('~w 和 ~w 是朋友，因为他们都喜欢某个相同的事物。~n', [X, Y])
    ;   format('~w 和 ~w 不是朋友，因为他们没有共同喜欢的事物。~n', [X, Y])
    ).
```

我们可以长时下输入来看看返回的结果：

**?-explain_friend(wallace, grommit).**
- wallace 和 grommit 是朋友，因为他们都喜欢某个相同的事物。<br>
true. 

**?-explain_friend(wallace, wendolene).**
- wallace 和 wendolene 不是朋友，因为他们没有共同喜欢的事物。
true. 

## 运算符 2
:text-title{:t="运算符" type="2"}

在 prolog 中，这些符号都是 **语言符号体系** 的一部分，而且还具有优先级。优先级决定了运算符的绑定顺序（类似括号的作用）。

| 符号      | 解释                                                                                               |
|-----------|----------------------------------------------------------------------------------------------------|
| `:-`      | **如果**。连接规则头和规则体，表示规则的定义。                                                      |
| `\+`      | **逻辑否定**。表示“不成立”或“不能证明为真”（基于有限失败的逻辑）。                                |
| `=`       | **等于**。用于判断两个值是否相等。                                                                |
| `,`       | **逻辑与**。多个条件必须同时成立规则才为真。                                                       |

| 条件                      | 解释                                                                                             |
|---------------------------|--------------------------------------------------------------------------------------------------|
| `\+(X = Y)`               | X 和 Y 必须不同。                                                                               |
| `likes(X, Z)`             | X 必须喜欢某个 Z。                                                                              |
| `likes(Y, Z)`             | Y 必须喜欢同一个 Z。

### 否定为失败 1
:text-title{:t="否定为失败" type="2"}

在 Prolog 中，`\+` 符号为逻辑否定。如果无法证明 X = Y 为真，则 \+(X = Y) 为真。如果能够证明 X = Y 为真，则 \+(X = Y) 为假。

```
?- \+(1 = 2).
true.   % 因为 1 不等于 2，无法证明 1 = 2，所以 \+(1 = 2) 为真。

?- \+(1 = 1).
false.  % 因为 1 = 1 可以被证明为真，所以 \+(1 = 1) 为假。
```

一般来说我们认为的应该是 1 = 2 为 `false`，而 1 = 1 则应该为 `true`，在这里是反着的。但因为我们加入了 `\+`，即逻辑否定来表示 **不成立**，**不能证明为真**，所以 `\+(1 = 2)` 无法被证明所以返回了 `true`


## 推理 2
:text-title{:t="推理"}

**规则与推理是 Prolog 的核心，允许通过简单的规则解决复杂问题。**，虽然 Prolog 并不是很火，但隔壁的 mcp(Model Context Protocol) 也是推理的一种方式，不过它是根据上下文来进行推理。

| **维度**          | **Prolog**                                                                 | **Model Context Protocol (MCP)**                                              |
|-------------------|---------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **核心目标**       | 专注于逻辑推理和知识表达                                                   | 专注于上下文感知和动态决策                                                     |
| **推理方式**       | 基于逻辑规则的推导，通常采用**反向链式推理（Backward Chaining）**             | 基于规则动态检查，通常采用**前向链式推理（Forward Chaining）**                   |
| **规则与上下文**   | 静态知识库，规则基于固定的逻辑与事实                                          | 动态数据驱动，规则依赖实时上下文和数据流                                         |
| **表达方式**       | 接近自然语言的逻辑描述，强调“什么是正确”                                      | 数据与规则分离，规则动态触发，强调“如何适应实时场景”                              |
| **适用场景**       | 知识推理、逻辑问题、专家系统（如关系推理、定理证明）                          | 动态场景（如物联网、实时决策支持系统、上下文驱动应用）                             |
| **推理透明性**     | 高度可解释性，直接展示推理过程                                                | 推理过程嵌套在系统框架中，透明度较低                                              |
| **灵活性**        | 规则明确但相对静态，适用于逻辑推导问题                                          | 依赖实时上下文，动态调整规则，适合复杂系统的实时决策                                  |
| **典型实现方式**   | 使用基于逻辑编程的语言（如 Prolog），定义规则和知识库                            | 作为动态系统架构的一部分，与上下文数据、事件和规则引擎结合                               |
| **推理复杂度**     | 强逻辑性，处理基于规则的严格逻辑推理                                              | 更贴近实际应用，推理复杂度与上下文动态性直接相关                                       |

我在这里思考了一个问题。假设通过 MCP 来进行推理，如果上下文、元数据都是错的，那么推理的结果也必然是错误的。那 Prolog 是否也会出现这样的错误呢？如果能自我纠错，那么这个能力绝对是非常厉害的特性。

| **情况**             | **MCP**                                               | **Prolog**                                              |
|---------------------|-------------------------------------------------------|-------------------------------------------------------|
| **输入数据正确**       | 能够做出动态决策，输出结果正确                             | 能够基于事实和规则做出推理，输出结果正确                   |
| **输入数据错误**       | 会基于错误数据推导，**结果错误**                           | 逻辑规则不匹配时可能**无法推理**；如果推理完成，结果也可能错误    |
| **推理灵活性**         | 高，实时适应动态场景                                     | 低，更适合静态规则和逻辑推导                             |
| **错误的敏感性**       | 不敏感，直接使用错误数据作为基础，结果也随之错误               | 更敏感，逻辑上无法匹配会导致推理终止                       |

### 推理引擎 3
:text-title{:t="推理引擎"}

推理引擎(Inference engine) 也叫 “推理机”（中文维基百科是这样叫的）。**它将逻辑规则应用于知识库以推断出新信息**,推理引擎主要以两种模式之一工作：特殊规则或事实： 正向推理和反向推理 。

- **正向推理**: 从“今天下雨了”，想到“可能会堵车”，“需要带伞”，“地铁可能会拥挤”……从一个已知事实出发，推导出一系列可能的结论。
- **反向推理**:从“我要准时到达公司”开始，想“我要避开堵车”，“那我需要提前出发”，“所以我需要了解天气情况”。从目标出发，倒推出一系列必要条件。

:text-title{:t="正向推理" type="2"}

正向推理是一种数据驱动（data-driven）的推理方式。**从已知的事实出发**，应用规则逐步推出新的事实，**直到找到目标答案或不能再推出新事实为止。**

假设有一位侦探正在调查一桩案件：某人（嫌疑人）在某个时间段内是否参与了一起犯罪活动。

侦探采取 “从已知线索出发，看能推断出什么” 的方法。(这是一种 数据驱动 的逻辑推理过程。)

目标：要证明嫌疑人A是否在案发时间段内去了案发现场。

**(1) 侦探掌握的线索:** <br>
1. 嫌疑人A的鞋底有泥土。
2. 案发现场附近的地上有相同类型的泥土。
3. 嫌疑人A的手机定位显示，他曾在案发时间段靠近案发现场。
4. 有人看见嫌疑人A在案发现场附近出现。

**(2) 推理过程：** <br>
1. 嫌疑人鞋底有泥土，说明他可能去过案发现场附近。
2. 手机定位也确认了嫌疑人确实在案发时间段靠近案发现场。
3. 目击者证词进一步确认了嫌疑人在附近出现。

**(3) 得出结论**
通过所有线索一步步推导，侦探得出 **“嫌疑人A极有可能在案发时间段出现在案发现场”** 的结论。

### 反向推理 3
:text-title{:t="反向推理" type="2"}

反向推理是一种目标驱动（goal-driven）的推理方式。**从目标出发**，寻找满足目标的前提条件，逐步回溯到已知的事实。

这一次，侦探采取的是 **“从目标出发，验证其成立条件”** 的方法。这是一种 目标驱动 的推理过程。

目标：要证明嫌疑人A是否在案发时间段内去了案发现场。

**(1) 如果嫌疑人去了案发现场，那么**
1. 嫌疑人应该留下某种可以证明的痕迹，比如脚印或其他物证。
2. 嫌疑人的手机定位应该能显示他靠近案发现场。
3. 或者，有目击者看见他出现在案发现场。

**(2) 验证条件**
1. **验证1**：侦探检查嫌疑人鞋底，发现有与案发现场泥土一致的痕迹（成立）。
2. **验证2**：侦探调取手机定位记录，发现嫌疑人在案发时间靠近案发现场（成立）。
3. **验证3**：侦探问询目击者，确认有人看到嫌疑人靠近案发现场（成立）。

**(3) 得出结论**
所有条件都得到满足，侦探得出结论：**“嫌疑人A确实出现在案发现场”**。


书中给了一个反向推理那些食物是咸的例子，`food_flavor(X, Y) 推导出满足 Y = savory 的 X`：

```
food_type(velveeta, cheese).
food_type(ritz, cracker).
food_type(spam, meat).
food_type(sausage, meat).
food_type(jolt, soda).
food_type(twinkie, dessert).

flavor(sweet, dessert).
flavor(savory, meat).
flavor(savory, cheese).
flavor(sweet, soda).

food_flavor(X, Y) :- food_type(X, Z), flavor(Y, Z).

---
找到所有满足 food_type(X, Z) 的 X 和 Z。
找到满足 flavor(savory, Z) 的 Z。
两个条件的 Z 相交时，得出最终的 X。

---

food_flavor(What, savory).

---
哪些食物（What）的味道是咸的（savory）？

What = spam ;
What = sausage ;
false.
```

---

## 递归 1
:text-title{:t="递归"}

一看到「递归」，那么自然离不开 **数组、列表、遍历、字典、元组** 这几个关键词。递归很擅长解决 **重复模式** 的问题，使得递归在算法等相关方面成为了必备的方法。比如可以使用递归来完成一个乘积计算：

```
factorial(0, 1). % 基准情况：0! = 1
factorial(N, Result) :- 
    N > 0, 
    N1 is N - 1, 
    factorial(N1, SubResult), 
    Result is N * SubResult. % 递归步骤

---
factorial(5, Result).
5! = 5 × 4 × 3 × 2 × 1 = 120
```
<br>

::text-tip
在数学中，! 表示阶乘（Factorial）。一个正整数 n 的阶乘记为 n!，表示从 1 到 n 所有正整数的乘积 <br>
$$n! = n \times (n-1) \times (n-2) \times \dots \times 1$$
::

在这个过程中，递归分为了 **向下递** 和 **向上归** 的两个阶段。

```math
\text{factorial}(n) =
\begin{cases}
1 & \text{if } n = 0 \\
n \cdot \text{factorial}(n - 1) & \text{if } n > 0
\end{cases}
```

这是函数逐步调用的展开过程, 最后通过 $$\text{factorial}(n) = n \cdot (n - 1) \cdot (n - 2) \cdot \dots \cdot 1$$ 从基准情况开始 **逐步向上计算结果，将子问题的解组合成最终解。** 他对应了 `Result is N * SubResult.` 这一部分，在 **结果返回时** 调用。**将子问题的结果（SubResult）与当前层的值（N）相乘，逐层合并结果。**


之后，更多的是数据结构的范畴。通过递归和不同数据结构的搭配，以解决复杂的问题。这个过程称之为 **算法**，而数据结构的魅力在于，**组织和管理数据**。

我打算看完这本书后，会看一些数据结构类的书籍。之前我认为数据结构就是存储、组织数据的方式。现在我觉得数据结构是语言的基础，和功能、性能息息相关，语言操控着数据如何利用，例如 **存储、修改、遍历、删除**，以实现各类效果和功能。


### 不仅是连接 2
:text-title{:t="不仅是连接" type="2"}

在我了解 `append` 的时候。我只是单纯的认为他就是普通的连接数据，比如连接数组之类的，然后连接起来输出、还可以拆分。感觉没什么特别重要的，很不解为什么作者将它加入到本章节中。

```
?-append([1, 2], [3, 4], What).
---
What = [1, 2, 3, 4].

?-append(Part1, Part2, [1, 2, 3, 4]).
---
Part1 = [],
Part2 = [1, 2, 3, 4] ;
Part1 = [1],
Part2 = [2, 3, 4] ;
Part1 = [1, 2],
Part2 = [3, 4] ;
```

后来，我可能觉得这是递归的经典应用之一。它展示了通过简单规则，递归地**将复杂问题分解成小问题的过程**, 例如可以应用于：

- 分治法：将一个大问题拆分成多个小问题（例如合并排序）
- 树和图的遍历：通过递归规则遍历复杂数据结构。

### 数据结构不仅是结构 1
:text-title{:t="数据结构不仅是数据结构" type="2"}

在此之前，我一直认为数据结构仅仅是存储数据的一种方法。但之后和 [dragove](https://dragove.site/) 聊天后才意识到，数据的结构决定了如何 **操作数据** 以及 **使用数据的方式**，以及用什么样的写法，才能方便的操纵、使用这些数据。

```
class Cons {
  constructor(h, t) {
    this.h = h
    this.t = t
  }
  toString() {
    function iter(that) {
      if (that.t == null) return that.h
      return that.h + ", " + iter(that.t)
    }
    return "[" + iter(this) + "]"
  }

  // 通过递归的方式遍历链表，并将一个函数 f 应用到每一个元素上，生成一个新的链表。
  map(f) {
    if (this.t == null) return new Cons(f(this.h), null)
    return new Cons(f(this.h), this.t.map(f))
  }

  //  通过循环遍历整个链表，直接修改每个元素。
  // 展示了操作数据的不同策略：递归与迭代。
  map2(f) {
    let it = this
    while (it != null) {
      it.h = f(it.h)
      it = it.t
    }
  }
}

const cons = (h, t) => new Cons(h, t)
const list = (...args) => {
  if (args.length == 0) return null
  return cons(args[0], list(...args.slice(1)))
}

const c = list(2, 3, 4, 5, 6)
console.log(list(2, 5, 8).map(x => x * 2).toString())
c.map2(x => x + 8)
console.log(c.toString())
```

在这几十行 code 中，不仅实现了 **链表** 结构，同时还定义了 `map` 和 `map2` 方法来操控这些数据。

---

## 逻辑谜题 3
:text-title{:t="逻辑谜题"}

<br>

::text-tip{:type="big"}
不写“怎么做”，要写“什么是对的”。
::

[数独（Sudoku）](https://en.wikipedia.org/wiki/Sudoku) 和 [八皇后问题（Eight Queens）](https://en.wikipedia.org/wiki/Eight_queens_puzzle) 是一个经典的逻辑谜题。前者貌似有很多在初中阶段的培训班拿出来讲，后者就不知道了。但有一个共同点就是 **他们都是数学计算能解出的谜题**。我之前没有接触到这方面的，貌似只有那些大佬会喜欢然后经常去做这种类似的问题(可以有机会玩大佬玩过的小游戏了)：


### 数独 1
:text-title{:t="数独" type="2"}

<br>

**规则：**
1. 每行、每列、每个小方格（2x2）（在4x4的情况下为4个2x2的方块）都必须包含 1~4 的数字
2. 不允许有重复数字（我觉得数独的中文翻译就体现出了这个意思）

```
+---+---+---+---+
|   | 2 |   | 4 |
+---+---+---+---+
|   |   | 1 |   |
+---+---+---+---+
| 4 |   |   |   |
+---+---+---+---+
| 2 |   |   | 1 |
+---+---+---+---+
```

数独矩阵的维度为 4 行 4 列，它被分成 4 个 2x2 的小方格。我们要做的就是将数字填上去，但有需要符合规则，即 **每行不允许有重复数字**:

```
:- use_module(library(clpfd)).

sudoku4x4(Puzzle) :-
    Puzzle = [A1, A2, A3, A4,
              B1, B2, B3, B4,
              C1, C2, C3, C4,
              D1, D2, D3, D4],
    
    Puzzle ins 1..4,

    % 每行不重复
    all_different([A1, A2, A3, A4]),
    all_different([B1, B2, B3, B4]),
    all_different([C1, C2, C3, C4]),
    all_different([D1, D2, D3, D4]),

    % 每列不重复
    all_different([A1, B1, C1, D1]),
    all_different([A2, B2, C2, D2]),
    all_different([A3, B3, C3, D3]),
    all_different([A4, B4, C4, D4]),

    % 每个 2x2 小格子不重复
    all_different([A1, A2, B1, B2]),
    all_different([A3, A4, B3, B4]),
    all_different([C1, C2, D1, D2]),
    all_different([C3, C4, D3, D4]),

    labeling([], Puzzle),
    print_sudoku([A1, A2, A3, A4,
                  B1, B2, B3, B4,
                  C1, C2, C3, C4,
                  D1, D2, D3, D4]).

print_sudoku([]).
print_sudoku([A, B, C, D | Rest]) :-
    format('+---+---+---+---+\n'),
    format('| ~w | ~w | ~w | ~w |\n', [A, B, C, D]),
    print_sudoku(Rest).


---

?-sudoku4x4(P).

+---+---+---+---+
| 1 | 2 | 3 | 4 |
+---+---+---+---+
| 3 | 4 | 1 | 2 |
+---+---+---+---+
| 2 | 1 | 4 | 3 |
+---+---+---+---+
| 4 | 3 | 2 | 1 |
```


### 八皇后谜题 1
:text-title{:t="八皇后问题" type="2"}

要理解八皇后谜题，首先需要了解国际象棋的基本规则和玩法。（不知道为什么 Windows 和 macOS 基本上都会自带一个国际象棋游戏，有些 Linux 也会预装，好像在国外国际象棋就跟斗地主一样人人都会吧），首先，国际象棋一般是这样的：

```
   a b c d e f g h           
  +-+-+-+-+-+-+-+-+          
8 |♜|♞|♝|♛|♚|♝|♞|♜| ← Black  
7 |♟|♟|♟|♟|♟|♟|♟|♟|          
6 | | | | | | | | |          
5 | | | | | | | | |          
4 | | | | | | | | |          
3 | | | | | | | | |          
2 |♙|♙|♙|♙|♙|♙|♙|♙|          
1 |♖|♘|♗|♕|♔|♗|♘|♖|  ← White 
  +-+-+-+-+-+-+-+-+          
   a b c d e f g h           

---

皇后长这样：♕	♛

♔	王	King	♚
♕	后	Queen	♛
♖	车	Rook	♜
♗	象	Bishop	♝
♘	马	Knight	♞
♙	兵	Pawn	♟

*建议放大看
```

<br>

::text-tip
八皇后问题的核心就是:<br>
在 8×8 的棋盘上，放置 8 个皇后，使得 任何两个皇后都不会互相攻击。
::

**皇后的规则：**
皇后是棋盘上 最强的棋子，她的移动规则是：
1. 可以横向、纵向、斜向任意距离走
2. 不能跳过其他棋子

**皇后可以攻击**:
1. 同一行
2. 同一列
3. 所有对角线

**所以我们要确保：**
| 不同皇后之间 | 意义 |
| --- | --- |
| 不在同一行 | 每一行只放一个皇后（数组表示） |
| 不在同一列 | 所有列数字不重复（all_different） |
| 不在同一对角线 | 行差 ≠ 列差 |


在这个过程中需要保证:
1. 保证列表中的数互不相同（列不同）
2. 保证没有两个数的对角线关系成立：$$abs(Qi - Qj) ≠ abs(i - j)$$

```
% 引入约束逻辑编程库 clpfd（Constraint Logic Programming over Finite Domains）
:- use_module(library(clpfd)).

% 主谓词：寻找一个满足八皇后条件的解，并打印棋盘
eight_queens(Qs) :-
    % Qs 是一个列表，表示每一行皇后所在的列位置（索引是行，值是列）
    Qs = [Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8],

    % 每个皇后只能放在第 1 到 8 列之间
    Qs ins 1..8,

    % 所有列都必须不同（确保没有皇后在同一列）
    all_different(Qs),

    % 检查所有皇后是否安全（不互相攻击）
    safe_queens(Qs),

    % 求出一个满足所有条件的解（进行求值）
    labeling([], Qs),

    % 打印最终的棋盘结果
    print_board(Qs, 1).

% 空列表是安全的（递归终止条件）
safe_queens([]).

% 递归检查当前皇后与后续皇后是否安全
safe_queens([Q|Qs]) :-
    % 先递归检查后面的皇后是否安全
    safe_queens(Qs),
    % 再检查当前皇后 Q 是否与后续的每个皇后构成攻击
    no_attack(Q, Qs, 1).

% 当前皇后 Q 和空列表当然不会攻击（递归终止）
no_attack(_, [], _).

% 判断当前皇后 Q 是否不攻击 Q1（行距为 D），然后递归检查其余
no_attack(Q, [Q1|Qs], D) :-
    % Q 不能与 Q1 在同一列
    Q #\= Q1,
    % Q 不能与 Q1 在同一对角线（行距 = 列距）
    abs(Q - Q1) #\= D,
    % 增加行距后递归继续检查
    D1 #= D + 1,
    no_attack(Q, Qs, D1).

% ========== 打印棋盘部分 ==========

% 打印完成，空列表停止递归
print_board([], _).

% 打印每一行（即每个皇后）
print_board([Q|Rest], _) :-
    % 打印当前行，Q 表示皇后在第几列
    print_row(Q, 1),
    nl,  % 换行
    % 递归打印下一行
    print_board(Rest, _).

% 超过8列就停止打印该行
print_row(_, 9) :- !.

% 打印棋盘一行：如果当前位置是皇后所在列，就打印 "Q"，否则打印 "."
print_row(Q, Col) :-
    (Q =:= Col -> write(' Q ') ; write(' . ')),
    Col1 is Col + 1,
    print_row(Q, Col1).


---
?-eight_queens(Qs).

 Q  .  .  .  .  .  .  . 
 .  .  .  .  Q  .  .  . 
 .  .  .  .  .  .  .  Q 
 .  .  .  .  .  Q  .  . 
 .  .  Q  .  .  .  .  . 
 .  .  .  .  .  .  Q  . 
 .  Q  .  .  .  .  .  . 
 .  .  .  Q  .  .  .  . 
Qs = [1, 5, 8, 6, 3, 7, 2, 4]
```

最后得出了这个结果。你会发现一个规律即 **每个行的皇后最后放在一起都不会重叠**，严谨点的来说是 [无三共线点](https://en.wikipedia.org/wiki/No-three-in-line_problem) 翻译的可能不是那么准确，但详细了解后得知：

### 无三线共点 3
:text-title{t="无三线共点" type="2"}

这是问题是我在八皇后谜题了解到的，同时还涉及到一个 [数学中未解决的问题](https://en.wikipedia.org/wiki/List_of_unsolved_problems_in_mathematics)，即

::text-tip{type="big"}
在 n × n 的网格中可以放置多少个点，使得其中任何三个点都不位于一条线上？
::

在此之前，需要了解 **不共线、三个点共线**

```
无三点共线
    C
   / \
  /   \
 A-----B

三点共线
A---B---C
```

那么很明显，八皇后问题最后的计算答案是 **无三线共点** 的。因此维基百科才会在更多解法中列举了这个.
```                          1 2 3 4               
. Q . .     列: 2        1 . Q . .   ← Q1 在第1行第2列
. . . Q     列: 4        2 . . . Q   ← Q2 在第2行第4列
Q . . .     列: 1        3 Q . . .   ← Q3 在第3行第1列
. . Q .     列: 3        4 . . Q .   ← Q4 在第4行第3列
```

---

# Scala 1
:text-title{t="Scala"}

对 Scala 印象比较深的就是 Scala 社区主要的维护者[李浩毅](https://github.com/lihaoyi),竟然是新加坡前总理李显龙的次子。还是 [Hands-on Scala Programming](https://www.handsonscala.com/) 一书的作者（这本书还免费观看章节部分的内容，对引导学习 scala 很有帮助）。我第一次看到 Scala 这个名字，还以为是某个数据库，毕竟 LOGO 不太像是一个 lang。


## 编程范式 3
:text-title{t="编程范式" type="2"}

在此之前，作者通过 Ruby, IO lang, Prolog 介绍了 起码三种编程范式，每一种编程范式都会掀起一场腥风血雨。而 Scala 是函数式和面向对象的一种桥梁，本书作者称之为 “混合语言”。目的是 **架起 Java 和 Haskell** 之间的鸿沟连接起来

::text-space
---
type: tip
---

2009: 作者的总结<br>
随着程序需求的增加，编程语言也在不断进化。每二十年左右，旧的编程范式无法满足新的需求，新的范式必须出现。每个新的范式都会诞生一批编程语言，最初可能效率高但不实用（如 Smalltalk 和 Lisp）。最终，某些混合语言（如 C++）成为“桥梁”，然后是商业化语言（如 Java 或 C#），最终成熟的语言会实现新的范式。

<br>

2025: 说的太对了
::

不过由于我看这本书是总结语言的学习思路，所以我不会再本机装 lang，基本上用在线环境来运行。这里我推荐使用 Scala 提供的在线环境 [Scastie](https://scastie.scala-lang.org/) 对于 Scala 给我的直接映像就是输出 Hello 有很多种方法，比如：

```
object Main extends App{print("Hello, World!")}

@main
def hello(): Unit =
  println("Hello, World!")

println("Hello, World")
```

如你所见起码有三种方式可以输出 `Hello, World`， 这三种方式体现了 Scala 灵活性：

1. 使用 object 和 App，继承 App trait，简化主程序结构
2. Scala 3 的 @main 注解,不需要显式声明类和方法。
3. 不依赖类或对象结构

不过和 Java 相比，那也是非常的直观明了的：

```
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```


| LANG | TYPE |
| --- | --- |
| Ruby | 面向对象 |
| IO | 原型式编程 |
| Prolog | 声明式编程 |


## 类型 1
:text-title{t="类型" type="2"}

Scala 是可以推断出类型的，比如 `1 + 1`，IDE 会在旁边显示 `2: scala.Int`, 例如下面的类型转换（String 真方便啊）


::text-space
---
type: tip
---
在 Scala 2 的某个小版本中，Int + String 之类的 **插值** 被废弃掉了，需要使用 `$` 进行插值，反正最后都会被归类到 `String` type。（String 和 Json 以及 Object 是我最喜欢的类型）:
`val pi = 3.14159; println(f"Pi is approximately $pi%1.2f")`
::

```
val x = 4 + "abc"
println(x.getClass) 

val s = "abc" + 4
println(s.getClass) // class java.lang.String
```


Scala 2 和 3 version 的语法可能略有不同。所以这就是我读本书的理由，语言和语法结构是会变的。无论多么熟悉，过个两三年和四五年就会改变很多，但如果根据语言的基础来学，则很快就能上手。

### AST 2
:text-title{t="AST" type="2"}

AST 是抽象语法树（AST, Abstract Syntax Tree）的简称。当你写一段 Scala 代码时，Scala 编译器会将其转换为抽象语法树（AST），然后再进行后续的编译阶段（如类型检查、优化、字节码生成）。可以 **查看该代码在编译阶段形成的 AST 结构:**。

在 Scala 中，可以使用 [Scala AST explorer](https://scalameta.org/ast-explorer/#) 来进行查看。例如上面我说 **反正最后都要归类到 String** 其实很不严谨，可以将 Copy 放进去查看在编译的时候都做了什么：

```
val x = 4 + "abc"
println(x.getClass) 

---

Source [0;38]
├── Defn.Val [0;17]
│   ├── Pat.Var [4;5]
│   │   └── Term.Name [4;5]   // x
│   └── Term.ApplyInfix [8;17]
│       ├── Lit.Int [8;9]     // 4
│       ├── Term.Name [10;11] // +
│       ├── Type.ArgClause [12;12]
│       └── Term.ArgClause [12;17]
│           └── Lit.String [12;17] // "abc"
└── Term.Apply [18;37]
    ├── Term.Name [18;25]     // println
    └── Term.ArgClause [25;37]
        └── Term.Select [26;36]
            ├── Term.Name [26;27]   // x
            └── Term.Name [28;36]   // getClass
```

也就是说 `4` 是被编译器推理到了是 `Int` 类型的，`abc` 是 `String` 虽然最后组合成了 `4abc` 也还是 `String` 但你不觉得看到了编译过程不还是很酷的吗？

---

### 泛型 1
:text-title{t="泛型"}

泛型（Generics）类型是一个 **在程序设计中用于定义可以处理不同类型的类、特质或函数** 方式。泛型类型的基本概念：


1. 类型参数：可以为类、特质或函数提供一个占位符类型，这个类型在使用时会被实际的类型所替代。
2. 类型推断：Scala 会根据您传递的具体类型自动推断出类型参数。

简单点来说，其作用在于 **在定义类、特质、或方法时，使用类型参数来使其可以处理不同类型的数据**。让方法或类处理不同类型的数据，而不需要为每种类型都写一个单独的实现。

```
// 定义一个泛型类 Box
class Box[A](val value: A) {
  def getValue: A = value
}

val intBox = new Box(10)       // A 被推断为 Int
val stringBox = new Box("Hello") // A 被推断为 String

println(intBox.getValue)    // 输出: 10
println(stringBox.getValue) // 输出: Hello
```

泛型很像 TypeScript 中 `Interface`, ：

```
// 定义一个泛型接口
interface Box<T> {
  value: T;
  getValue(): T;
}

// 实现泛型接口
class NumberBox implements Box<number> {
  constructor(public value: number) {}
  getValue(): number {
    return this.value;
  }
}

class StringBox implements Box<string> {
  constructor(public value: string) {}
  getValue(): string {
    return this.value;
  }
}

const numBox = new NumberBox(42);
console.log(numBox.getValue()); // 输出: 42

const strBox = new StringBox("Hello");
console.log(strBox.getValue()); // 输出: Hello
```

---

#### EventBus 2
:text-title{t="EventBus"}

EventBus 是一个类型安全的概念，有点像是 Vue 中的 [Events](https://v3-migration.vuejs.org/zh/breaking-changes/events-api.html)。不过类型安全好像远没有 **内存安全** 那么让人感到欣喜，仿佛是必须的？

::text-space
---
type: tip
---
一个类型安全的“事件通道”——你可以向里面发送（emit）事件，其他组件可以监听（subscribe）这些事件并作出反应。
::


```
enum CopyEvent:
  case CopyWholeTree
  case CopyNode(id: Int)

... 
val copyEvents = EventBus[CopyEvent]()
...
onClick.mapToStrict(CopyEvent.CopyWholeTree) --> copyEvents
...
// in app scope: div(
copyEvents --> { 
  case CopyEvent.CopyWholeTree =>  ...
  case CopyEvent.CopyNode(id) => ...
}
// ...)
```


##### ADT 3
:text-title{t="代数数据类型" type="2"}

密封的代数数据类型（Algebraic Data Types, ADTs）是函数式编程核心的类型系统之一，通常包括了：

1. 积类型（Product Type） = A 和 B 一起出现（“组合”数据）
2. 和类型（Sum Type） = A 或 B 之一出现（“选择”数据）

例如上面的 Code 就用到了 ADT 中的 `Sum Types` :

```
enum PaymentMethod:
  case CreditCard(number: String)
  case Cash
  case PayPal(email: String)
// 这表示付款方式只能是三种之一 —— 你不能“同时”用信用卡 + PayPal。
```

如果是 Product type，那就是：

```
case class Person(name: String, age: Int)
// Person 拥有 name 和 age，你无法只给其中一个，必须两个都有 —— 这就是积类型。
```



---

### trait 2
:text-title{t="trait"} 

Trait (特质)，trait 和泛型几乎同时出没，所以要理解 trait 之前需要理解泛型。Trait 和接口很像，我觉得中文翻译成“特质”不太理解，“特征、特点”倒是很符合 Trait 实现的逻辑：

::text-space
---
type: tip
---
我觉得这里可以参考下 Rust 的文档 [Traits](https://doc.rust-lang.org/book/ch10-02-traits.html): **Trait:定义共同行为**。 

Trait 在心理学中是一个理论，即 [特质理论](https://en.wikipedia.org/wiki/Trait_theory)。是研究人类个性的一种方法，所以 Rust 的文档更符合 Trait 的意思。
::

比如下面 Code 就实现了一个 `动物(Animal)` 的 `Trait` 即它们都会 `speak`

```
// 定义 trait
trait Animal:
  def speak(): String

// 定义实现 trait 的类
class Dog extends Animal:
  def speak(): String = "Woof!"

class Cat extends Animal:
  def speak(): String = "Meow!"

// 创建实例
val dog = new Dog()
val cat = new Cat()

// 调用方法
println(dog.speak()) // 输出: Woof!
println(cat.speak()) // 输出: Meow!
```

如果用 `interface` 的话，比如 Java:

```
interface Animal {
    String speak();
}

class Dog implements Animal {
    public String speak() {
        return "Woof!";
    }
}

class Cat implements Animal {
    public String speak() {
        return "Meow!";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal dog = new Dog();
        Animal cat = new Cat();
        System.out.println(dog.speak());  // Woof!
        System.out.println(cat.speak());  // Meow!
    }
}
```

---


### 隐式类型 3
:text-title{t="隐式类型"}

| 机制类型        | 英文名              | 主要作用                                       | 示例作用                          |
|-----------------|---------------------|------------------------------------------------|-----------------------------------|
| 隐式转换        | Implicit Conversion | 当类型不匹配时，自动将一个类型转换为另一个类型 | Int → String / 自定义类型转化     |
| 隐式参数        | Implicit Parameter  | 自动填入函数所需的上下文参数                   | 注入默认值、依赖注入、上下文控制 |
| 隐式类          | Implicit Class      | 为已有类型添加新方法（类似扩展方法）           | 给 Int 添加 `squared` 方法        |

#### 隐式类型转换 2
:text-title{t="隐式类型转换" type="2"}

如果要学习一个语言，那么类型系统无非是重要的。在 Scala 中是支持类型推断的，也就是不像静态语言那样需要自己指定类型 `let x: number = 42;`。[隐式类型(Implicit type conversion)](https://en.wikipedia.org/wiki/Type_conversion#Implicit_type_conversion)转换, **是由编译器自动执行的类型转换。**

也就是说，当一个类型不符合预期时，编译器会尝试通过一个标记为 `implicit` 的函数将其自动转换为所需的类型。如果你将之前的插值放到 AST 里面，就会看到 `implicit`:

```
val pi = 3.14159
println(f"Pi is approximately $pi%1.2f")

---

Source [0;57]
├── Defn.Val [0;16]
│   ├── Pat.Var [4;6]
│   │   └── Term.Name [4;6]         // pi
│   └── Lit.Double [9;16]           // 3.14159
└── Term.Apply [17;57]
    ├── Term.Name [17;24]           // println
    └── Term.ArgClause [24;57]
        └── Term.Interpolate [25;56]
            ├── Term.Name [25;26]       // f (interpolator)
            ├── Lit.String [27;47]      // "Pi is approximately "
            ├── Term.Name [48;50]       // pi (in interpolation)
            └── Lit.String [50;55]      // "%1.2f"
```

#### 隐式类型参数 1
:text-title{t="隐式类型参数" type="2"}

隐式类型参数我的理解就是一种 **类型** 安全的注入机制，例如：

```
implicit val defaultGreeting: String = "Hello"

def greet(name: String)(implicit greeting: String) = println(s"$greeting, $name")

greet("Alice") // Alice, Hello 
```

通过 [Scala AST explorer](https://scalameta.org/ast-explorer/#) 可以看到，`$greeting` 在编译的时候，是会被 `Interpolate` 占位的：

```
- Term.Interpolate [109;128]
    Term.Name [109;110]
    Lit.String [111;111]
    Lit.String [120;122]
    Lit.String [127;127]
    Term.Name [112;120]
    Term.Name [123;127]
```

如果不依赖隐式类型参数来写，那么就会是这样的：

```
def greet(name: String, greeting: String) = println(s"$greeting, $name")

val defaultGreeting = "Hello"

greet("Alice", defaultGreeting) // Hello, Alice
```


#### 隐式类 1
:text-title{t="隐式类" type="2"}

隐式类非常好理解，很像 JavaScript 中的 `prototype` 例如：

```
implicit class RichInt(val x: Int) {
  def squared: Int = x * x
}

println(4.squared)  // 16
```

在 Javascript 中就是：

```
Number.prototype.square = function() {
  return this * this;
};

console.log((5).square()); // 25
```

---

## 不可变性 2
:text-title{t="不可变性"}

感觉这本书上讲的一些 Scala 特性，在 2025 年的现在好像都是现代语言的必需品了(可能当时确实是比较新颖的)。对于不可变性好像函数式语言都支持？起码 JavaScript 是这样的。在 English 中，[不可变性（Immutability）](https://en.wikipedia.org/wiki/Immutable_object) 通常会在后面加一个 `object`，组合起来就是 **不可变对象**。

所以不可变性包含了 **不可变对象** 和 **不可变函数/变量**, 比如在 scala 中，`var` 是可变的，`val` 就不可变:


```
var a = "mutable"
a = "changed"   // OK

val b = "immutable"
b = "change"     // 编译错误
```

Scala 明确区分了可变（mutable）对象和不可变（immutable）类，具体可以参考 [Concrete Mutable Collection Classes](https://docs.scala-lang.org/overviews/collections-2.13/concrete-mutable-collection-classes.html), **也就是将可变的和不可变的都弄了个类型**：

| 集合类型 | 不可变版本（immutable）                          | 可变版本（mutable）                              | 特点说明 |
|----------|--------------------------------------------------|--------------------------------------------------|----------|
| 序列（seq） | `list`, `vector`               | `arraybuffer`, `listbuffer`, `queue`              | list 是不可变链表，vector 性能更平衡，arraybuffer 可变、适合追加 |
| 集合（set） | `set`, `sortedset`                    | `hashset`            | 不可变集合默认使用 hash 实现，可变集合有更多实现 |
| 映射（map） | `map`,`SortedMap`                    | `hashmap` , `weakhashmap`         | 不可变 map 默认使用 hashmap，可变版本适合高性能需求 |
| 栈 / 队列   |                                  | `queue`, `stack`, `arraydeque`                    | 可变和不可变队列同名，但位于不同包中 |
| 数组       | `array`              | `arraybuffer`                         | `array` 不是集合框架成员，但常用 |
| 特殊集合   | `range`, `emptyset`           |                                               | 用于构造或默认空集合值 |

(真的是太多了，可能不是很全，大致了解下)

---

## 并发 2
:text-title{t="并发"}

::text-space
---
type: tip
---
一个语言对可变性和不可变性的支持程度，直接影响它在并发编程中的优势与设计难度。
::

上面这句话基本上就可以衡量一个语言在并发上的优势。例如不可变结构在多线程共享、无锁共享数据结构使用场景。但在此之前，我可以借助 scala 了解下一些并发模型，这样可以更加理解并发，同时适应于其他语言(毕竟模型一样，只不过语法变了)。

### Future / Promise 1
:text-title{t="Future / Promise" type="2"}

[Future / Promise](https://en.wikipedia.org/wiki/Futures_and_promises) 一般他们是同时出现的，中文直译就是 “未来与承诺”。但是在 CS 中，有很多关于并发的专业名字，例如：


| Name | Desc | Chinese |
| --- | --- | --- |
| future | 值将在未来某时可用。通常由系统或框架执行任务并返回。| 未来 | 
| promise| 手动控制 Future 的完成。开发者显式 resolve/reject | 承诺 |
| delay |  尚未开始执行的任务（延迟计算），强调“推迟” | 延迟 |
| deferred | 一种控制句柄，表示延迟+手动完成的组合 | 推迟 |

在 Scala 文档的 [Concurrency](https://docs.scala-lang.org/scala3/book/concurrency.html) 部分中，介绍了 `scala.concurrent.Future` 并且也有社区写的文档，例如 [Future and Promise](https://docs.scala-lang.org/overviews/core/futures.html):

```
import scala.concurrent.{Future, Promise}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Success, Failure}
import scala.concurrent.Await
import scala.concurrent.duration._

object Main {
  def main(args: Array[String]): Unit = {
    // Future
    val future = Future {
      Thread.sleep(1000)
      "Hello from Future!"
    }
    
    future.onComplete {
      case Success(msg) => println(msg)
      case Failure(e) => println(s"Error: ${e.getMessage}")
    }
    
    // Promise
    val promise = Promise[String]()
    val futureFromPromise = promise.future
    
    futureFromPromise.foreach(msg => println(msg))
    
    Future {
      Thread.sleep(800)
      promise.success("Hello from Promise!")
    }
 
    // 最多等待 3ms
    Await.result(Future.sequence(Seq(future, futureFromPromise)), 3.seconds)
    println("END")
  }
}
```


::

