---
"title": "Seven Languages in Seven Weeks"
"director": "Bruce A. Tate"
"time": "2025.01.08"
img: "08/1.png"
plan: "268,323"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{:t="回顾下自己的十年经历"}

# 总结自己 0

如果从 2015 那个对计算机懵懂的我来说，到 2025 年已经过了十年。可以说对计算机方面拥有了十年的兴趣。假如从 2018 我第一个漏洞算起，至今已经过了七年。再从 2020 我打算学习设计开始，已经过了五年。

我觉得自己有很大的缺陷，基础不是特别牢固。之前做全栈的时候就有朋友指出我的基础不是特别好，最常说的话就是：“基础不牢，地动山摇”。做出的项目只是看起来很不错，但如果深挖细节，性能的处理就有一小部分的问题。虽然我总以 "安全爱好者" 作为 title，但我貌似并没有发现过比较知名且威胁较大的漏洞。

更不用说什么 EDUSRC、MSRC、TSRC 这些了，仅仅是公益 SRC 和 CNVD 以及 Hackerone 这些，我所发现到的或提交的更多是大佬吃剩的边角料，甚至是不屑一顾的。但我之前缺奉为瑰宝，以筑起我那脆弱且不堪一击的自信。

我还是比较庆幸自己无论做什么起码都能有一点成就的。虽然这个成就不高，但足以出去找个班上不至于饿死。做设计会有很多朋友施舍下我;做安全拿到了漏洞赏金（虽然不多）;做全栈起码能混到小公司 offer；做舆情分析的时候，能被专业的人发现，引导我继续做下去。所以我还是比较幸运的，起码有点东西，虽然不多。

看完这本书后，我觉得是时候筹备下我的代表作了。因为之前很多人觉得我是臭做设计的，甚至还有人说我是个臭美工！完全无视掉了我全栈和安全架构方面的才华。所以在这之后，我会筹备一个全栈的代表作；另一个是安全架构的代表作。至于设计的代表作已经有了，再往后无非是作品。我觉得代表作这个东西首先是能给人用的，其次才是给人看的；这样说服力大一点。

之所以看这本书。首先是我觉得自己 Code 方面还是比较有问题，写 Code 总是很磨叽，和那种一写 code 就是写一天的有很大的差距。其次是我承认是被这本书的标题所吸引，作者懂不懂语言不重要，但他一定懂营销。我还不知道这本书有没有被 Percipio 收入，反正我 ACM 会员资格是到期了。这里我想吐槽下 ACM 的续费规则，我有钱的时候是想提前续费的，但 ACM 只能是快过期的时候才能续费。等真快过期的时候，我反而没钱续费了。


---


:text-title{:t="作者致谢"}

# 致谢 2

又到了一个非常具有代表性的篇幅，也就是：“What Readers Are Saying About Seven Languages in Seven Weeks” 你会看到国内那种类似 xxx 专家，xxx 公司 xxx 总监 xxx 团队 xxx 实验室对某本书的友情肯定和推荐。你别说你还真别说，如果这本书讲的是思维逻辑和拆解，那确实是很不错的。但如果是技术性的，那可能从 2010 年发售至今 2025 年历经十多年的发展，技术也可能会淘汰，语法可能会变，但逻辑和思维，依然是那套惯式。

在这本书的前言中，作者透露出在 2009~2010 的时间段经历了很多人生的体验。例如他那 40 多岁的弟弟经历了心脏搭桥手术；三月底，他的妹妹确诊的乳腺癌；同月，他的母亲确诊晚期癌症。短短几天就去世了。

在这期间内，作者虽然伤心欲绝。但他回想起母亲的点点滴滴，与母亲的每次相处，特别是在作者离家前上了母亲的几节美术课，虽然作者的画很糟糕。但母亲总能将破碎不堪的画幅玩就回来成为一件精美的艺术作品。这需要天赋和经验才能将一副处在崩溃边缘的画作挽救回来。

不知你是否接触过绘画、美术。在我初中最后一年时，我因成绩垫底转到了美术班，我比较遗憾没有接触到绘画的全过程。

::img-tip
---
url: 08/1.jpg
text: 绘画这门艺术，你需要经历过前期的 <b>构图、草稿、描边、上色、光影</b> 如果你是素描类的作品，还需要经历前期的封边到最后将美纹纸胶带撕下的过程。
---
::

在作画前期，你需要构思好要画什么，然后通过一些技巧完成构图。比如透视、人体结构等。然后就是用铅笔打草稿，打草稿的过程要求一笔带过，如果不能一笔，那就需要勤加练习。所以在美术课中你会看到一开始要求画线，无论板绘还是素描都是这样。


::text-tip
美术一般讲究人较多，水彩纸要用 Arches、素描纸要用 Canson、铅笔要用 Marie's，高级点的铅笔还有 Derwent。水彩颜料要用 Winsor & Newton、白夜，一张不起眼的纸每张也许都是几块钱的。
::


学会画线后，就需要学会光影。光的照射范围和影子，在素描中，只有黑色和白色，因此需要用到擦纸笔甚至可塑橡皮来实现。当然有些功力比较深的喜欢用手进行擦来延续黑色。

如果你是走那种水彩、或者板绘，数字传媒的。可能会经历构图、草稿、描边的这个过程。然后就是上色、光影的应用。所以这个阶段，就和开发很类似。前期实现一个功能，然后用一个简陋的 GUi 进行交互。后期再将 GUi 进行美化和布局的排列。那么恭喜你，你已经成为了一个优秀的 Web 开发工程师，俗称前端。

但对于后端，更多的是 code 和 code 之间功能的划分，每个 code 负责不同的功能，最后连点成线，打通 API 和 GUI 之间的联系。组成一个能跑的 base 或 GUI 程序，或者输出一个接口作为 API。那么恭喜你，你成为了软件开发工程师或后端工程师。

一个简简单单的前言，就透露出作者对于软件设计和软件工程的功底。即使过了十多年，这套逻辑和拆解也亦然可以套在现代软件工程中，如果读者理解过 MVC 架构，那简直就是异曲同工。

::text-tip
When I told my mother that I would dedicate this book to her, she
said that she would like that, but she had nothing to do with com-
puters. That is true enough. The very thought of Windows would leave
her helpless. But Mom, you have had everything to do with me. Your
well-timed words of encouragement inspired me, your love of creativity
shaped me, and your enthusiasm and love of life guide me even now.
As I think about these experiences, I can’t help but feel a little better
and a little stronger because I, too, am a canvas shaped by the master.
This book is dedicated with love to Lynda Lyle Tate, 1936–2010.
::

所以在前沿的结尾，作者说母亲对作者的影响很大。这无关他的目前连 Windows 都不会用，而是传授给了儿子拆解的艺术。看一个产品如果从成品看肯定是高攀不起的，但如果一步一步的拆解，一个一个的功能实现，就会发现也不是那么的特别高攀不起。

---

:text-title{:t="作者的致谢"}

## Ruby:简洁，灵活，面向对象 1

在致谢阶段，作者展示出了这本书的含金量，甚至比开篇那几位挂名推荐的还重量级。首先映入眼帘的是 Ruby community：

::text-tip
*相信能在 Wikipedia 中留名的实力。
::

1. [松本行弘(Matz)](https://ja.wikipedia.org/wiki/%E3%81%BE%E3%81%A4%E3%82%82%E3%81%A8%E3%82%86%E3%81%8D%E3%81%B2%E3%82%8D) 他最著名的是 Ruby 编程语言及其原始参考实现 Matz 的 Ruby 解释器的首席设计师；

2. [Charles Nutter](https://github.com/headius): [Jruby](https://en.wikipedia.org/wiki/JRuby) 的作者之一，能在 Java 和 Ruby 代码之间进行完全双向访问（类似于 Python 语言的 Jython ）。

3. [Evan Phoenix](https://github.com/evanphx) : [Rubinius](https://en.wikipedia.org/wiki/Rubinius) 的作者；旨在 “为运行 Ruby 代码提供丰富、高性能的环境” 

4. [Tim Bray](https://en.wikipedia.org/wiki/Tim_Bray): 原始 XML 规范的共同作者之一;

Ruby 以完全面向对象、可读性和简洁性、灵活性而知名。例如灵活的语法与动态特性：

```
class Greeter
  def initialize(name)
    @name = name.capitalize
  end
end

# 动态添加方法
Greeter.define_method(:greet) do
  "Hello, #{@name}!"
end

g = Greeter.new("ruby")
puts g.greet
# 输出：Hello, Ruby!
```

但看输出 `Hello, Ruby!` 的这个过程就感觉元编程也是 ruby 的特点之一。

我之前浏览过 [Ruby China](https://ruby-china.org/)，那时候我有一个对 Ruby 的问题。但 Ruby China community 有一个会员限制。注册完需要三个月后才能发帖或发消息，结果就是一天后我的问题被我自己解决了，之后我就再也没有浏览过这个社区。

---

## Io:更好的理解 1

:text-title{:t="IO：更好的理解语言" type="2"}

接下来的就是 Io community, 并不是信息学奥林匹克竞赛 (英语：Olympiad in Informatics，简称：OI) 的那个 IO。而是 Io Programming Language：

1. [Jeremy Tregunna](https://github.com/jeremytregunna): [ioLang](https://github.com/jeremytregunna) 的作者之一;Io 的目标是探索概念统一和动态语言，因此权衡往往倾向于简单性和灵活性而不是性能。

2. [Steve Dekorte](https://github.com/stevedekorte): Iolang 的作者之一；Iolang 于 2002 年创建，当时他试图用他的语言 Cel 来帮助朋友 Dru Nelson。他发现自己确实不太了解语言的工作原理，并开始编写一种小型语言来更好地理解问题。(ps: 我什么时候才能拥有这样的好朋友)

光从描述，我已经对 Iolang 开始有兴趣了，特别句尾处的: "You captured the imagination of the beta readers and cre-
ated the favorite language of many of them.(你激发并测试了读者的想象力，同时创造了许多人最喜欢的语言。)"

Iolang 作为动态语言，在类型阶段就比较宽松，比较灵活，例如:

```
x = 42        # 整数
x = "Hello"   # 重新赋值为字符串
```

而静态语言呢，类似 Typescript 这种类型比较强硬的：

```
let x: number = 42;
x = "Hello"; // 编译错误：类型不匹配
```

当然他们各具特点，灵活性、性能各有千秋，适应的项目需求也不同，有的适合大型的，多人合作开发，有的适合写个脚本或前期功能论证阶段的原型设计。动态语言的刻板印象就是 易上手、Code 简洁、类型宽松、快速开发、运行时发现等作为优点。我们列举几个常见的静态和动态语言：

| 动态语言 | 静态语言 |
| --- | --- |
| Python | C/C++ |
| Ruby | Java |
| JavaScript | Go |
| PHP | TypeScript |
| Lua | Rust |
| Io | Swift |

---

## Prolog:逻辑编程 1

:text-title{:t="Prolog:逻辑编程" type="2"}

再然后就是 [Prolog community(Programming in Logic community)](https://en.wikipedia.org/wiki/Prolog)，这是一种逻辑编程语言。这种类型的我还没有接触过，他更像是数学中的逻辑推理。他的基础是一阶逻辑(First-order logic) 其核心的写法和经常接触到的语言有很大的不同。他的语法例如：

```
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
父母关系：如果 X 是 Y 的父母，且 Y 是 Z 的父母，则 X 是 Z 的祖父母。
```

在一些大学中，会将 Prolog 放到[逻辑编程课](https://en.wikipedia.org/wiki/Logic_programming) 中。如果很不幸你没有上过（ps: 我也没上过）那可以蹭一下 The University of Texas at Dallas(德克萨斯大学达拉斯分校) 的课件 [Logic Programming:CS 6371: Advanced Programming Languages](https://personal.utdallas.edu/~hamlen/cs6371sp14/lecture21.pdf)；如果要介绍 Prolog 那就需要介绍一阶逻辑和逻辑连接词、谓词逻辑、量词等。所以我会将这部分的介绍放到 Prolog 那一章节中，这里我们就介绍作者致谢的大佬。

1. [Brian Tarbox](https://aws.amazon.com/cn/developer/community/heroes/brian-tarbox/): 通过 Prolog 进行建模，用于模拟和分析海豚在实验中的思维模式，非常有趣。可以前往他的个人 [blog](https://briantarbox.com/) 了解更多 

2. [Joe Armstrong](https://en.wikipedia.org/wiki/Joe_Armstrong_(programmer)): [Erlang](https://en.wikipedia.org/wiki/Erlang_(programming_language)) 设计者之一。这是一种并发、分布式、容错的编程语言，[Elixir](https://en.wikipedia.org/wiki/Elixir_(programming_language)) 就是构建在 Erlang 之上。

作为以分布式、多线程而闻名的语言。“Let it crash（让它崩溃）” 是 Erlang 语言的一种设计哲学。当一个进程发生错误或异常时，不必尝试捕获和处理错误，而是让该进程崩溃，然后通过其他机制（如重启或恢复）来恢复系统的正常运行。


---

## Scala:解决对Java批评 1
:text-title{:t="Scala：为了解决对 Java 的批评" type=2}


接下来轮到了 Scala community 登场。该语言旨在解决 对 Java 的批评，一句话就以证明其含金量。他是一种 强大的静态类型高级通用编程语言，支持面向对象编程和函数式编程。

```
import java.time.LocalDate as Date
import Payment.*

val name = "Bib Fortuna"
val digits = 1983_0525_0000_0000L
val expires = Date.of(1983, 5, 25)

enum Payment:
  case Card(name: String, digits: Long, expires: Date)
  case PayPal(email: String)

def process(kind: Payment) = kind match
  case Card(name, digits, expires) =>
    s"Processing credit card $name, $digits, $expires"
  case PayPal(email) =>
    s"Processing PayPal account $email"

process(Card(name, digits, expires))
```

1. [Venkat Subramaniam ](https://dev.java/author/VenkatSubramaniam/): ACM 高级会员，[Programming Scala](https://pragprog.com/titles/vsscala2/pragmatic-scala/) 一书作者。

2. [Martin Odersky](https://en.wikipedia.org/wiki/Martin_Odersky): 他设计了 Scala。

---

## Clojure:不变数据结构 1

:text-title{:t="Clojure: 不可变数据结构" type="2"}

还有 [Clojure community](https://en.wikipedia.org/wiki/Clojure)。Clojure 是 [lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) 家族的一部分，或者说他是 Lisp 的现代化变体。他继承了 lisp 的特性。同时在并在并发和不变数据结构上做出了优化（Lisp 是可变的）

Lisp 发明和推广的 [S 表达式(S-expression)](https://en.wikipedia.org/wiki/S-expression) 还是很有特点的，例如一个计算式子：

```
(* (+ 1 2) (+ 3 4))

  + 1 2：表示加法操作，等于 3。
  + 3 4：表示加法操作，等于 7。
  *：表示乘法操作，将 3 和 7 相乘，结果是 21。
  
  如果是 Python 式子就是：

result = (1 + 2) * (3 + 4)
print(result)
```

到这里可能 Python 的式子比 S-expression 更接近传统的数学表达式。如果看到这那就可能认为 Lisp 还是不行，不如去学 Python。但 Lisp 还有一个特点是 [元编程（Metaprogramming）能力](https://en.wikipedia.org/wiki/Metaprogramming#:~:text=Metaprogramming%20is%20a%20computer%20programming,even%20modify%20itself%2C%20while%20running.) 指编写可以操作、生成、或修改程序代码的程序的能力。也就是 **——把代码当作数据来处理，从而实现动态的行为和更高的灵活性。**

```
;; 定义一个宏，用来生成“加法函数”
(defmacro make-adder (n)
  `(lambda (x) (+ x ,n)))

;; 使用宏生成一个加法函数
(defparameter add-five (make-adder 5))

;; 测试生成的函数
(format t "Result: ~A~%" (funcall add-five 10))  ; 输出 "Result: 15"
```

1. make-adder 是一个宏，它接收参数 n，并返回一个 新的函数代码：(lambda (x) (+ x ,n))。注意，这里返回的是代码，而不是一个值。
2. 宏的作用是在 编译时生成或修改代码，而不是像 Python 闭包那样只是生成行为。
3. 宏展开时，(make-adder 5) 会变成 (lambda (x) (+ x 5))，并且这个生成的函数将在运行时执行。

在上面这个例子中，`宏的定义实际上是操作代码的模板，生成新的 Code。` 如果是 Python，那么可以通过函数来生成一个加法函数：

```
def make_adder(n):
    return lambda x: x + n

# 使用函数生成一个加法函数
add_five = make_adder(5)

# 测试生成的函数
print(f"Result: {add_five(10)}")  # 输出 "Result: 15"
```

1. make_adder 函数返回了一个新的函数（lambda x: x + n）。
2. n 被捕获在闭包中，生成了一个 “动态的行为”：返回的函数始终会把输入值 x 加上 n。
3. 这只是动态生成了一个函数，而 没有生成或修改代码。我们只是定义了一个行为，而不是在代码层面进行操作。

Lisp、Clojure、Scheme 等语言通过其 S-expression 和宏系统提供强大的元编程能力。特点是代码即数据（homoiconicity），天然支持元编程；而 Python 通过反射和动态代码生成支持元编程，他的运行时动态性强，支持动态类型，如果要展示不可变结构，那下面的例子就很贴合：

```
(defn transform [person]
   (update (assoc person :hair-color :gray) :age inc))

(transform {:name "Socrates", :age 39})
;; => {:name "Socrates", :age 40, :hair-color :gray}
```

最后输出的还是 40，因为在这个过程中 `age` 通过 `inc` 函数进行了递增操作，所以是 40 而不是 39。这展示了 Clojure 的不可变结构的特性。所以，我们花了几个部分了解 Lisp 和 Clojure，不仅是处于了解，而是对 **一个具有悠久历史和独特的、完全括号的前缀表示法的编程语言家族。** 的敬意。

1. [Stuart Halloway](https://github.com/stuarthalloway): Clojure 协作者; [Programming Clojure](https://pragprog.com/titles/shcloj3/programming-clojure-third-edition/) 一书作者。
2. [Rich Hickey ](https://en.wikipedia.org/wiki/Rich_Hickey): Clojure 创建者。

---

## Haskell:纯函数语言 1

:text-title{:t="Haskell: 纯函数语言" type="2"}


还还还有 [Haskell community](https://en.wikipedia.org/wiki/Haskell)，Haskell 专为教学、研究和工业应用而设计。以逻辑学家[哈斯克尔・柯里 (Haskell Curry) ](https://en.wikipedia.org/wiki/Haskell_Curry) 的名字命名，他的研究之一 [Lambda 演算（Lambda Calculus）](https://en.wikipedia.org/wiki/Lambda_calculus) 是函数式编程的基础，同时他还是 [Currying](https://en.wikipedia.org/wiki/Currying) 的贡献者之一。

	•	在 Haskell 诞生之前，函数式编程语言如 Lisp、ML 等已经存在，但它们没有完全基于纯函数式的理念。
	•	Haskell 作为一门“纯函数式编程语言”，其命名体现了其与数学逻辑和 Lambda 演算的深厚联系。

所以，作为一个纯函数式的编程语言，它的式子是这样的：

```
-- 纯函数：输入相同，输出总是相同
add :: Int -> Int -> Int
add x y = x + y

-- 调用
main = print (add 3 5)  -- 输出 8
```

那么不是纯函数的是这样的：

```
counter = 0

def increment():
    global counter
    counter += 1
    return counter
```

1. [Phillip Wadler](https://en.wikipedia.org/wiki/Philip_Wadler): 创造的 [Orwell](https://en.wikipedia.org/wiki/Orwell_(programming_language)) 被认为是 Haskell 的先驱; Haskell 设计者之一。推动了函数式编程从理论研究到实际应用的转变。

2. [Simon Peyton Jones](https://en.wikipedia.org/wiki/Simon_Peyton_Jones): [GHC(The Glasgow Haskell Compiler, Haskell 编译器) ](https://en.wikipedia.org/wiki/Glasgow_Haskell_Compiler) 开发者之一，他推动了 [类型推导](https://en.wikipedia.org/wiki/Type_inference) 和 [类型安全](https://en.wikipedia.org/wiki/Type_safety) 的概念

---

# 前言 3
## 学习的快乐 1

:text-title{:t="前言"}

在本书的开篇，作者引用了 'How Proust Can Make You a Better Programmer' 直译为 《普鲁斯特如何让你成为更好的程序员》作者是 Erlang 的创建者 Joe Armstrong。这里有个小彩蛋，Marcel Proust 就是 'A la
recherche du temps perdu.' 的作者。也就是说出色的 Coder 需要具备耐心、有创造力、抽象思维、细节。这么表达还是比较抽象。

对于耐心、思考我们可以以一个 Bug 举例，假如你碰到了一个 Bug，少则几分钟多则几小时甚至几天。在这么个阶段中，不断的经历失败还没有放弃，还是非常难能可贵的。但如果你具备抽象思维的能力，那么可以换一个视角思考。

“既然我这样实现会碰到这样的问题，那么我换一种实现思路，是不是就能避免这样的问题，有概率陷入一个更简单或比这个问题更复杂的问题呢？”

::text-tip
“The Gmail editor cannot get typographic quotes right.”

- “Gmail 编辑器无法正确排版引号，例如：‘单引号’、“双引号””

“Disgraceful,” said Margery, “the sign of an illiterate programmer and a
decadent culture.”

- “可耻，”Margery 说，“这是文盲程序员和颓废文化的标志。”


“What should we do about it?”
- “我们应该怎么做？”


“We must insist that the next programmer we hire has read all of ‘A la
recherche du temps perdu.”’

- 我们必须坚持要求我们雇用的下一个程序员阅读《追忆似水年华》的全部内容。


“All seven volumes?”

- “全部七卷？”

“All seven volumes.”

- “全部七卷。”

“Will it make them better at punctuation and make them get their quotes
right?”

- “这会让他们更好地使用标点符号并正确引用吗？”

“Not necessarily, but it will make them a better programmer. It’s a Zen
thing....”
- “不一定，但它会让他们成为更好的程序员。这是禅宗的事情......”
::

这里的举例：”Gmail 编辑器无法正确排版引号，例如：‘单引号’、“双引号”“ 我觉得很大一部分原因是因为当时为了避免构造注入语句，然后又不想重构源数据所以就不渲染引号来得快些所导致的。即使现在是 2025 年，有些网站依然不允许除了 Gmail、Outlook、Yahoo、ProtonMail、Zoho 的邮箱注册账号。

这种做法通常是为了减少后端 API 针对一些特殊字符的处理和过滤。有些甚至是为了解决下 OWASP TOP TEN 的注入问题，因此这么做最保险的做法就是不允许传入特殊字符，比如 ‘“/.!@#*()!$) 这种。

::text-tip
Learning to program is like learning to swim. No amount of theory is
a substitute for diving into the pool and flailing around in the water
gasping for air. 
- 学习编程就像学习游泳。再多的理论也无法代替跳入游泳池并在水中挣扎呼吸的感觉。

The first time you sink under the water, you panic, but
when you bob to the surface and gulp in some air, you feel elated.
- 第一次尝试跳入水中时，你会感到恐慌，但当你浮出水面并大口呼吸时，你会感到兴奋。

You
think to yourself, “I can swim.” At least that’s how I felt when I learned
to swim.
- 你会想，“我会游泳。” 至少这是我学游泳时的感觉。
::

很多人第一次接触计算机时。其恐惧在于会不会将系统、硬件破坏掉，前期是系统环境，后期是服务器、数据库等。但经历过无数次重装系统和格式化之后，就会发现也没什么难的。于是就有了尝试的勇气，不断经历恐惧、失败，这正是 Code 所带来的体验。

::text-tip
It’s the same with programming. The first steps are the most difficult,
- 编程也一样。万事开头难，

and you need a good teacher to encourage you to jump into the water.
- 你需要一个好老师来鼓励你跳入水中。
::

Code 就像搭积木一样，如果你学习过后端相关的技术栈，例如 MVC。在未深入学习的时候，整个 Code 都显得很乱，所有功能都包含在一个文件中。动不动就是及千行几百行，但通过 MVC 这样的设计模式，一个功能就是一个文件的划分，就能很好的梳理整个项目的逻辑。Code 功能简洁明了，方便后续的维护与扩充。


::text-tip
Let’s assume that you’ve actually managed the difficult task of down-
loading and installing the interpreter or compiler for the language you
are interested in. 
- 假设你已经完成了下载并安装你感兴趣的语言的解释器或编译器这一艰巨的任务。

 What should you do next? What will be your first
program?
- 你下一步该做什么？你的第一个程序是什么？
::

看到这里的时候我大概已经知道作者整本书的意图了。即 ”自信“，我个人认为自信是比较难能可贵的。特别是互联网黑社会遍地走的今天，如何树立起自信是很难的。如果你创建了一个开源项目，那衡量你的就是 Star、Fork 甚至是有多少人在用。

如果出了点问题，有些人还会直接开喷。当然，这也是体验的一部分，毕竟挨骂的机会并不是谁都有的，免费打工的机会也不是什么人都行的，所以这也是一个很好的人生经历。因此如果您跨过此关，那么还会经历推广的阶段，因为 Code 厉害的大佬不一定圈子就多，所以即使 Code 再厉害，可能还没有那些比他 Code 不那么厉害的人 Star 多。

如果您恰好在 CHINA，那您在未来肯定会接触到一句话：”技术哪有推广重要“。也就是：”橘生淮南则为橘，生于淮北则为枳“

因此就跨入到比拼圈子和推广的阶段了，如果您是一个不善言辞、朝九晚五、循规蹈矩。没什么圈子的人，朋友就几个，那大概也就是 100+ Star。如果您混迹开源设计，各个群都是 200+，那么您大概是 1000+ Star。如果我是一个带货主播，那我会为你推荐 《被讨厌的勇气》，恰好我不是。

::text-tip
The first step in acquiring any new skill is not being able to do your own
thing but being able to reproduce what other people have done before
you.
- 获得任何新技能的第一步不是能够做自己的事情，而是能够复制别人在你之前做过的事情。

This is the quickest way to mastering a skill.
- 这是掌握技能最快的方法。
::

在引库调参和生成大模型的时代，独立思考以及实现某个比较基础的功能逻辑是比较难的。大多数人都会依赖于无数个包或库来实现需要的功能，甚至不需要了解这个功能怎么实现的就可以实现其想要的。这就是我对这句话的理解，但是在一些地方还有少数人认为，Copy 开源项目改一改加一个支付页面就是自己的，才是作者的意思。

作者在前言给出了一个很有含金量的逻辑。**学习一个语言，不需要了解其基础的原理实现，先理解其语法规则。知道怎么表达即可。** 我具有一些开发经验的读者肯定会感同身受，因为一个框架、一个语言，这一个版本是这样的写法，但过几个月、半年、一年。就会是另一个写法了，因此需要不断学习，不断花时间去适应和理解。

所以一些 Coder 倡导终身学习，学 Code 可以有效的避免老年痴呆。

::text-tip
Each language has its own set of idioms, its strengths, and its weak-
nesses. By learning several different programming languages, you will
be able to see which language is best suited to the kinds of problems
that interest you most.
- 每种语言都有自己的一套习语、优点和缺点。通过学习几种不同的编程语言，您将能够了解哪种语言最适合您最感兴趣的问题。

Ultimately, programming is
about understanding, and understanding is about ideas.
- 归根结底，编程就是理解，而理解就是想法。

So, exposure
to new ideas is essential to a deeper understanding of what program-
ming is all about.
- 因此，接触新想法对于更深入地了解编程的意义至关重要。
::

---

## 我那一事无成且一直在学习的一生 2
:text-title{:t="我那一事无成且一直在学习的一生"}

让我意外的是，这本书的前言竟然不是作者自己写的。而是 Erlang 的创建者 Joe Armstrong。我认为结尾处是比较具有讽刺意味的，如果一直学习，那么就会感觉自己超级菜，从而缺少了勇气去创建、编写一个项目，甚至是与人分享的喜悦。

如果你将自己的项目分享到某个群组，那个群组的人可能觉得你打广告，或者说炫耀？于是 Code 警察开始出动，不断的给你批斗拉踩甚至是网暴。跟你诉说你所做的无非是重复造轮子，毫无意义的事情。如果你的抗压能力不是很强，或许就开始退群退网、Github 设置为隐私三件套走起。

但你如果与 ChatGPT 分享一个项目、一个思路。TA 会先肯定你，然后提出可以优化的建议。虽然整个流程看起来很正常，属于非常理智的。但如果是几十人、几百人的群组，理智往往是那么的珍贵和稀缺，大概只有立场先行和整活、玩梗的存在。

::text-space
---
type: tip
---
A Zen master might tell you that to be better at mathematics you’d
better study Latin. Thus it is with programming. To better understand
the essence of OO programming, you should study logic or functional
programming (FP). To be better at FP, you should study Assembler.

- 禅师可能会告诉你，要想学好数学，最好学习拉丁语。编程也是如此。为了更好地理解面向对象编程的本质，你应该学习逻辑或函数式编程 (FP)。为了更好地掌握 FP，你应该学习汇编语言。

Books on comparative programming languages were popular when I
grew up as a programmer, but most of these were academic tomes that
gave little practical guidance to how to actually go about using a lan-
guage. This reflected the technology of the age. You could read about
the ideas in a language, but actually trying it out was virtually impos-
sible.

- 在我作为程序员成长的过程中，比较编程语言的书籍很受欢迎，但其中大多数都是学术性的大部头，几乎没有提供关于如何实际使用语言的实用指导。这反映了那个时代的技术。你可以阅读语言中的想法，但实际上尝试它几乎是不可能的。

Today, not only can we read about the ideas, but we can try them in
practice. This makes the difference between standing on the poolside
wondering whether it would be nice to swim and diving in and enjoying
the water.

- 今天，我们不仅可以阅读这些想法，还可以在实践中尝试它们。这使得站在泳池边想知道游泳是否好玩和跳进水里享受水的差别。

I warmly recommend this book and hope that you enjoy reading it as
much as I have.

- 我热烈推荐这本书，希望你和我一样喜欢阅读它。

<br>

Joe Armstrong, creator of Erlang<br> 2 March 2010 <br>Stockholm
::

---

# 介绍 2

:text-title{:t="章节介绍"}

学习第一种语言，可能是为了生活。但如果学习第二个语言，那大概是想扩充下自己或者为了职业道路更加宽阔。人类对于求知的需求是刻在其基因的，编程语言亦是如此。这本书所想传达的，并不是让你照着敲击 Code，而是思考其逻辑思维。


## 语言的核心概念 1
:text-title{:t="1.1 语言的核心概念" :type="2"}

<br/>

::text-tip
大部分时间里，当我学习一门新的编程语言或框架时，我会寻找一个快速的交互式教程。

但我的基本目标是快速地了解语言的语法糖和核心概念。
::

这样的经历我深有体会，但问题在于，学完了语言本体还是基础。有时还需要看各个库、包、插件、框架的文档。将这些散落在各地的积木拼装起来，抽象思维就显得非常重要，因为有时学了个语言本体还只是基础，框架再来上一个语法糖，又需要重新学习、反复学习。

作者在前期问了五个问题，也就是说读完了这本书，这七个问题都会迎刃而解。同时，这七个问题设计了语言的基础，即：

| 问题 | 类型 | 解释 |
| --- | --- | --- |
| 类型模型是什么？| 类型系统 | 是强类型（如 Java）还是弱类型（如 C）？是静态类型（如 Java）还是动态类型（如 Ruby）？ |
| 编程模型是什么？ | 编程范式 | 支持哪些编程模型（面向对象、函数式等）？ |
| 如何与语言交互？ | 交互方式 | 语言是编译型还是解释型？如何运行和调试？ |
| 决策结构和核心数据结构是什么？ | 语言的控制结构与核心数据结构 | 条件语句、集合操作的独特性。 |
| 语言有哪些独特的核心特性？ | 语言的独特特性 | 并发支持、宏系统、虚拟机等 |

::text-tip
When you’re through, you will not be an expert in any of these lan-
guages, but you will know what each uniquely has to offer.
- 阅读本书后，你或许无法成为这些语言的专家，但你将了解每种语言独有的优势。
::

在实际项目开发中，多语言配合是常见的。他们的关联桥梁就是数据的 CURD，各个语言实现的功能获取到的数据存入数据库。之后前端展示和交互逻辑的设计，后端将数据映射为 API 递交给前端或 View 来构成一个网页应用或客户端应用。

---

## 为什么选择这些语言 1
:text-title{:t="1.2 为什么选这几个语言？" :type="2"}

书中选择的七种编程语言（Ruby、Io、Prolog、Scala、Erlang、Clojure、Haskell）以及每种语言的选择理由和独特价值。作者表示，这些语言未必是最流行或最实用的，但它们在类型系统、编程范式、并发性、元编程等方面具有独特的学习价值：

1.	类型系统：涵盖了强类型、动态类型和静态类型的多样组合。
2.	编程范式：包括面向对象、函数式、逻辑编程、原型编程等多种范式。
3.	语言特色：如 Ruby 的元编程、Io 的简洁语法与消息分发、Prolog 的逻辑推理能力等。
4.	多样性：通过对比不同语言的特性，帮助读者理解各种编程思维方式的优劣。


以下是最终入选的语言及其选择理由：

| Lang | 理由 |
| --- | --- |
| Ruby | 面向对象语言，以易用性和可读性闻名。本书特别探讨了 Ruby 的元编程能力，展示其语法扩展的潜力。 |
| Io | 简洁的语法和消息分发机制是亮点。它是一种原型语言，强调并发模型，与 Lisp 有相似之处。 |
| Prolog | 强大的逻辑推理能力，特别适合解决问题（如数独）。对 Erlang 影响深远，适合逻辑驱动的场景。|
| Scala | 结合了函数式编程和 OOP，运行于 JVM。被认为是连接过程式编程和 OOP 的桥梁，对 Java 开发者非常友好。|
| Erlang | 专注于并发、分布式和容错性，是开发高可靠性系统的首选语言，像 CouchDB 就使用了 Erlang。 |
| Clojure | Lisp 方言，运行于 JVM，强调并发管理和灵活性。减少了传统 Lisp 的括号使用，并拥有丰富的 Java 生态支持。 |
| Haskell | 唯一的纯函数式语言，以强类型和不可变状态为特点，提供了一种更高效、更安全的编程方式。 |

::text-tip
Those languages that I picked are not necessarily the best, but each
one is unique, with something important to teach you.
- 我挑选的这些语言未必是最好的，但它们每一种都独特且有重要的东西值得学习。
::

---

## 出版社的背景 1
:text-title{:t="2 谁该看这本书？" :type="2"}

作者介绍了这家出版社，也就是 [Pragmatic Bookshelf](https://pragprog.com/) 这家出版社几乎技术性的书籍占比很多。毕竟名字直译过来就是:"实用书架"  这家出版社的创始人 David Thomas 曾经还写过一本书叫 ["The Pragmatic Programmer"](https://en.wikipedia.org/wiki/The_Pragmatic_Programmer) 直译过来就是：“务实的程序员”。并定义了务实的程序员具有以下品质：

1. 早期采用者
2. 快速适应
3. 好奇心和批判性思维
4. 现实主义以及万事通。

这本书还提到了 [破窗理论（Broken Windows Theory）](https://en.wikipedia.org/wiki/Broken_windows_theory)、[石头汤（Stone Soup）](https://en.wikipedia.org/wiki/Stone_Soup)、[煮青蛙（Boiling Frog）](https://en.wikipedia.org/wiki/Boiling_frog)、[不要重复自己（DRY：Don’t Repeat Yourself）](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)、[橡皮鸭调试法（Rubber Duck Debugging）](https://en.wikipedia.org/wiki/Rubber_duck_debugging) 这些故事在开发中的类比。

| 故事 | 介绍|
| --- | --- |
| 破窗理论 | 如果一个建筑有一扇窗被打破，而没有及时修复，那么很快其他的窗户也可能被破坏。</br>这个现象说明一个破损的小问题可能会导致更大的问题。 |
| | 忽视代码中的小问题（如糟糕的命名、不规范的格式）可能会导致代码质量持续恶化，最终变得难以维护。</br>保持代码整洁可以防止项目走向失控。|
| 石头汤 | 几个旅人告诉村民他们可以用一块石头煮汤，但需要一些配料。</br>村民们好奇地贡献了蔬菜、肉类等材料，最终煮出了一锅美味的汤。 |
| | 通过激发团队成员的贡献精神，即使从零开始也可以集体创造出伟大的成果。 |
| 煮青蛙 | 如果把青蛙直接放入沸水中，它会立刻跳出；但如果放在温水中慢慢加热，它可能会因为没有注意到渐变的危险而被煮死。|
| | 开发团队可能会对项目中的缓慢恶化（如技术债累积或功能蔓延）视而不见，直到问题变得不可逆转。 |
| 不要重复自己 | 一个知识或功能点在代码中应该只有一个唯一的表示。 |
| | 减少冗余代码，提高维护性和可读性。|
| 橡皮鸭调试法 | 通过向一只橡皮鸭解释代码来发现问题。在讲解过程中，可能会自己发现逻辑上的错误。|
| | 通过向别人解释问题（甚至是向一只鸭子），你能够重新审视自己的思路，找到盲点。 |

作者还阐述了一个非常直观的观点：

::text-tip{type="big"}
编程范式每隔十年左右就会发生变化。
::

作者从 Ruby 入手实验 Web 开发，在完成一些成功的项目后，将职业方向转向 Ruby 开发，并未后悔。	•	这一切源于基本的实验，逐步发展为更深入的探索。

-	范式转变的历史教训：

很多人可能不记得编程范式上一次转变的时代。从结构化编程向面向对象编程的转变经历了几次波折。

- 旧的范式（结构化编程）无法应对现代 Web 应用的复杂性。
- Java 的成功推动了 OOP 的流行，使其成为主流。
- 然而，许多开发者不得不重新学习新工具和设计方法。

- 当前趋势：

我们可能正在经历另一场转变，这次由新型计算机设计驱动。本书的七种语言中，有五种提供了强大的并发模型（Ruby 和 Prolog 除外）。

1. Io 的未来值实现
2. Scala 的 actor 模型
3. Erlang 的“崩溃即修复”哲学
4. Haskell 对可变状态的彻底摒弃
5. Clojure 用版本化解决复杂并发问题

Erlang 的例子：Erlang 在云数据库（如 CouchDB）背后发挥了重要作用，其语言基础源于 Prolog。


---

# 基础 2

:text-title{:t="面向对象" :type="2"}

## 面向对象 1

Ruby 是一种解释型、面向对象、动态类型的语言，属于所谓的脚本语言家族。因此我们需要了解，解释型、动态类型、面向对象到底是什么个概念，以及他们的具象化实现：


| 特点 | 概念 |
| --- | --- |
| 解释型 | 代码由解释器直接执行，而不是通过编译器先转换为机器码。|
| 动态类型 | 数据类型在运行时绑定，而不是在编译时。这种策略通常在灵活性与执行安全性之间权衡。 |
| 面向对象 | 支持封装（将数据和行为打包在一起）、继承（通过类组织对象类型）、多态（对象可以以多种形式出现）。 |

解释型和动态类型我们在致谢阶段就已经有了了解，那么面向对象几乎是一个家喻户晓的特性。要理解其对象，我们需要想象一个场景：

你在开发一个“动物园管理系统”。这个系统需要记录动物的信息，比如名字(name)、种类(species)，以及它们会发出的声音。用面向对象的方法来设计系统。

```python
# 定义一个类
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

    def speak(self):
        print(f"{self.name} makes a sound.")

# 创建对象
dog = Animal("Buddy", "Dog")  # 狗狗对象
cat = Animal("Whiskers", "Cat")  # 猫咪对象

dog.speak()  # 输出: Buddy makes a sound.
cat.speak()  # 输出: Whiskers makes a sound.
```

类（Class）
- 类就像一张蓝图，定义了某一类东西的共同特性和行为。
- 动物的蓝图：每只动物都有名字（name）和种类（species），而且都会发出声音。

对象（Object）
- 对象是具体的东西，是从类里“制造”出来的实例。
- 动物类中的“狗狗”对象，名字是“Buddy”，种类是“狗”。

方法 (Method）
- 绑定到特定对象的行为
- 定义在类中的函数，必须通过对象调用，例如 `speak` 

如果没有面向对象，可复用性几乎为 0：

```
# 没有类，每只动物都要单独定义
dog_name = "Buddy"
dog_species = "Dog"

cat_name = "Whiskers"
cat_species = "Cat"

def dog_speak():
    print(f"{dog_name} makes a sound.")

def cat_speak():
    print(f"{cat_name} makes a sound.")

dog_speak()
cat_speak()
```

---

:text-title{:t="面向对象的四大特性"}

:text-title{:t="封装" :type="2"}

- 保护数据，隐藏细节

想象你在操作一辆车,你不需要知道引擎如何运作，只需要按下启动按钮。程序中，类可以“隐藏”它内部的细节，外部只需要调用公开的方法。

```
class Car:
    def __init__(self, brand):
        self.__engine_on = False  # 私有变量，外部无法直接访问
        self.brand = brand

    def start_engine(self):  # 提供方法启动引擎
        self.__engine_on = True
        print(f"{self.brand} engine started.")

car = Car("Toyota")
car.start_engine()  # 输出: Toyota engine started.
```


:text-title{:t="继承" :type="2"}

- 复用代码

假如动物园里有很多动物，很多行为是相似的，比如“发出声音”。我们可以用“动物”作为父类，然后让“狗”和“猫”继承它，省去重复代码。

```
# 定义一个类
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

class Dog(Animal):  # Dog 继承自 Animal
    def speak(self):  # 重写 speak 方法
        print(f"{self.name} barks!")

class Cat(Animal):  # Cat 继承自 Animal
    def speak(self):
        print(f"{self.name} meows!")

dog = Dog("Buddy", "Dog")
cat = Cat("Whiskers", "Cat")

dog.speak()  # 输出: Buddy barks!
cat.speak()  # 输出: Whiskers meows!
```

Dog 和 Cat 类继承了 Animal 类：
- Dog 和 Cat 类没有重新定义 `__init__` 方法，但它们可以直接用 Animal 类的` __init__` 方法来初始化名字和种类。

子类扩展父类
- Dog 和 Cat 类在继承了 Animal 的基础上，增加了自己的特性（如 `speak()` 方法）。

<br>

```
dog = Dog("Buddy", "Dog")
```

创建 dog 对象时，Dog 类没有自己的 `__init__` 方法，所以调用了 Animal 类的 `__init__` 方法。

`self.name` 被赋值为 "Buddy"，`self.species` 被赋值为 "Dog"。


:text-title{:t="多态" :type="2"}

多态（Polymorphism）是面向对象编程中的一个重要概念，指的是同一个接口（方法），在不同对象上表现出不同的行为。

```
# 定义一个类
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species

class Dog(Animal):  # Dog 继承自 Animal
    def speak(self):  # 重写 speak 方法
        print(f"{self.name} barks!")

class Cat(Animal):  # Cat 继承自 Animal
    def speak(self):
        print(f"{self.name} meows!")

animals = [Dog("Buddy", "Dog"), Cat("Whiskers", "Cat")]

for animal in animals:
    animal.speak()  # Buddy barks! 和 Whiskers meows!
```

**“一个接口，不同表现”**

- 这里的接口就是 `speak()` 方法。

Dog 和 Cat 类都实现了`speak()` 方法，但它们的表现不同
- Dog 的 `speak()` 输出的是 "Buddy barks!"
- Cat 的 `speak()` 输出的是 "Whiskers meows!"

**为什么这是多态？**

```
animals = [Dog("Buddy", "Dog"), Cat("Whiskers", "Cat")]

for animal in animals:
    animal.speak()
```

调用 `animal.speak()` 时，不关心 animal 是 Dog 还是 Cat，程序会自动根据 `animal` 的实际类型调用相应的 `speak() ` 方法。

一个通用的方法（`speak()`），在不同对象上实现了不同的行为（狗叫或猫叫）。

**多态的特征**

父类引用可以指向子类对象

```
animals = [Dog("Buddy", "Dog"), Cat("Whiskers", "Cat")]
```

列表中的元素类型是 Animal（父类）的引用，但它们实际是 Dog 和 Cat 的对象（子类）。

动态绑定（动态多态）
- 在运行时，根据对象的实际类型调用相应的方法，而不是编译时决定。例如：

```
for animal in animals:
    animal.speak()
```

每次调用 speak()，Python 会根据 animal 的实际类型（Dog 或 Cat），执行不同的 speak() 方法。

意义在于增强了代码的灵活性和可扩展性。以下是两大好处：

- 统一接口，简化代码
- 方便扩展

不需要为每种动物分别写逻辑，只需调用 speak() 方法即可：

```
for animal in animals:
    animal.speak()
```

无论是 Dog 还是 Cat，只要它们有 speak() 方法，就可以统一处理。

如果以后新增一种动物，比如 Bird，只需定义它的类并实现 speak() 方法，无需修改已有代码：

```
class Bird(Animal):
    def speak(self):
        print(f"{self.name} chirps!")

animals = [Dog("Buddy", "Dog"), Cat("Whiskers", "Cat"), Bird("Tweety", "Bird")]

for animal in animals:
    animal.speak()
```

:text-title{:t="抽象" type="2"}

理解“抽象”是理解面向对象的一个关键点，我们从现实中的例子来解释为什么“抽象只关注核心功能”。

在一个动物园管理系统中，管理员需要统计各种动物的叫声，但管理员不关心具体是哪种动物，只需要知道它们会“说话”即可。因此，我们用抽象类 Animal 定义了所有动物的共同特性，并让具体的动物（如狗和猫）实现各自的叫声。

```
from abc import ABC, abstractmethod

class Animal(ABC):  # 抽象类：定义动物的核心功能
    @abstractmethod
    def speak(self):
        pass  # 动物都会叫，但具体怎么叫由子类决定

class Dog(Animal):  # 子类：具体实现
    def speak(self):
        return "Bark!"

class Cat(Animal):  # 子类：具体实现
    def speak(self):
        return "Meow!"

# 使用抽象类
animals = [Dog(), Cat()]  # 动物园里有狗和猫
for animal in animals:  # 遍历动物，不关心具体是哪种
    print(f"The animal says: {animal.speak()}")  # 统一调用接口获取叫声
```

**为什么抽象只关注核心功能？**

1. Animal 只定义了 speak() 方法，说明每个动物都能“发声”，这是核心功能。
2. 子类（Dog 和 Cat）实现各自的细节，用户只需调用 speak()，不必关心内部逻辑。

抽象简化了程序的逻辑，只暴露必要的功能，隐藏了实现的复杂性。

---

## 声明式语言 2
:text-title{t="声明式语言"}


**特点 1: 描述“做什么”，而非“怎么做”** <br>
例如 SQL 的 `SELECT name FROM students WHERE age > 18;`

::text-tip
描述性逻辑：查询所有名字，满足条件年龄大于 18。
无需考虑数据库如何执行索引、扫描、排序等。
::

<br>

**特点 2: 高层次抽象** <br>
声明式语言提供了 **更高的抽象层次，屏蔽底层的实现细节**。通过简单的规则、事实、函数等描述问题，降低开发者的认知负担。

<br>

**特点3: 更接近自然语言** <br>
声明式语言往往用更直观、逻辑性强的方式表达程序，接近人类思维方式。

```
range(1, 10).filter(even).sum()
替代 sum = 0; for (i = 1; i <= 10; i++) { if (even(i)) sum +=i; } return sum;

---
抽象程度高，屏蔽了低层次的逻辑，专注于问题的核心逻辑。
```

**特点 4: 自动推理与隐式实现** <br>
声明式语言将 **实现细节交给底层引擎处理，如推理、优化或并发处理。**

- Prolog：描述规则后，Prolog 会自动推断出答案，无需手动编写具体逻辑。
- SQL：数据库管理系统自动选择最优查询路径（如索引优化）。
- CSS: 你只管描述效果，接下来由浏览器引擎实现。


---

## REPL 2
:text-title{t="REPL" type="2"}

REPL(Read-Eval-Print Loop)，是一种交互式编程环境，可以一行一行地输入代码，立即看到结果，非常适合学习、测试和调试。每个单词都有其含义，很方便理解：

| Name | Info | Exp |
| --- | --- | --- |
| Read | 读取输入的表达式 | 你输入一行 Code |
| Eval | 计算表达式的结果 | 解释器执行这段 Code |
| Print | 打印输出结果 | 将计算结果显示在终端上 |
| Loop | 回到开头等待下一行输入 | 循环执行下一条命令 |

这个我们都很熟悉，比如你可以输入 `node` 进入 node.js 的 REPL，输入 `python` 进入 python 的 REPL。当然我一般比较懒，在学习某个语言的时候，例如我不会用到的，例如 io lang、prolog 我会用在线的 REPL 环境，例如 [TIO.RUN](https://tio.run/#) 以及 Lang community 提供的在线 REPL 环境，例如 Scala 的 [scastie](https://scastie.scala-lang.org/)。

---

## EDA 2
:text-title{t="事件驱动架构" type=2}

[事件驱动架构（EDA, Event-driven architecture)(https://en.wikipedia.org/wiki/Event-driven_architecture) 一句话概括就是以 **事件驱动的** 。要理解 EDA 很简单的方式就是了解事件。其核心思想是 **系统中的行为由“事件”的发生来驱动**，例如:

```
[User Clicks Button]
      ↓
[Event Producer: UI 层构造 ClickedEvent]
      ↓
[Event Channel: Kafka 传递事件]
      ↓
[Event Processor: Akka Actor 解析并调用服务]
      ↓
[Downstream: 更新订单系统，发送确认邮件]
```

1.事件发布者(Event producer)
- 用户点击了按钮（UI事件）
- 文件上传成功（系统事件）
- 新订单创建（业务事件）
- 接收到一条消息（网络事件）


2.事件通道(Event producer)
- 事件传递的媒介（如消息队列 Kafka、Akka EventStream）

3.事件处理引擎（Event Processing Engine）
- 负责识别事件、执行业务逻辑，触发下游动作。
- 业务反应：更新库存、发送通知、调用微服务
- 规则判断：结合业务规则系统进行复杂事件处理（CEP）

4.下游事件驱动行为（Downstream Event-Driven Activity）
- 事件处理结果带来的后续行为，可是自动的，也可能是通知型的。
- 通知类操作：发送邮件、短信、推送消息
- 状态更新：更新数据库、状态缓存
- 触发新的事件：继续发出后续事件，形成事件链
- 系统响应：响应用户 UI，改变页面内容

这些“事件”被捕捉到之后，会通知相应的处理逻辑去做一些事。上面这四个逻辑叫 "Event flow layers(事件流层)":

| 层级 | 名称                     | 功能描述 |
|------|--------------------------|----------|
| 1    | **Event Producer**       | 监听/感知事件，构造为事件结构。可为传感器、系统、服务。 |
| 2    | **Event Channel**        | 事件传递通道。负责把事件从生产者发送到处理者（消息队列、TCP、日志等）。 |
| 3    | **Event Processing Engine** | 核心业务逻辑。判断事件类型，做出反应、触发动作。 |
| 4    | **Downstream Activity**  | 后续动作，如发送通知、更新数据库、触发下游服务等。 |


预支相对应的还有很多类型的驱动，例如：

| 驱动方式           | 核心触发点     | 特点/用途                          | 示例或代表技术         |
|--------------------|----------------|-------------------------------------|-------------------------|
| 事件驱动           | 系统中事件     | 解耦、并发好                       | Akka, Kafka, ZIO        |
| 请求/命令驱动      | 明确调用       | 同步逻辑、明确流向                 | REST API, RPC, CQRS     |
| 数据驱动           | 数据变化       | 数据核心、处理流程灵活             | ETL, Pandas, SQL Trigger|
| 配置驱动           | 配置文件       | 灵活部署、低代码                   | Spring Boot, Kubernetes |
| 时间驱动           | 时间点         | 定时任务、周期性处理               | Cron, Airflow, Spark    |
| 状态驱动           | 状态转移       | 有限流程系统、自动机控制           | FSM, 工作流引擎         |
| 用户驱动           | 用户输入       | 高交互性 UI 系统                   | React, Android, Game    |
| 测试驱动开发       | 单元测试       | 代码质量好、文档即测试             | JUnit, ScalaTest        |


---

## 函数式核心 2
:text-title{t="函数式编程的核心"}

函数式编程的核心就是 **高阶函数** 和 **模式匹配**, 在此之前我只知道他们做什么，能实现出什么效果。而不知道它们叫什么（这就是没有系统性学习的弊端，上限低下限也低）：

::text-space
---
type: tip
---
高阶函数是一个更高层的抽象，它的核心是 **把函数当作一种可传递、可组合的“工具”**，而不是单纯的数据。能够接收函数作为参数，或者返回函数作为结果的函数”

| 高阶函数(HOF) | 普通函数 |
| --- | --- | 
| 允许你自己换榨汁模块（输入橙子+榨苹果模块→输出苹果汁）| 固定做橙汁（输入橙子→输出果汁）|
::

| NAME | INFO | 
| --- | --- |
| [lists:map/2](https://www.erlang.org/docs/23/man/lists#mapfoldl-3) | 对列表中的元素求和并同时对其进行双精度运算 |

下面的 code 涵盖了高阶函数、匿名函数以及函数引用，类似于这样的效果：


```
+----------------------+             +----------------------+          +----------------------+
|    (lists:map/2)     <-----+       |   (fun(X) -> ...)    |          |   (fun Module:F/A)   |
|         HOF          |     +-------|  anonymous function  |          |  function reference  |
+----------------------+             +----------------------+          +----------------------+
           ^                                     ^                                 ^           
Receive the function                 Provisional |                      Point to an existing   
as a parameter                       definition  |                      function               
           |                                     |                                 |           
           |                                     |                                 |           
           |                                     |                                 |           
           |                                     |                                 |           
+----------------------+             +----------------------+          +----------------------+
|     [1,2,3,4,5]      |             |     (X*2, X*X……)     |          |  (string:to_upper)   |
|      data list       |             |  logical processing  |          | Reuse existing logic |
+----------------------+             +----------------------+          +----------------------+

-module(main).
-export([start/0]).

start() ->
    % 例子1: 将列表中的每个数字乘以2
    Numbers = [1, 2, 3, 4, 5],
    Doubled = lists:map(fun(X) -> X * 2 end, Numbers),
    io:format("source: ~p~n", [Numbers]),
    io:format("1 Doubled: ~p~n", [Doubled]),

    % 例子2: 将字符串列表转换为大写
    Words = ["hello", "world", "erlang"],
    Uppercase = lists:map(fun string:to_upper/1, Words),
    io:format("Source: ~p~n", [Words]),
    io:format("2 Uppercase: ~p~n", [Uppercase]),

    % 例子3: 计算每个数字的平方
    Squares = lists:map(fun(X) -> X * X end, Numbers),
    io:format("3 Squares: ~p~n", [Squares]),

    % 例子4: 使用自定义函数
    ProcessedList = lists:map(fun process_element/1, Numbers),
    io:format("4 ProcessedList: ~p~n", [ProcessedList]),

    % 例子5: 处理元组列表
    People = [{tom, 25}, {alice, 30}, {bob, 35}],
    Ages = lists:map(fun({_Name, Age}) -> Age end, People),
    io:format("4 age: ~p~n", [Ages]).

% 模式匹配
process_element(X) when X > 3 ->
    {big, X};
process_element(X) ->
    {small, X}.
```

erlang 是用函数式风格（无状态、纯函数、高阶函数）处理数据，不过也可以通过 `Process` 写成类似面向对象的风格。如果是 OOP 风格，那么就会有封装的感觉。

---

# Ruby 1

:text-title{:t="01 Ruby"}

作者将 Ruby 列入本书的理由是：

::text-tip
这是一种面向对象的语言，以易用性和可读性著称。我曾短暂考虑不包括任何面向对象语言，但后来发现将不同编程范式与 OOP（面向对象编程）比较是很有价值的，所以至少包括一种 OOP 语言很重要。
在这本书中，我深入探讨了 Ruby 的元编程，展示了如何扩展其语法，我对最终的结果非常满意。
::

<br>

::text-tip{type="big"}
每种语言都有他的特性和独特的点
::

作者以 Java 和 Visual Basic 、Ruby 描述成一个性格：


| 语言 | 性格 |
| --- | --- |
| java | 像一个富有的律师哥哥。年轻时很有趣，但现在成了一个 “黑洞”，吸走周围一切乐趣。 |
| Visual Basic | 像一个染着漂白金发的美容师。她可能解决不了全球变暖，但总能给你理个好发型，而且与她聊天总是特别愉快。 |
| Ruby | 她有点古怪，总是优雅美丽，略显神秘，还充满魔力。|
| C 语言家族 | 严苛高效但毫无乐趣，就像每天晚上要喝一口鱼肝油的日子。 |

Ruby 虽然这个保姆也是要督促你喝鱼肝油，但她会加一颗糖奖励你。通过增添趣味和激励热情，让家庭更高效。 引出了 Ruby 的哲学：

- C 家族的目标是让机器运行得更高效，因此对底层细节的掌控更严格，但对程序员的友好度较低。
- Ruby 的目标是让开发者工作得更高效，它更注重开发体验和代码的可读性，使编程变得更愉快、更直观。

当我们了解完面向对象的时候，反过头来再看 Ruby 的 Code 

```
properties = ['object oriented', 'duck typed', 'productive', 'fun']
properties.each { |property| puts "Ruby is #{property}." }

---

Ruby is object oriented.
Ruby is duck typed.
Ruby is productive.
Ruby is fun.
```

莫名的有些简洁，凸显了语法糖的魅力，确实让 Ruby 的语法糖让代码书写更加简洁优雅，减少冗余，提升可读性。例如代码块的使用使集合操作变得直观高效。


---

## 与 Matz 的访谈 1

:text-title{:t="采访 Yukihiro (Matz) Matsumoto" type="2"}

作者来到了 Matz 的家乡采访到了 Matz（真的能在家乡碰到 Matz 吗？)

**为什么开发 Ruby？**

我从接触计算机开始就对编程语言产生了兴趣。它们不仅是编程的工具，还能拓展我们的思维方式。很长一段时间，我把研究编程语言当作一种爱好。我实现过几个玩具语言，但都不是真正的语言。

到了 1993 年，我接触到 Perl，受到了启发。我觉得如果能将 Lisp、Smalltalk 和 Perl 的特点结合到一个面向对象的语言中，这会是一种极大提高生产力的工具。因此，我开始开发这种语言，并将其命名为 Ruby。

最初这只是一个爱好，为了让自己开心。没想到其他程序员竟然也喜欢上这门语言以及背后的设计理念，结果它比我预期的受欢迎得多。

**最喜欢 Ruby 的哪一点？**

我喜欢它让编程变得愉快。就技术而言，我最喜欢的是 代码块（blocks）。它们是被驯化的高阶函数，打开了构建 DSL（领域特定语言）以及其他功能的可能性。

**如果能回到过去，有什么想改的？**

我会移除线程，加入更高级的并发模型，比如 actors（角色）或其他机制。

- Ruby 的线程模型一直被批评为不够现代化。Matz 自己也提到，如果重新设计 Ruby，他会选择更先进的并发模型（如 Actor 模式），来应对并发编程的复杂性。

---

## 语言的基础概括 1

:text-title{:t="语言的基础概括"}

接触一个语言时，要了解该语言的 **核心编程模型、它如何处理数据类型？**。也就将一个语言概括了两个问题，即：

1. 这门语言的设计理念是什么？是面向对象、函数式还是其他编程范式？
2. Ruby 是动态类型语言，它如何简化类型的使用？它怎么就高效了？

但是 2025 年这个较为浮躁的环境，我可能还会加一个：

3. 这个语言的生态系统怎么样？能否轻松的实现我想要的功能？有没有比较活跃的库、插件维护社区？

但是对于一些第三点不足的来说，可能是一个机会，但还是要看运气。万一人家自己都放弃不维护了，那作为生态开发者，又该如何应对？有时候这种事情是相互成就的。使用该语言的人数越多，那么生态就越完善，生态维护者也能享受到一定的开源声誉。


### 解释型与编译型 1

:text-title{:t="解释型与编译型语言的区别" type="2"}

这里引出了两个概念，解释型语言和编译型语言的区别：

| 特性 | 解释执行（Interpreted） | 编译执行（Compiled） |
| --- | --- | --- |
| 源代码处理方式 | 逐行解释，实时执行 | 编译一次生成机器代码，后续执行直接运行 |
| 执行速度 | 较慢 | 较快 |
| 调试与修改 | 简单，修改后可立即看到效果 | 需要重新编译，调试较为复杂 |
| 生成的文件 | 无需生成可执行文件，直接运行源代码 | 生成独立的可执行文件 |
| 适用场景 | 快速开发、脚本语言、教学和原型开发 | 需要高性能的系统开发和大型应用开发 |

看到这你可能就会问了，有没有一种语言支持解释型和编译型同时存在的？以下是比较有代表性的，同时支持解释执行和编译执行的语言：

| 语言        | 编译执行                           | 解释执行                           |
|-------------|------------------------------------|------------------------------------|
| Java        | 编译成字节码 (.class)，由 JVM 执行 | 通过 JVM 解释字节码或 JIT 编译成机器码 |
| Python      | 编译成字节码 (.pyc)，通过 JIT 优化 | 解释执行字节码，或通过 JIT 转换为机器码 |
| JavaScript  | 编译成字节码，V8 引擎执行          | 解释执行字节码，或 JIT 优化热代码 |
| C#          | 编译成中间语言 (IL)，由 CLR 执行   | CLR 将 IL 转换为机器码并执行（JIT） |
| Ruby        | 编译成字节码                       | 由解释器执行字节码，或通过 JIT 优化 |

#### 混合模式常见漏洞 2

:text-title{:t="混合模式常见漏洞" type="2"}

这种混合模式下也会存在一些缺点，比如性能、 安全性的问题。比如针对即时编译(JIT,Just-in-time compilation) 存在的几个具有代表性的 CVE 编号：

1. **CVE-2019-5786 - V8 JIT 编译器漏洞**
   - **影响**：Google Chrome
   - **描述**：V8 引擎的 JIT 编译器漏洞，攻击者通过恶意 JavaScript 代码可能导致内存损坏，执行任意代码。
   - **修复**：Google 发布补丁更新 V8 引擎。

2. **CVE-2020-11008 - JScript 和 VBScript 引擎漏洞**
   - **影响**：Microsoft Edge, Internet Explorer
   - **描述**：通过构造恶意网页，攻击者可触发 JIT 编译器内存损坏，执行任意代码。
   - **修复**：Microsoft 发布安全更新。

3. **CVE-2018-5292 - Firefox JIT 编译器漏洞**
   - **影响**：Mozilla Firefox
   - **描述**：Firefox 的 JIT 编译器漏洞，允许攻击者通过恶意网页导致内存访问错误，执行恶意代码。
   - **修复**：Mozilla 发布修复补丁。

4. **CVE-2017-0199 - Microsoft Office JIT 漏洞**
   - **影响**：Microsoft Office
   - **描述**：通过恶意 Office 文件，攻击者利用 JIT 漏洞执行任意代码。
   - **修复**：Microsoft 发布安全更新。

5. **CVE-2015-5167 - JIT 编译中的整数溢出漏洞**
   - **影响**：Apple WebKit
   - **描述**：WebKit 的 JIT 编译器整数溢出漏洞，导致内存损坏，执行恶意代码。
   - **修复**：Apple 发布修复补丁。

在 JIT 编译中，常见的攻击手法如 JIT spraying，俗称 JIT 喷射。攻击者通过利用 JIT 编译的特性，向堆中注入恶意数据，从而使堆内存变为可执行的。当攻击者能够控制堆的内容并将代码执行转移到堆内存中时，就可能会发生安全漏洞。通过这种方式，攻击者可以执行任意代码，从而威胁系统的安全性。

JIT 的工作原理就是源代码或字节码转换为机器代码，并直接在内存中执行，而不是先写入磁盘再执行。虽然提高了工作效率，但由于现代的操作系统存在内存保护的机制，因此会将 JIT 进行标记然后执行，如果内存可 W^X（即可写/可执行内存），那就会从中找到攻击的点进行利用。


## 类型系统 1

:text-title{:t="类型系统" type="2"}

作者通过在这一章引出了类型系统的概念，Ruby 的设计哲学。强类型我们都知道，比如以下 code：

```ruby
irb(main):002:0> x = 1 - 1
=> 0
irb(main):003:0> x = 1 - 'one'
Traceback (most recent call last):
        5: from /usr/bin/irb:23:in `<main>'
        4: from /usr/bin/irb:23:in `load'
        3: from /Library/Ruby/Gems/2.6.0/gems/irb-1.0.0/exe/irb:11:in `<top (required)>'
        2: from (irb):3
        1: from (irb):3:in `-'
TypeError (String can't be coerced into Integer)
```
Ruby 是强类型的，这意味着当类型不匹配时你会得到一个错误。Ruby 会在运行时进行这些类型检查，而不是在编译时。

### 鸭子类型 1

:text-title{:t="鸭子类型" type="2"}

鸭子类型的核心就是一个谚语：

::text-tip{type="big"}
**如果它看起来像鸭子，游泳像鸭子，叫起来像鸭子，那么它可能是一只鸭子。** <br>
If it looks like a duck, swims like a duck, and quacks like a duck, then it probably is a duck.
::

鸭子类型源自于溯因推理，也被称之为反向推理，它是开始于事实的集合，并推导出其最佳解释的推理过程。我们同样可以将那个谚语扩充以下到 WAF 中：


::text-tip
如果这个用户的请求头看起来很神秘，操作也很凌乱，经常请求些隐秘数据，那么他一定不怀好意
::

```ruby
>> i = 0
=> 0.0
>> a = ['100', 100.0]
=> ['100', 100.0]
>> while i < 2
>> puts a[i].to_i
>> i = i + 1
>> end
100
100
```

上面 code 中， `'100'` 是字符串，而 `100.0` 是浮点数，但在 ruby 运行时来看，100.0 是 100,‘100' 也是 100 所以这是鸭子类型的应用效果。

:text-title{t="猴子补丁" type="2"}

## 猴子补丁 1

在 Ruby 中，开放类(Open classes) 被叫作[猴子补丁(Monkey Patch)](https://en.wikipedia.org/wiki/Monkey_patch#:~:text=In%20computer%20programming%2C%20monkey%20patching,altering%20the%20original%20source%20code.)。指的是通过动态修改现有的类或模块来增加、修改或替换它们的功能。这种做法使得原本不支持某些功能的类能够在运行时被修改，从而增加新的行为。

虽然这种做法可以作为元编程的特性，但也有一些安全问题，演变成为了一种攻击手法。例如 [CVE-2024-21896](https://access.redhat.com/security/cve/CVE-2024-21896) 通过猴子补丁修改 Buffer 内部实现，导致路径遍历漏洞的问题。

---

# Io Lang 1
:text-title{:t="Io Lang"}

第一次看到 IO 还有点意外，我联想到了 I/O、甚至是 CS 很火的信息学奥林匹克竞赛（英语：Olympiad in Informatics，简称：OI）后者让我有联想的是太多互联网很社会参加这个比赛了，看到初中高中的大放异彩很难不觉得自己是个废物的实事。这些大佬参加 IO 后还会去打 CTF，然后刷 hackthebox、以及各种靶场。当然像我这样的只能提交个签到题，虽然不知现在签到题难度如何。

在我 15 岁的时候接触到了一点，做了个签到题没想到还会记录至今。[Real World CTF 2019 Quals](https://ctftime.org/team/87624)。没想到现在长亭已经给阿里收购了，不过长亭这个名字挺好听的，最近我还听到了一个名字叫「基调听云」也是很好听，一看就是注册资本没到 1000w 不给注册的那种存在。(有一说一长亭之前的官网有点 low，现在虽然慢慢变帅了，但是移动端有点小问题，不过不是我样的 loser 能评价的)

我了解过 IO 的历史，根据维基百科的介绍：

::text-tip
该语言由 Steve Dekorte 于 2002 年创建，当时他试图用他的语言 Cel 来帮助朋友 Dru Nelson。他发现自己确实不太了解语言的工作原理，并开始编写一种小型语言来更好地理解问题。
::

看到这时我开始深深反思为什么我没有一个为了教会我语言而去编写一个语言的好朋友。如果要在线体验 Io lang 可以使用 [Tio.run](https://tio.run/) （看 Io lang 的 Twitter 发现的好用工具）

---

## 对象、原型和继承 2
:text-title{:t="对象、原型和继承"}

Io lang 可以更好的理解对象、原型以及继承，因为他是基于原型的面向对象语言:


```
   +----------------+                                   
   |                |                                   
+->|     object     |                                   
|  |                |                                   
|  +----------------+                                   
|                                                       
|  +----------------+                                   
|  |                |                                   
+->|    Vehicle     |                                   
|  |     +----------+----------------------------------+
|  +-----+Prototype: Object                            |
|        +---------------------------------------------+
|        |Description: Something to take you far away  |
|        +---------------------------------------------+
|                                                       
|  +----------------+                                   
|  |                |                                   
+->|      Car       |                                   
|  |     +----------+----------------------------------+
|  +-----+Prototype: Vehicle                           |
|        +---------------------------------------------+
|                                                       
|  +----------------+                                   
|  |                |                                   
+--|    Ferrari     |                                   
   |     +----------+----------------------------------+
   +-----+Prototype: Car                               |
         +---------------------------------------------+


// 创建一个基础原型对象 Object
Object := Object clone

// 创建 Vehicle 原型，继承自 Object
Vehicle := Object clone

// 给 Vehicle 添加一个描述属性
Vehicle description := "Something to take you far away"

// 创建 Car 原型，继承自 Vehicle
Car := Vehicle clone

// 给 Car 添加属性
Car description := "A fast car"

// 创建 Ferrari 原型，继承自 Car
Ferrari := Car clone

// 给 Ferrari 添加新的属性
Ferrari description := "A Ferrari, a dream car"

// 测试创建的对象

// 访问 Ferrari 的描述属性，应该返回 Ferrari 的描述
Ferrari description print  // 输出: A Ferrari, a dream car

// 访问 Car 的描述属性，应该返回 Car 的描述
Car description print      // 输出: A fast car

// 访问 Vehicle 的描述属性，应该返回 Vehicle 的描述
Vehicle description print  // 输出: Something to take you far away
```

这张图表示了对象的构成，描述一个对象，也就是面向对象（当然我是从书上偷的，因为我觉得这张图确实很简洁明了。）说实话我并不是很喜欢这个写法，太多继承了。

如果是原型继承（Prototype Inheritance）的语言，他们的特性之一就是 **动态修改**:

```
io lang
---
duck := Object clone
duck name := "Duck"
duck speak := method("quack" println)

# 动态修改 slot
duck walk := method("waddle" println)
duck speak  # 输出：quack
duck walk   # 输出：waddle

javascript
---

// 创建一个对象
const duck = {
  name: "Duck",
  speak: function () {
    console.log("quack");
  }
};

// 动态添加或修改方法
duck.walk = function () {
  console.log("waddle");
};

// 调用方法
duck.speak(); // 输出：quack
duck.walk();  // 输出：waddle
```

---

## 方法 1
:text-title{:t="方法和块"}

在 Io lang 中，方法也是对象，不过给出了更符合的类型，即 Block：

```
method() type print
==> Block
```

### 函数 1

 | 编程语言    | 方法是否为对象         | 说明                                                       |
|-------------|------------------------|------------------------------------------------------------|
| **Io**      | 是                     | 在 Io 中，方法是对象，可以像其他对象一样操作、赋值、传递。 |
| **JavaScript** | 是                     | JavaScript 中的函数本质上是对象，可以作为参数传递、存储。 |
| **Python**  | 是                     | Python 中的函数是对象，可以像其他对象一样操作、传递。    |
| **Ruby**    | 否（但支持块作为对象）  | Ruby 中方法本身不是对象，但可以使用块（block）传递和调用。 |
| **Java**    | 否                     | Java 中方法不是对象，方法是属于类的。可以使用 Lambda 表达式作为方法的引用，但这些并非对象。 |
| **C#**      | 否（但支持委托作为对象）| C# 中方法不是对象，但可以使用委托（Delegate）作为方法引用传递和存储。 |

我相信看到这肯定会有疑问，函数和数学中的函数有那些共同的作用？比如数学中的函数 $$ f(x) = x^2 $$ 这个函数我们可以通过 javascript 中的 `function` 即函数理解：

```
function add(x, y) {
    return x + y;
}

let result = add(2, 3);  // result = 5
```

函数是一个特别重要的概念，特别是在数学领域。在普林斯顿微积分读本中，说明了函数在微积分的重要性：

::text-tip{type="big"}
不借助函数却想去做微积分，这无疑会是你所能做的最无意义的事。<br>
如果说微积分也有营养成分表，那么函数肯定会排在最前面。
::

有一说一我始终没有接触到应用到微积分的层次，但我会慢慢往这方面发展。


---

## 打破规则 2
:text-title{:t="打破规则"}

在本章节，作者提到了一部电影 [《春天不是读书天》（Ferris Bueller's Day Off)](https://zh.wikipedia.org/zh-cn/%E5%92%AA%E8%B5%B0%E5%A0%82) : 电影中，中产阶级的高中生费里斯·布勒（Ferris Bueller）假扮成芝加哥的“香肠之王”，用这一经典伪装成功进入了一家高档餐厅。他敢于打破规则，最终得到了一个绝佳的座位。


这部电影的导演和编剧是 [John Hughes](https://en.wikipedia.org/wiki/John_Hughes_(filmmaker)) 可能有些陌生。但他其实是 [小鬼当家](https://en.wikipedia.org/wiki/Home_Alone) 的编剧。他作为《春天不是读书天》的编剧。表示这部电影是写给芝加哥的情书：“我真的想尽可能多地捕捉芝加哥。不仅仅是建筑和景观，而是精神。”

::text-tip
有一说一芝加哥、洛杉矶这些好像是非常自由的，经常有美剧在这里取景拍摄，例如芝加哥警署、无耻之徒。芝加哥的犯罪率是 66.11, 洛杉矶的是 53.77;

犯罪率查询: [numbeo](https://www.numbeo.com/crime/compare_cities.jsp?country1=United+States&city1=Chicago%2C+IL&country2=United+States&city2=Los+Angeles%2C+CA)
::

同时，作者根据这部电影主角的行为，来延伸给语言定义了性格：

| **背景**  | **习惯的编码风格** | **对 Bueller 伪装的看法** | **在 Io 中的建议** |
|-----------|----------------|----------------|----------------|
| **Java**  | 严格规则，结构化 | 可能认为自由过度，不合适，Bueller 应该被赶出去 | 放松一点，利用 Io 的强大灵活性 |
| **Perl**  | 随意风格，注重结果 | 可能喜欢 Bueller 的伪装，因为它成功了 | 需要收敛一些，引入更多的纪律性 |
| **Io**    | 采用 slot 和 message 机制 | 更加自由，灵活性极高 | 需要探索 slot（槽）和 message（消息），学习如何塑造核心行为 |

看完这一段后我花了两个小时看了这部电影，讲述的是男主即将高中毕业升入大学。父母给男主买了个电脑，给妹妹买了个汽车。男主利用自己学到的计算机知识逃课了很多次还没有给发现。逃课的手法大多是社会工程学，例如变声、伪装、欺骗、通过弱点攻击系统篡改信息等。


### 消息 1

:text-title{:t="一切都是消息" type="2"}

几乎一切都是消息，意味着在 Io lang 中可以拦截、修改甚至是重写，因为一切都是消息。这让我联想到了几乎一切都是函数的 javascript。

| 概念                  | 代表语言         | 特点 |
|----------------------|--------------|--------------------------------|
| **几乎一切都是消息** | Io           | 代码执行依赖对象之间的消息传递，方法调用、控制语句等都是发送消息 |
| **几乎一切都是函数** | Haskell、JavaScript | 代码执行依赖函数，控制语句、计算等都是函数操作 |


---

### 反射机制 2
:text-title{:t="反射机制"}

我一开始看到 `slot` 还以为是 vue 中的 `<slot>` 但他们其实是两个概念。但都有一个共同的特点即 **灵活性、动态性、扩展性**,它们都体现了“灵活性”和“动态化设计”的编程哲学：

1. Io 中的 Slot 更适合描述为一个“动态对象的核心特性”，与属性、方法、反射、元编程相关。
2. Vue 中的 Slot 则是一个“组件内容占位机制”，专注于解决组件复用和模板动态化的问题。


```
duck := Object clone
duck name := "Duck"
duck speak := method("quack" println)

# 动态修改 slot
duck walk := method("waddle" println)
duck speak  # 输出：quack
duck walk   # 输出：waddle
```

---

## 领域特定语言 (DSL) 2
:text-title{:t="时代的尘土"}

我相信 IO Lang 在当时这些特性一定会受到很多人的喜爱（抛出那个作者和朋友之间的故事不谈）。但可惜是的 Io lang 目前貌似并不是特别的活跃，社区、生态都很小众。支持 IO Lang 特性的语言有很多，他们可能实现起来稍微或者说略微复杂，但他们的生态和社区可以弥补这一点。举个例子：

如果你在面试的时候，说你熟练使用 Io lang，你的面试官可能并不知道 Io lang。<br>
人家可能只知道 Java、PHP、C++、Python……这些主流的语言。

目前。以我的知识储备来理解 DSL，更多的是处理特定格式的数据。以及多语言之间的配合，为某一个特定领域量身定制的语言，它的语法和功能紧密围绕该领域的需求。

```
iolang
---

# 创建一个新的对象 Builder，继承自 Object
Builder := Object clone

# 为 Builder 添加一个 `forward` 方法，用于捕获未定义的消息
Builder forward := method(
  # 打印开始标签，比如 `<ul>` 或 `<li>`，基于收到的消息名称
  writeln("<", call message name, ">")

  # 遍历消息的所有参数
  call message arguments foreach(
    arg,  # 当前遍历到的参数
    # 对参数进行处理，将它解析为内容
    content := self doMessage(arg);

    # 如果参数类型是字符串（Sequence），直接打印内容
    if(content type == "Sequence", writeln(content))
  )

  # 打印结束标签，比如 `</ul>` 或 `</li>`
  writeln("</", call message name, ">")
)

# 使用 Builder 创建一个 HTML 结构
Builder ul(  # `<ul>` 标签
  li("Io"),           # `<li>Io</li>`
  li("Lua"),          # `<li>Lua</li>`
  li("JavaScript")    # `<li>JavaScript</li>`
)

python
---

class Builder:
    # 动态捕获未定义的方法
    def __getattr__(self, tag):
        def handler(*args):
            # 开始标签
            html = [f"<{tag}>"]
            
            # 遍历方法的参数
            for arg in args:
                if isinstance(arg, str):
                    html.append(arg)  # 如果是字符串，直接添加内容
                elif callable(arg):
                    html.append(arg())  # 如果是嵌套标签，递归调用
            
            # 结束标签
            html.append(f"</{tag}>")
            return "".join(html)  # 返回完整 HTML
        return handler


# 创建 Builder 实例
builder = Builder()

# 使用 DSL 构建 HTML
html = builder.ul(
    builder.li("Io"),
    builder.li("Lua"),
    builder.li("JavaScript")
)

# 打印生成的 HTML
print(html)
```

---

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

例如 Scala 是 OOP × FP 混合的编程范式，所以有面向对象和函数式范式的应用:

```
case class 咖啡机(品牌: String) {
  // OOP
  def 制作咖啡(类型: String): String = 
    // FP
    val 配方 = 类型 match {
      case "拿铁" => (咖啡量: Int) => s"${咖啡量}ml咖啡+200ml奶"
      case _ => (咖啡量: Int) => s"${咖啡量}ml纯咖啡"
    }
    配方(30)
}

val 我的机器 = 咖啡机("Nespresso")
println(我的机器.制作咖啡("拿铁")) // 30ml咖啡+200ml奶
```

::text-tip
没想到用中文定义的对象和函数竟然可以输出
::

你可以理解为面向对象是将一个东西描述成对象，然后函数是具体的行为，例如：

| OOP | FP |
| --- | --- |
| 杯子(300, "玻璃")	 | 水量 => 水量 * 2 |


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

这个流程其实非常简单，主打一个 `Future / Promise`, 他的流程是这样的：

```
[主线程]
  │
  ├─ 创建Future → 后台线程执行计算 → 完成后触发回调
  │
  └─ 创建Promise → 获取关联Future → 设置回调
        │
        └─ 另一个线程完成Promise → 触发关联Future的回调
```

所以这个模型的核心思想是 **将结果的产生和消费解耦，让主线程不被阻塞。** 通过回调处理异步结果。想象一下这样的场景：

```
Future 就像你的外卖订单：
你下单后(Future { ... })继续做自己的事
设置回调(foreach)相当于告诉外卖员："送到后打电话给我"

---

Promise 就像餐厅的接单系统：
餐厅收到订单创建了一个承诺(Promise)
厨房工作完成后调用promise.success(餐品)
与你关联的外卖订单(futureFromPromise)会自动更新状态

---

Delay 就是明确告诉你预计 30 分钟后取餐
(Thread.sleep)

---

Deferred 就是给你个订单号，告诉你商家正在准备中…… 弄好了再告诉你

import scala.concurrent.{Future, Promise}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Success, Failure}

class Deferred[T] {
  private val promise = Promise[T]()
  val future: Future[T] = promise.future
  
  def complete(value: T): Unit = promise.success(value)
  def fail(ex: Throwable): Unit = promise.failure(ex)
}

object DeferredDemo extends App {
  // Deferred
  val deferredResult = new Deferred[String]()
  
  println("哈哈外卖提醒您！商家正在备货中~")
  
  // 2. 回调
  deferredResult.future.onComplete {
    case Success(value) => println(s"收到结果: $value")
    case Failure(ex)    => println(s"操作失败: ${ex.getMessage}")
  }
  
  // 模拟异步操作完成后完成Deferred
  Future {
    Thread.sleep(2000) 
    deferredResult.complete("完成啦！!")
  }
  
  Thread.sleep(3000)
  println("演示结束")
}
```


---

### Akka Actor 1
:text-title{t="Akka Actor" type="2"}

要理解 Akka Actor，首先要理解 [Actor Model](https://en.wikipedia.org/wiki/Actor_model)。在维基百科中，描述了 Actor 的一个理解：

::text-space
---
type: tip
---
万物皆可 Actor<br>
everything is an actor
::

类似于面向对象中的 “万物皆可对象”，Actor 应该是：“角色扮演”，例如你有一家快递公司：

```
[快递公司运作流程]
  顾客 → 快递员 → 分拣中心 → 配送站 → 收件人
```

那么上面的流程中，每个角色都是一个 Actor，所以可以划分为：

| 角色 | Actor | 特点 |
| --- | --- | --- |
| 快递员	 | 单个 Actor	 | 只负责自己片区，不知道其他快递员在干嘛 |
| 快递包裹	 | 消息（Message）	 | 只有包裹里的信息（不能直接打电话问快递员"你在哪"） |
| 快递柜	 | 邮箱（Mailbox）	 | 快递员只有送到柜子里的包裹才会处理 |
| 片区经理	 | 父级 Supervisor	 | 快递员生病了（崩溃）由经理决定是否换人 |
| 公司总部	 | Actor System	 | 整个快递网络的基础框架 |

如果你要映射到 Code， 可以这么想，假设现在有100个包裹要配送：

| 方式 | 传统多线程做法 | Actor mode | VS |
| --- | --- | --- | --- | 
| 资源分配 | 创建100个快递员（线程）	 | 固定10个快递员轮流处理	 | 线程太多会崩溃 |
| 沟通方式 | 快递员互相打电话问路（共享内存）	 | 只通过包裹上的地址（消息传递）	 | 避免"堵车死锁" |
| 错误处理	 | 一个快递员车祸导致整个系统瘫痪 | 该快递员路线由经理重新分配（监督策略）	 | 局部故障不影响整体 |
| 状态管理	 | 所有快递员共享实时地图	 | 每个快递员有自己的笔记本记录	 | 避免地图被同时修改出错 |

所以 Actor 有点像是反应式的设计思路，例如其核心就是：

1. 绝不共享：就像快递员不会共用同一辆货车（每个Actor有自己的状态）
2. 只认包裹：就像快递员只按包裹信息送货（只通过消息通信）
3. 各司其职：就像快递员不会突然去帮客服接电话（单一职责）


#### Akka Actor 2
:text-title{t="Akka Actor" type="2"}

了解完了 Actor mode ，可以了解 [akka](https://en.wikipedia.org/wiki/Akka_(toolkit))，akka 是一个公司，也是一个包。最早实现于 2006 年，感觉这种并发一般会和分布式、微服务之类的架构建立联系，所以详情可以去看 [akka docs](https://doc.akka.io/libraries/akka-core/current/typed/actors.html) 写的还是很全的。在 Scala 中可以  `import akka.actor` 来使用 Akka actor

```
import akka.actor.typed.{ActorRef, ActorSystem, Behavior}
import akka.actor.typed.scaladsl.Behaviors

object Main {
  // 消息协议
  final case class Greet(whom: String, replyTo: ActorRef[Greeted])
  final case class Greeted(whom: String, from: ActorRef[Greet])

  // HelloWorld Actor
  def helloWorld(): Behavior[Greet] = Behaviors.receive { (context, message) =>
    println(s"Hello ${message.whom}!")
    message.replyTo ! Greeted(message.whom, context.self)
    Behaviors.same
  }

  // main Actor
  def mainBehavior(): Behavior[Greeted] = Behaviors.setup { context =>
    // create HelloWorld Actor
    val greeter = context.spawn(helloWorld(), "helloWorld")
    
    // send
    greeter ! Greet("Akka", context.self)

    Behaviors.receiveMessage { message =>
      println(s"${message.from.path.name} 已问候 ${message.whom}")
      Behaviors.stopped
    }
  }

  def main(args: Array[String]): Unit = {
    // create Actor system
    val system = ActorSystem(mainBehavior(), "DemoSystem")
    
    Thread.sleep(1000)
    system.terminate()
  }
}
```

---

### ZIO 2
:text-title{t="ZIO" typo="2"}

ZIO 是一个 **类型安全、可组合异步和并发编程** 的一个框架，其和新的是 ZIO 数据类型。分为了 R、E、A 三种，分别代表：

| Type | Info | 
| --- |--- |
| R | 环境类型参数，表示需要的上下文值。|
| E | 错误类型参数，表示可能出现的错误类型。 |
| A | 成功值类型参数，表示成功结果的类型。 |

当然还有很多类型别名啊，可以根据 [zio docs](https://zio.dev/overview/summary) 来进行学习，例如 `UIO[A]`、`URIO[R, A]` 什么的。也就是说啊：

::text-space
---
type: tip
---
它需要一个环境类型参数 R，并产生一个失败的类型 E 或一个成功值的类型 A。<br>
<b>这就很哲学，例如你做一个产品[R]，可能会赚到 money[A]，也可能没有赚到 money[E]</b>

你还可以把一些类型别名带进去，例如 `IO[E, A]` 那就是 “这个项目可能因为 `E` 没有赚到 money，或者因为 `A` 而赚到 money”
::

ZIO 这个框架的核心还是很方便代入的，例如 `ZIO[R, E, A]`:

| Type | Vs | Tech |
| --- | --- | --- |
| R | 你创业需要的初始资源（办公场地[R=Office]、启动资金[R=Capital]）	 | 执行所需的环境依赖（数据库连接、配置等） |
| E | 可能遭遇的失败类型（资金断裂[E=Bankrupt]、政策风险[E=Regulation]）	 | 可能发生的错误类型（IOException、TimeoutException等） |
| A | 最终获得的成功成果（上市[A=IPO]、盈利[A=Profit]）	 | 计算成功返回的结果（用户数据、交易ID等） |


大致看了下文档，可惜在 scastie 上跑有些问题，自己又不想弄本地的 ZIO 环境，所以还是算了。以后用到的时候在仔细体验，但这个框架理解起来还是蛮简单的。

---

### 模式匹配 2
:text-title{t="模式匹配" type="2"}

[模式匹配(Pattern matching)](https://en.wikipedia.org/wiki/Pattern_matching)是函数式、并发的核心之一。有点像是 ADT，但又不是，毕竟 ADT 是类型的一种，不过有类型模式匹配。可能跟模式匹配比较像的就是 if/else(不完全是)，可以讲 if/else 和模式匹配比做成：

IF/ELSE: 逐个拆箱检查内容物
- *"如果是盒子A，打开看是不是红色物品；如果是盒子B，摇晃听声音..."*

模式匹配: 用智能扫描仪直接识别包装特征
- *"匹配‘红色立方体盒子’ → 送往区域X；匹配‘圆柱体包裹’ → 送往区域Y"*

<br>

```
object PatternMatchingDemo extends App {
  // 基础值
  def explainNumber(num: Int): String = num match {
    case 0 => "零"
    case 1 => "壹"
    case _ => "其他数字"  // default
  }
  println(explainNumber(1))  // 壹

  // 结构匹配 
  val nums = List(1, 2, 3)
  nums match {
    case head :: tail => println(s"头部: $head, 尾部: $tail")  // 头部: 1, 尾部: List(2, 3)
    case Nil => println("空列表")
  }

  // 类型匹配
  val any: Any = "hello"
  any match {
    case s: String => println(s"字符串长度: ${s.length}")  // 字符串长度: 5
    case i: Int    => println(s"数字: $i")
  }
}
```

(感觉没 py 的那种写法简洁，不过 scala 对比 java 感觉 lang style 也挺不错的)

---

# Erlang 1
:text-title{t="Erlang"}

Erlang 我比较有印象，因为我了解过 [Elixir](https://en.wikipedia.org/wiki/Elixir_(programming_language)) 它是构建在 Erlang 之上的(我觉得 Elixir 的 Logo 比 Erlang 的好看) 不过这两个的特性都在于并发和分布式，所以我会了解和分布式相关的，看看和前面的 Scala 的并发有什么区别，是不是和 Scala 的静态类型和动态类型一样复杂。

Erlang 是一个函数式、并发的语言，他的运行时就是为了**分布式、容错、高可用不间断、实时计算、热插拔**而设计的。因为为了这些而设计，所以 Erlang 具有不可变类型。

---

## 模块 1
:text-title{t="模块"}

由于我只是学习目的，所以我尝试在线的环境来学习 Erlang。体验了一翻 [Replit](https://replit.com/) 感觉还是很不错的。如果要在 Erlang 中输出 Hello,world，那么需要使用 [io:format](https://www.erlang.org/doc/system/seq_prog#writing-output-to-a-terminal)(有一说一官方文档写的还是很不错的，很方便学习和理解):

```

--- filename: main.ert
-module(main).
-export([start/0]).

start() ->
    io:format("Hello,world").
```

在 Erlang 中，文件相当于一个模块，也就是你看到的 `-module(main)` 之后需要导出 `-export([start/0, add/1])` 这里的 `0` 表示需要导出的是 0 个参数，如果需要导出，就是这样：

```
-module(main).
-export([start/0, add/1]).
start() ->
  io:format("Hello,world").

add(X) ->
  2 * X.
```

如果是 ES6 或者 Python，那就是这样的：

```
--- ES6
export function hello() { ... }
export default function () { ... }

// CommonJS
module.exports = {
  hello,
  add
}

--- Python 3
# Declare some variables
app = 10
ball = True
cat = 'kitten'
dog = 100.0

# Define variables to be imported
# when module is imported
__all__ = ['app', 'ball']
```

如果要运行我们刚才写的 `add` 函数，可以通过进入 Erlang 的 REPL 执行：

```
> c(main).
{ok,main}
> main:add(10).
20
```

如果要退出只需要输入 `halt().`，其中，输入的 `c` 表示编译，也就是 [BEAM,Bogdan's Erlang Abstract Machine](https://en.wikipedia.org/wiki/BEAM_(Erlang_virtual_machine))，这是 Erlang 的虚拟机，跟 Java 的 JVM 差不多，都是有虚拟机运行的。

## 数据类型 2
:text-title{t="数据类型" type="2"}

| 类型       | 独特性说明                                                                 | 其他语言近似替代                     | 典型应用场景                     |
|-----------------------|--------------------------------------------------------------------------|--------------------------------------|----------------------------------|
| **Atom**              | 全局唯一不可变常量，小写开头，直接用于模式匹配                               | Ruby `Symbol`, Python `Enum`         | 状态标签、消息类型标识            |
| **Pid**              | 轻量级进程的唯一标识符，支持跨节点通信 (`!` 操作符)                          | Akka `ActorRef` (库实现)             | 分布式进程寻址                   |
| **Reference**        | 运行时生成的全局唯一引用 (`make_ref()`)                                      | Java `UUID` (需库)                   | 异步消息去重、RPC 回调标识        |
| **Port Identifier**  | 与外部进程通信的句柄，内置跨语言支持                                        | Python `subprocess.Popen` (OS 依赖)  | 调用 C/Python 等外部程序          |
| **Bit Strings**      | 原生位操作语法 (`<<1:3, 2:5>>`)，无需手动位移                               | C++ `std::bitset` (需手动处理)       | 协议解析、二进制数据压缩           |
| **Sigil**           | 语法糖简化字符串/正则处理 (如 `~s(RAW)`)                                    | 无直接等价，需函数调用               | 模板生成、正则表达式构建           |
| **Fun**             | 可序列化的不可变函数对象 (`fun(X) -> X*2 end`)                              | JavaScript 闭包 (但携带可变状态)      | 分布式传递计算逻辑                |
| **Tuple**           | 定长异构集合，匹配时需完全一致 (`{ok, Value}` vs `{error, Reason}`)          | Python 元组 (但无模式匹配语义)        | 多返回值、结构化消息              |
| **List**            | 链表结构，`[Head/Tail]` 解构，字符串即整数列表 (`[72,101]` → `"He"`)         | 大多数语言的链表 (但无自动字符转换)    | 递归处理、文本解析                |
| **Map**             | 动态 K-V 存储 (类似字典)，但匹配时需完全匹配键                               | Java `HashMap`, Python `dict`        | 动态配置、JSON 交互               |

### pid 2
:text-title{t="PID" type='2'}

这里面有很多有趣的，例如 `Pid`。你可能会有一个疑问，为什么 PID 是一个单独的数据类型，而不是某个库提供的方法？感觉其他的 Lang 的数据类型都很常见，什么 Tuple、String、Int、List 之类的，但 PID 可能作为一个数据类型单独拿出来。

显然 PID 是一个专门为多线程操作设计的一个类型，其主要方便的一点是保证 **原子化**, 简单的来说就是给每个节点分配一个唯一的 ID（有点像是在学 spring cloud 的内容）总结来说 PID 类型在于：

1. 原子性（atomicity）：每个 Pid 是唯一且不可变的，保证了进程间通信时不会混淆目标。
2. 分布式唯一性：即便是在多节点（Node）之间通信，每个进程仍能通过 Pid 被唯一标识。
3. 安全发送：Pid ! Message 是 Erlang 的基础通信语法，而你无法伪造一个 Pid 给系统发送消息。

例如在创建新的进程或者两者之间需要收发消息的时候就需要用到 PID，可以参考 [Process Creation](https://www.erlang.org/doc/system/ref_man_processes#process-creation)

```
-module(main).

-export([start/0, ping/2, pong/0]).

ping(0, Pong_PID) ->
    Pong_PID ! finished,
    io:format("ping finished~n", []);
ping(N, Pong_PID) ->
    Pong_PID ! {ping, self()},
    receive
        pong ->
            io:format("Ping received pong~n", [])
    end,
    ping(N - 1, Pong_PID).

pong() ->
    receive
        finished ->
            io:format("Pong finished~n", []);
        {ping, Ping_PID} ->
            io:format("Pong received ping~n", []),
            Ping_PID ! pong,
            pong()
    end.

start() ->
    Pong_PID = spawn(main, pong, []),
    spawn(main, ping, [3, Pong_PID]).

---
Pong received ping
Ping received pong
Pong received ping
Ping received pong
Pong received ping
Ping received pong
ping finished
Pong finished
```

---

## 并发与设计哲学 2
:text-title{t="Erlang 核心操作与设计哲学"}

::wise-info
---
topic: Concurrent Programming 
by: Getting Started with Erlang
---
使用 Erlang 而不是其他函数式语言的主要原因之一是 Erlang 处理并发和分布式编程的能力
::

这句话很有底气。在 Erlang 中，有一个并发的三要素，也就是：

1. `spawn`: 用于创建新进程;
2. `!`: 消息传递；
3. `receive`: 模式匹配处理消息:<br> 队列中的第一条消息将与 中的  `receive` 第一个模式进行匹配。如果匹配，则从队列中删除消息并执行与模式对应的作。

::wise-info
---
topic: Programming Erlang
by: Joe Armstrong
---

let it crash
::

毫无疑问的是，这一句话广为流传。有点像火箭中的 "Blow it up"。当然这不是我说的，对于这个设计哲学的讨论实在是太多了。我更倾向于 [The Zen of Erlang](https://ferd.ca/the-zen-of-erlang.html) 这一篇演讲。举了很多例子，比如：

| Erlang | E.g |  | 
| --- | --- | --- |
| Let it Crash | 火箭科学（Blow it Up）​ | 火箭推进本质是控制爆炸（燃烧燃料），而非避免爆炸。|
| | 森林防火 | 通过“受控燃烧”清除易燃物，防止更大火灾。 |
| Processes | 蜜蜂群 | 蜂群中每只蜜蜂独立工作，死亡不影响整体。 |
| | 登山队 | 登山者用绳索相连，但一人坠落可能拖累全队。 |
| Message Passing | 邮递、旗语|  旗语、邮差送信是异步的，发信后无需等待回复。 |

---

## Bohrbug and Heisenbug 2
:text-title{t="Bohrbug and Heisenbug"}


::text-space
---
type: tip
---
'Bohrbug' 和 'Heisenbug' 由 Jim Gray 于 1985 年创造（我建议您尽可能多地阅读 Jim Gray 的论文，它们几乎都很棒！）
::

虽然我没有兴趣看论文，但我在看 wikipedia 的时候找到了 Bohrbug 的参考文献即 ["catb.org"(
Eric S. Raymond's Home Page)](http://catb.org/jargon/html/B/Bohr-bug.html) 很有趣。看了他的个人介绍发现也是一位很有故事的人：


::wise-info
---
topic: Views on open source
by: Eric S. Raymond
---

Given enough eyeballs, all bugs are shallow.<br>
只要有足够多的眼睛，所有Bug都是浅显的
::


(好像很契合这一部分的章节) 突然对这本书很有兴趣，毕竟是 [《Jargon File》行话文件](https://en.wikipedia.org/wiki/Jargon_File) 以后和群u萌水群的时候也可以拽几句俚语和上古行话了（后仰。让我意外的是 [Bohrbug](http://catb.org/jargon/html/B/Bohr-bug.html) 竟然来自量子物理学，

| Type | Desc | Jargon_File |
| --- | --- | --- |
| Bohrbug | 稳定可复现​​：在相同条件下必然复现 | 一种可重复出现的错误；在一组可能未知但定义明确的条件下可靠地出现 |
| | 易于调试​​：可通过日志、断点或单元测试定位。 | |
| Heisenbug | 难以复现​​：仅在特定条件下偶然出现（如高并发、特定硬件状态）。 | |
| | 牵一发而动全身：尝试修复它们常导致更多意外行为 |  |
| Mandelbug | 问题根源深藏于系统复杂交互中 | 一种底层原因极其复杂且晦涩的bug，其行为看似混沌甚至非确定性。该术语暗示说话者认为它是一个 ​​Bohr bug​​（稳定可复现的bug），而非 ​​Heisenbug​​ |
| | 行为难以预测，但一旦复现则稳定存在 | |
| Schroedinbug | 类比量子物理中的“薛定谔的猫”思想实验 | 程序中的设计或实现bug，平时潜伏不发作，直到有人阅读源代码或以非常规方式使用程序时，突然发现“这代码根本不该工作！”——随后程序立即对所有人失效，直到修复。|

---

# Clojure 1
:text-title{t="Clojure"}

我对 Clojure 的印象就是 lisp(LISt Processing) 的 logo 很像 ☯  (阴阳) 除此之外没了。在本书中，作者强调了 Clojure 像是《星球大战》中的​​尤达大师​​——看似古怪（语法反直觉），实则蕴含深厚智慧（并发模型、JVM生态）。而 Lisp 的双重性比如 195 8年诞生，是第二古老的高级语言。同时又兼顾了 宏（macro）和代码即数据（homoiconicity）等特性,又现代了那么一点点。 


要理解 Clojure 还需要先了解 LISt Processing 、Code as Data 这些 lisp 的核心特性。从输出 Hello,world 的方式来看，两者都是差不多的：

```
Common Lisp:
(format t "Hello, World!")
---

Clojure
(println "Hello, World!")
```



```
--- Clojure

;;    name   params         body
;;    -----  ------  -------------------
(defn greet [name]   (println (str "Hello, " name "!")))

(greet "John")
(greet "Alla")

--- Common Lisp
(defun fib (n)
  "Return the nth Fibonacci number."
  (if (< n 2)
      n
      (+ (fib (- n 1))
         (fib (- n 2)))))

(format t "Fibonacci of 30: ~D" (fib 30))
```


你别说你还真别说，Clojure 这个文档写的还是很通俗易懂的，很简洁，[Common Lisp](https://lisp-lang.org/) 的文档也很简洁，不过 Common Lisp 是上古时期 Lisp 的改良版，因此要体验原汁原味的历史厚重感，要通过 [The Medley Interlisp Project](https://interlisp.org/) 这个伟大的项目。

虽然不是最原始的 lisp，是 [Interlisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) 但这也在 lisp 历史时间线中靠前的，并发挥了重要的作用。有兴趣的话可以阅读下 [Interlisp Timeline](https://interlisp.org/history/timeline/) 记录了 1960 至今的时间线。

## Clojure Hosted 2
:text-title{t="Clojure JVM"}
这一章算是让我意外的，我看到了作者在 Scala 篇章中没有写的内容，比如 Scala 和 Clojure 都是 JVM 生态。他们都可以使用 Java 的生态构建项目(有一说一我还是挺喜欢 scala 的，Code 看起来确实比 `(` 好看多了)：

```
--- Scala

import java.time.LocalDate

def addWeek(date: LocalDate): LocalDate =
  date.plusDays(7)

def dayToStr(date: LocalDate): String =
  s"${date.getMonth} ${date.getDayOfMonth}, ${date.getYear}"

// Infinite lazy list of weekly dates from today
val futureWeeks: LazyList[LocalDate] =
  LazyList.iterate(LocalDate.now())(addWeek)

// Take first 4 and print
futureWeeks
  .take(4)
  .map(dayToStr)
  .foreach(println)

--- Clojure
(import '[java.time LocalDate])

(defn add-week ^LocalDate [^LocalDate date]
  (.plusDays date 7))

(defn day->str [^LocalDate date]
  (format "%s %s, %s" (.getMonth date) (.getDayOfMonth date) (.getYear date)))

;; infinite sequence of weekly dates, starting from today
(def future-weeks (iterate add-week (LocalDate/now)))

(doseq [s (map day->str (take 4 future-weeks))]
  (println s))


Output:
JULY 21, 2025
JULY 28, 2025
AUGUST 4, 2025
AUGUST 11, 2025
```


::text-space
---
type: tip
---
clojure-CLR（Common Language Runtime） 是 .NET 平台的核心运行时环境。不过我还没写过 .NET。给我的映像就是以前装什么软件会提示缺少 .NET Framework 3.x\4.x 环境什么的，一度认为是 .NET 域名有深厚联系。
::

不过作者成书的时候比较早，Clojure 目前将这个特性称之为 [Hosted](https://clojure.org/about/jvm_hosted) 除了 JVM 还有 [ClojureScript](https://clojurescript.org/)、[ClojureCLR](https://github.com/clojure/clojure-clr)

## Homoiconicity 2
:text-title{t="Homoiconicity"}

Homoiconicity（同像性）同常被视作为 "代码视为数据" 但貌似并没有达成共识。因此我更倾向于在大多数语言中（比如 Python、Java、C），你写的代码和数据结构是两回事，代码是“语言语法”，而数据是运行时的值。


::text-space
---
type: tip
---
这里的 “代码即数据” 并不严谨，更多的是方便理解，其真正的核心是 **同像性（homoiconicity来自希腊语单词，homo-意为相同，icon含义表像）** 这个单词组合：

Homoiconicity 是代码和数据的表示形式高度统一，语言的基本数据结构也是代码的语法结构，而不仅仅是代码“可以”被当数据处理。
::

但在 Clojure（或 Lisp） 中，代码的结构本身 就是数据结构（一般是列表 list）。所以你可以像操作数据一样，读取、修改、构造、执行代码。



### Macros 2
:text-title{t="Macros"}

在此之前，作者阐述了语言的五个核心，其中在 “语言有哪些独特的核心特性” 里，并发支持、宏系统、虚拟机等成为主要的衡量因素。而上述的 Homoiconicity 体现之一，就是宏 (Macros) 宏实现了 Homoiconicity 中的 **代码即数据**。

可以通过 `macroexpand` 函数来展开宏，例如 Clojure Docs 在 Macros 这一章给出的例子（可以丢进 [Try Clojure
](https://www.tryclojure.com/) 这个在线的 REPL 上看看，不过最近一次更新已经是 10 years ago 了 ：

```
user=> (-> {} (assoc :a 1) (assoc :b 2))
{:b 2, :a 1}

user=> (macroexpand '(-> {} (assoc :a 1) (assoc :b 2)))
(assoc (assoc {} :a 1) :b 2)

---
(list 'assoc
      (list 'assoc {} :a 1)
      :b 2)
```

这就是代码和数据的统一性（同源性），既是 代码，也是一个 列表数据结构。（可以像操作普通数据一样，操作这段代码），因此宏可以用代码来生成代码。

## Destructuring 1
:text-title{t="Destructuring"}

解构（Destructuring），我的理解就是匹配，严谨来说就是 **一种将名称简洁地绑定到数据结构内的值的方法**。例如 MDN 的 [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) 例子非常的简洁明了，而 Clojure 给出的例子就很直观：

```
(def my-line [[5 10] [10 20]])

(let [p1 (first my-line)
      p2 (second my-line)
      x1 (first p1)
      y1 (second p1)
      x2 (first p2)
      y2 (second p2)]
  (println "Line from (" x1 "," y1 ") to (" x2 ", " y2 ")"))
;= "Line from ( 5 , 10 ) to ( 10 , 20 )"
```

Clojure 用的是显式(explicit)。同样是函数式的 py 则是 隐式(implicit)，就显得很简洁：

```
head, *middle, tail = [1, 2, 3, 4, 5]

print(head)    # 1
print(middle)  # [2, 3, 4]
print(tail)    # 5
```

如果要了解 [Explicit Pattern and Implicit Pattern] 两种设计哲学，还是非常复杂的，虽然很多 lang 的 docs 中都有这个名词。但真正能介绍的很少，但我觉得可以看看 [Explicit and implicit methods](https://en.wikipedia.org/wiki/Explicit_and_implicit_methods) 的介绍，总的来说就是字面理解：

- explicit：来自拉丁文 explicare，意为“展开、解释清楚”
- implicit：来自拉丁文 implicare，意为“卷入、含而不露”

不过在数学中，是反过来的，也就是正如下面两个式子一样。“显式”强调的是计算是“明确”的,而“隐式”是：你不知道下一步状态具体怎么求，需要解个方程。:

```math
explicit: {\displaystyle Y(t+\Delta t)=F(Y(t))\,}
```

```math
implicit: {\displaystyle G{\Big (}Y(t),Y(t+\Delta t){\Big )}=0}
```

而在 lang 中则是，**显式写出（显式） vs 编译器自动推导（隐式）**（突然理解了为什么 Haskell 会在 docs 上写推导了。

> Kind inference checks the validity of type expressions in a similar way that type inference checks the validity of value expressions. However, unlike types, kinds are entirely implicit and are not a visible part of the language. Kind inference is discussed in Section 4.6.

---

## 原力 2
:text-title{t="原力"}

作者很有意思，会在每个章节的开头用影视剧的剧情来描述本章节可能带来的一些内容，比如本章节就以星球大战中的剧情为例子体现出 在 Clojure 中，​​序列（Sequences）​​、​​惰性求值（Lazy Evaluation）​​和​​宏（Macros）是原力的体现

### Sequences 2
:text-title{t="Sequences"}

::text-space
---
type: tip
---
在数学中， 序列是允许重复且顺序很重要的对象的枚举集合。与集合一样，它包含成员 （也称为元素或术语 ）。元素的数量（可能是无限的）称为序列的长度 。与集合不同，相同的元素可以在序列中的不同位置多次出现，并且与集合不同，顺序确实很重要。

**有限和无限序列**

序列的长度定义为序列中的项数。限长度的序列是有限序列 。长度为 n 的有限序列也称为 n 元组 。有限序列包括没有元素的空序列 ，表示为 （ ）。

限序列是指在一个方向上是无限的，在另一个方向上是有限的序列;这样的序列有第一个元素，但没有最终元素，当需要消歧义时称为单无限序列或单侧无限序列 。

在两个方向上都是无限的序列——即既没有第一个元素也没有最后一个元素——称为双无限序列 、 双向无限序列或双无限序列 。
> 例如所有偶数整数的序列 （ ...， −4， −2， 0， 2， 4， 6， 8， ... ），是双无限的。（建议看维基百科的介绍)
::

[序列（Sequences）](https://en.wikipedia.org/wiki/Sequence) 我的理解就是操作数据结构的一种方式，在计算机科学中，有限序列通常称为字符串 、 单词或列表(而无限序列被称之为流)。这也就是为什么 Clojure 会在这一章接描述中写了一句 “seq 是一个逻辑列表” 的原因，而 ISeq 大概就是 Interface for Sequence 的缩写？


因此这就抛出了一个 Clojure 特性之一的 [“Lazy Evaluation” 即惰性求值](https://en.wikipedia.org/wiki/Lazy_evaluation)。是 [Programming language theory](https://en.wikipedia.org/wiki/Programming_language_theory) 讨论的范畴，而 **λ** 属于编程语言理论(PLT) 的非官方符号（怪不得 Haskell website 上能看到这个符号）值得注意的是这个符号还是 [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language)) 的 logo，他是 Lisp 系列编程语言的一种方言之一，诞生于 1970 年代。

**惰性求值的优点是能够创建可计算的无限列表**，怪不得很多 lang 都喜欢 [斐波那契数列](https://en.wikipedia.org/wiki/Fibonacci_sequence) 做特性展示。原来是 show lang 的序列特性哇:

```
(def fib-seq
  (->> [0 1]                      
       (iterate (fn [[a b]] [b (+ a b)])) 
       (map first)))       
       
(println (take 20 fib-seq))
;;  (0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181)
```


<br>


```math
\begin{align*}
F(0) &= 0 \\
F(1) &= 1 \\
F(n) &= F(n-1) + F(n-2) \quad \text{当 } n \geq 2
\end{align*}
```

比如这里我们就展示到了 Clojure 的惰性求值特性也就是 [iterate](https://clojure.github.io/clojure/clojure.core-api.html#clojure.core/iterate) 方法。Clojure 文档介绍的很详细：

```
iterate
function

Usage: (iterate f x)
Returns a lazy (infinite!) sequence of x, (f x), (f (f x)) etc.
f must be free of side-effects
```


### ISeq 1
:text-title{t="ISeq"}

ISeq(Interface for Sequence, Sequences)，在这一章节中，ISeq 和 Seq 的区别在于，所有 Interface 都必须满足两个条件，即​​不可变（Immutable）、持久化（Persistent） 。`for`、`while` 这些循环获取数据的，叫 **迭代器（Iterator）**

使用 ISeq 不仅原生支持 [lazy-seq](https://clojure.github.io/clojure/clojure.core-api.html#clojure.core/lazy-seq)，同时还用有不可变不可变性（Immutability）增加了线程安全性, BTW 有一说一，Clojure docs 还挺全的。比如上面我们演示 斐波那契数列所使用的 [iterate](https://github.com/clojure/clojure/blob/clojure-1.11.1/src/clj/clojure/core.clj#L3030) 函数算是隐式依赖 ISeq 接口：

```
Give me some Clojure:
> (instance? clojure.lang.ISeq s)
true
```

::text-space
---
type: tip
---
不可变性看似线程安全很小众，实则避免了传统语言中 90% 的并发的 Bug（如竞态条件、死锁）
::

#### 声明式 2
:text-title{t="声明式编程" type="2"}

::text-space
---
type: tip
---
声明式编程是一个总称， 包括许多更知名的编程范例 。
::



[​​声明式编程​​	(Declarative Programming)](https://en.wikipedia.org/wiki/Declarative_programming) 有一说一我还挺喜欢这个范式的，不过他竟然还有个子范式，大名鼎鼎的 Functional programming  函数式编程 没想到也是在这个范式里面的。总的来说声明式的特点是 **关注“做什么”（What）**:


```
┌───────────────────────┐                                                        
│    Clojure vs Java    │                                                        
└───────────────────────┤                                                        
                        │                                                        
> (->> [1 2 3 4 5 6]    │   import java.util.*;                                  
     (filter even?)     │                                                        
     (map #(* % %))     │   public class Main {                                  
     (reduce +))        │     public static void main(String[] args) {           
56                      │       int sum = 0;                                     
                        │       for (int num : Arrays.asList(1, 2, 3, 4, 5, 6)) {
                        │         if (num % 2 == 0) {                            
                        │           System.out.println(sum += num * num);        
                        │         }                                              
                        │       }                                                
                        │     }                                                  
                        │   }                                                    
                        │                                                        
```

数据像流水线一样通过转换规则，​​无需关心中间步骤如何实现​​。而命令式则是需自行实现迭代、过滤、计算和累加，​​每一步都暴露细节​​。BTW, THIS Thread safety



#### 命令式 2
:text-title{t="命令式编程" type="2"}
[​​命令式编程​​	(Imperative Programming	)](https://en.wikipedia.org/wiki/Imperative_programming) 正如维基百科所介绍的 **“命令式编程侧重于描述程序如何逐步运行”** 我觉得这句话很精髓，也就是关注 **如何做”（How）**，不过有一说一两种方式跟思维习惯有很大的关系。两者的区别是 **过程导向​​ or 目标导向​**。酱紫好像声明式更适合我，但命令式貌似上限更高？命令式更接近底层​的感觉，比如直接操作内存、寄存器、指针\手动实现循环展开、内存预分配

就像是选择系统时，是想选择 Windows 还是 Linux 甚至是 macOS 的感觉一样。如果选择了 Linux，那就会接触到各种各样的技术栈，比如打包、构建、包管理、桌面管理将时间花在自定义和 Linux 生态上，每次更新都能遇到一大堆 warning 甚至是引导错误，随处可见的 Bug 等着你的 PR。


macOS 则偏向“开箱即用”（Out-of-the-Box Experience），大多数功能都已经封装得很好，适合直接“做事”而不是“折腾”。虽然可自定义性有限，但开发者可以在其封闭但统一的环境中获得一致性体验（Consistent Developer Environment）。当然，如果你乐于突破沙箱限制，说不定还能邂逅一个 0day CVE（笑）。

Windows 则更像是一个多元宇宙。无论是进行商业软件开发、跑各种奇怪的 GUI 工具，还是畅玩 3A 大作，它都能胜任。这个系统更倾向于广度而非深度，提供了一个丰富而包容的生态，适合“想怎么玩就怎么玩”。

---

## Protocols 2
:text-title{t="Protocols"}

有一说一这个 Protocols 一眼让我联想到了 [Internet protocol suite](https://en.wikipedia.org/wiki/Internet_protocol_suite)。还想着 Clojure 竟然还能写协议？不过仔细看了下 [Clojure Protocols](https://clojure.org/reference/protocols) 章节发现只能是 **定义“什么能做什么”（如 Movable 协议要求实现 move 方法）。而隔壁的 [​​Rust protocol crate](https://docs.rs/protocol/latest/protocol/) 则是实打实的 Protocols**:

| Code | Info |
| --- | --- | 
| (defprotocol Greet) | 定义“打招呼”的标准（如挥手、微笑、说“Hi”）。 |
| (defrecord Person)  | 人类实现：用语言打招呼。 |
| (defrecord Robot)  | 机器人实现：用电子音打招呼。 |
| (extend-type String) | 让纸条（String）也能“打招呼”（打印文字）。 |

```
Protocol  │ (defprotocol Greet                                           
          │   (say-hi [this]))                                           
                                                                         
                                                                         
Defrecord │ (defrecord Person [name]                                     
          │   Greet                                                      
          │   (say-hi [this] (println (str "Hi, I'm " (:name this)))))   
          │                                                              
          │ (defrecord Robot [id]                                        
          │   Greet                                                      
          │   (say-hi [this] (println (str "Beep " (:id this)))))        
                                                                         
                                                                         
            (def alice (->Person "Alice"))                               
            (def bot (->Robot 42))                                       
                                                                         
            (say-hi alice)  ;"Hi, I'm Alice"                             
            (say-hi bot)    ;Beep 42"                                    
                                                                         
                                                                         
extend-ty │ (extend-type String                                          
pe        │   Greet                                                      
          │   (say-hi [this] (println (str "Hello from string: " this))))
          │                                                              
          │ (say-hi "Clojure") ;"Hello from string: Clojure"             
```


---

## STM 2
:text-title{t="STM"}
[STM(software transactional memory, 软件事务内存)](https://en.wikipedia.org/wiki/Software_transactional_memory) 在最后一个章节中，作者讲述的是 Clojure 的并发控制。以体现出与 Io、Scala、Erlang 的不同之处。上述大多是采用 Actor，而 Clojure 则内建了 STM。（有一说一真的很像是学 spring cloud 时候的感觉 


::text-space
---
type: tip
---
`Var` 通过线程隔离确保安全使用可变存储位置，而事务引用 （`Refs`） 确保通过软件事务内存 （STM） 系统安全共享可变存储位置。
::

| NAME | DESC | TIP |
| --- | --- | --- |
| alter | 标准修改，基于当前值 | STM 提供的三种方式 |
| commute | 可交换（commutative）操作，适合并发较高场景 | |
| ref-set | 直接替换整个值 | |
| ensure |  用于读取但不修改的 Ref，它的值不能被其他事务修改，否则当前事务失败 | |
| nvecs | 有多少个向量（Ref）| `run [nvecs nitems nthreads niters]` |
| nitems | 每个向量有多少个元素 | |
| nthreads | 启动多少线程 | |
| niters | 每个线程执行多少次交换操作 | |
| 有序 | 元素有固定的顺序，按插入顺序排列 | 向量（Vector） |
| 可索引 | 可以通过索引访问某个位置的元素（和数组类似） | |
| 不可变 | 向量一旦创建，原始值不会被修改（更新会返回一个新的向量） | |
| 高效结构共享 | 修改后的向量共享结构，效率高，适合并发和持久化操作 | |

多说无益，Clojure Docs 给了一个很好的例子诠释其哲学：

```
; 
(defn run [nvecs nitems nthreads niters]
  (let [vec-refs (vec (map (comp ref vec)
                           (partition nitems (range (* nvecs nitems)))))
        swap #(let [v1 (rand-int nvecs)
                    v2 (rand-int nvecs)
                    i1 (rand-int nitems)
                    i2 (rand-int nitems)]
                (dosync
                 (let [temp (nth @(vec-refs v1) i1)]
                   (alter (vec-refs v1) assoc i1 (nth @(vec-refs v2) i2))
                   (alter (vec-refs v2) assoc i2 temp))))
        report #(do
                 (prn (map deref vec-refs))
                 (println "Distinct:"
                          (count (distinct (apply concat (map deref vec-refs))))))]
    (report)
    (dorun (apply pcalls (repeat nthreads #(dotimes [_ niters] (swap)))))
    (report)))
    (run 100 10 10 100000)
---
([0 1 2 3 4 5 6 7 8 9] [10 11 12 13 14 15 16 17 18 19] ...
 [990 991 992 993 994 995 996 997 998 999])
Distinct: 1000
```

> 你有很多盒子，每个盒子里装着不重复的数字（连续编号）<br>
你派出好多工人（线程），每个人不停地随机去两个盒子里拿数字换来换去<br>
这个换数字的过程用了一套“事务系统”保证不会打架（线程安全）<br>
换来换去之后，数字的总数和唯一性不会丢失（不会丢数字，也不会重复数字）<br>
最终打印开始和结束时盒子里的数字，证明所有数字依旧完整且没错乱。 <br>

你有一排盒子，每个盒子里装着一组连续的数字。所有盒子按顺序排列成一个大箱子。然后随机找两个盒子，从每个盒子里随机拿出一个数字，把这两个数字交换。整个交换过程是原子的，不会被其他线程打断，最后打印当前所有盒子里的数字状态，然后检查有没有数字丢失或者重复。


---

# Haskell 1
:text-title{t="Haskell"}

::wise-info
---
topic: Haskell History
by: Wikipedia
---
1985 年 Research Software Ltd. 发布 Miranda 后，人们对惰性函数式语言的兴趣与日俱增。

到 1987 年，已经存在了十几种非严格的、纯函数式编程语言。Miranda 是使用最广泛的，但它是专有软件 。

**在俄勒冈州波特兰市举行的函数式编程语言和计算机体系结构 （FPCA '87） 会议上，人们达成了强烈共识，即成立一个委员会来定义此类语言的开放标准 。**

该委员会的目的是将现有的函数式语言整合为通用语言，作为未来函数式语言设计研究的基础。
::


## Guards 2
:text-title{t="Guards" type="2"}
作为一个将 `λ` 体现在 Logo 上的 Language 来说，我认为学术风格必然会占很大的比例（从文档上也能直接看出是很纯粹的 tech style）。感觉第一章的内容和 Haskell website 上的那个 “Try it!” 很像，内容相近。不过最让我好奇的是 `Guards`(pattern guard) 的条件表达式，类比于其他语言中的 `if-else` or `switch-case`:

```
f x
  | pat <- exp
  , condition
  = result

--- Exp

addMaybe :: Maybe Int -> Maybe Int -> Int
addMaybe x y
  | Just a <- x
  , Just b <- y
  = a + b
addMaybe _ _ = 0 

main = do
  print (addMaybe (Just 1) (Just 1)) 
  print (addMaybe (Just 1) Nothing)
  print (addMaybe Nothing (Just 1))

---> Output
2
0
0
```

例如上述的 `pat <- exp` 就相当于一个模式守卫(pattern guards)，如果 `x` 和 `y` 都是 `Just`。比较有趣的是，Haskell 貌似有点语义化？比如 `Maybe` 类型和他的 `Just` 构造函数，都是能从字面意义上理解的。对于这两个的理解我还挺喜欢这篇  [What does the "Just" syntax mean in Haskell?](https://stackoverflow.com/questions/18808258/what-does-the-just-syntax-mean-in-haskell) 回答的。 


::

