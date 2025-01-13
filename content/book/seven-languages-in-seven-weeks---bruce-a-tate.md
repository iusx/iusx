---
"title": "Seven Languages in Seven Weeks"
"director": "Bruce A. Tate"
"time": "2025.01.08"
img: "08/1.png"
plan: "01"
---

::book-content{:title="title" :img="img" :by="director" :plan="plan"}

:text-title{:t="回顾下自己的十年经历"}

# 总结自己 0

如果从 2015 那个对计算机懵懂的我来说，到 2025 年已经过了十年。可以说对计算机方面拥有了十年的兴趣。假如从 2018 我第一个漏洞算起，至今已经过了七年。再从 2020 我打算学习设计开始，已经过了五年。

我觉得自己有很大的缺陷，基础不是特别牢固。之前做全栈的时候就有朋友指出我的基础不是特别好，最常说的话就是：“基础不牢，地动山摇”。做出的项目只是看起来很不错，但如果深挖细节，性能的处理就有一小部分的问题。虽然我总以 "安全爱好者" 作为 title，但我貌似并没有发现过比较知名且威胁较大的漏洞。

更不用说什么 EDUSRC、MSRC、TSRC 这些了，仅仅是公益 SRC 和 CNVD 以及 Hackerone 这些，我所发现到的或提交的更多是大佬吃剩的边角料，甚至是不屑一顾的。但我之前缺奉为瑰宝，以筑起我那脆弱且不堪一击的自信。

我还是比较庆幸自己无论做什么起码都能有一点成就的。虽然这个成就不高，但足以出去找个班上不至于饿死。做设计会有很多朋友支援下我;做安全拿到了漏洞赏金（虽然不多）;做全栈起码能混到小公司 offer；做舆情分析的时候，能被专业的人发现，引导我继续做下去。所以我还是比较幸运的，起码有点东西，虽然不多。

看完这本书后，我觉得是时候筹备下我的代表作了。因为之前很多人觉得我是臭做设计的，甚至还有人说我是个臭美工！完全无视掉了我全栈和安全架构方面的才华。所以在这之后，我会筹备一个全栈的代表作；另一个是安全架构的代表作。至于设计的代表作已经有了，再往后无非是作品。我觉得代表作这个东西首先是能给人用的，其次才是给人看的；这样说服力大一点。

之所以看这本书。首先是我觉得自己 Code 方面还是比较有问题，写 Code 总是很磨叽，和那种一写 code 就是写一天的有很大的差距。其次是我承认是被这本书的标题所吸引，作者懂不懂语言不重要，但他一定懂营销。我还不知道这本书有没有被 Percipio 收入，反正我 ACM 会员资格是到期了。这里我想吐槽下 ACM 的续费规则，我有钱的时候是想提前续费的，但 ACM 只能是快过期的时候才能续费。等真快过期的时候，我反而没钱续费了。

无奈只能找盗版 PDF 来看。这里强烈推荐 [Skip](https://skim-app.sourceforge.io/) 我觉得作为一款 PDF 阅读器来说，做到了快、文字能复制、复制的文字和 PDF 内容是一样的这种难度比较高的水准。甚至还是开源的，简直真的是太伟大了。我用过比较多的 PDF 阅读器，比如 Adobe Acrobat、PDF Expert。甚至是 福昕 PDF ，WPS PDF，给我的感觉都是卡顿还有比较大的复制问题，就是复制的文字和 PDF 里面的文字不一样。

和 Chrome 等浏览器自带的 PDF 阅读器比我认为无非是多了个签名和画线、笔记类的扩充。忘记了阅读的这第一要素，特别是像我这种 English 比较差需要 Copy 文字翻译的，比较不由好。所以对于 Skip 我是强烈推荐的。

---


:text-title{:t="作者致谢"}

# 致谢 2

又到了一个非常具有代表性的篇幅，也就是：“What Readers Are Saying About Seven Languages in Seven Weeks” 你会看到国内那种类似 xxx 专家，xxx 公司 xxx 总监 xxx 团队 xxx 实验室对某本书的友情肯定和推荐。你别说你还真别说，如果这本书讲的是思维逻辑和拆解，那确实是很不错的。但如果是技术性的，那可能从 2010 年发售至今 2025 年历经十多年的发展，技术也可能会淘汰，语法可能会变，但逻辑和思维，依然是那套惯式。

在这本书的前言中，作者透露出在 2009~2010 的时间段经历了很多人生的体验。例如他那 40 多岁的弟弟经历了心脏搭桥手术；三月底，他的妹妹确诊的乳腺癌；同月，他的母亲确诊晚期癌症。短短几天就去世了。

在这期间内，作者虽然伤心欲绝。但他回想起母亲的点点滴滴，与母亲的每次相处，特别是在作者离家前上了母亲的几节美术课，虽然作者的画很糟糕。但母亲总能将破碎不堪的画幅玩就回来成为一件精美的艺术作品。这需要天赋和经验才能将一副处在崩溃边缘的画作挽救回来。

不知你是否接触过绘画、美术。在我初中最后一年时，我因成绩垫底转到了美术班，我比较遗憾没有接触到绘画的全过程。绘画这门艺术，你需要经历过前期的 **构图、草稿、描边、上色、光影** 如果你是素描类的作品，还需要经历前期的封边到最后将美纹纸胶带撕下的过程。在作画前期，你需要构思好要画什么，然后通过一些技巧完成构图。比如透视、人体结构等。然后就是用铅笔打草稿，打草稿的过程要求一笔带过，如果不能一笔，那就需要勤加练习。所以在美术课中你会看到一开始要求画线，无论板绘还是素描都是这样。

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

再然后就是 [Prolog community(Programming in Logic community)](https://en.wikipedia.org/wiki/Prolog)，这是一种逻辑编程语言。这种类型的我还没有接触过，他更像是数学中的逻辑推理。他的基础是一阶逻辑(First-order logic) 其核心的写法和经常接触到的语言有很大的不同。他的语法例如：

```
grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
父母关系：如果 X 是 Y 的父母，且 Y 是 Z 的父母，则 X 是 Z 的祖父母。
```

在一些大学中，会将 Prolog 放到[逻辑编程课](https://en.wikipedia.org/wiki/Logic_programming) 中。如果很不幸你没有上过（ps: 我也没上过）那可以蹭一下 The University of Texas at Dallas(德克萨斯大学达拉斯分校) 的课件 [Logic Programming:CS 6371: Advanced Programming Languages](https://personal.utdallas.edu/~hamlen/cs6371sp14/lecture21.pdf)；如果要介绍 Prolong 那就需要介绍一阶逻辑和逻辑连接词、谓词逻辑、量词等。所以我会将这部分的介绍放到 Prolog 那一章节中，这里我们就介绍作者致谢的大佬。

1. [Brian Tarbox](https://aws.amazon.com/cn/developer/community/heroes/brian-tarbox/): 通过 Prolong 进行建模，用于模拟和分析海豚在实验中的思维模式，非常有趣。可以前往他的个人 [blog](https://briantarbox.com/) 了解更多 

2. [Joe Armstrong](https://en.wikipedia.org/wiki/Joe_Armstrong_(programmer)): [Erlang](https://en.wikipedia.org/wiki/Erlang_(programming_language)) 设计者之一。这是一种并发、分布式、容错的编程语言，[Elixir](https://en.wikipedia.org/wiki/Elixir_(programming_language)) 就是构建在 Erlang 之上。

作为以分布式、多线程而闻名的语言。“Let it crash（让它崩溃）” 是 Erlang 语言的一种设计哲学。当一个进程发生错误或异常时，不必尝试捕获和处理错误，而是让该进程崩溃，然后通过其他机制（如重启或恢复）来恢复系统的正常运行。


---

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

还还还有 [Haskell community](https://en.wikipedia.org/wiki/Haskell)，Haskell 专为教学、研究和工业应用而设计。以逻辑学家[哈斯克尔・柯里 (Haskell Curry) ](https://en.wikipedia.org/wiki/Haskell_Curry) 的名字命名，他的 [Lambda 演算（Lambda Calculus）](https://en.wikipedia.org/wiki/Lambda_calculus) 是函数式编程的基础，以及他对 [Currying](https://en.wikipedia.org/wiki/Currying) 的贡献。

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

# 前言 2

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

::
