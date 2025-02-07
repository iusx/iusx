---
"title": "Seven Languages in Seven Weeks"
"director": "Bruce A. Tate"
"time": "2025.01.08"
img: "08/1.png"
plan: "35,323"
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

在一些大学中，会将 Prolog 放到[逻辑编程课](https://en.wikipedia.org/wiki/Logic_programming) 中。如果很不幸你没有上过（ps: 我也没上过）那可以蹭一下 The University of Texas at Dallas(德克萨斯大学达拉斯分校) 的课件 [Logic Programming:CS 6371: Advanced Programming Languages](https://personal.utdallas.edu/~hamlen/cs6371sp14/lecture21.pdf)；如果要介绍 Prolong 那就需要介绍一阶逻辑和逻辑连接词、谓词逻辑、量词等。所以我会将这部分的介绍放到 Prolog 那一章节中，这里我们就介绍作者致谢的大佬。

1. [Brian Tarbox](https://aws.amazon.com/cn/developer/community/heroes/brian-tarbox/): 通过 Prolong 进行建模，用于模拟和分析海豚在实验中的思维模式，非常有趣。可以前往他的个人 [blog](https://briantarbox.com/) 了解更多 

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

让我意外的是，这本书的前言竟然不是作者自己写的。而是 Erlang 的创建者 Joe Armstrong。我认为结尾处是比较具有讽刺意味的，如果一直学习，那么就会感觉自己超级菜，从而缺少了勇气去创建、编写一个项目，甚至是与人分享的喜悦。但在 2022 年，这个现象可以解决了，因为 ChatGPT 出来了。

如果你将自己的项目分享到某个群组，那个群组的人可能觉得你打广告，或者说炫耀？于是 Code 警察开始出动，不断的给你批斗拉踩甚至是网暴。如果你的抗压能力不是很强，或许就开始退群退网、Github 设置为隐私三件套走起。

但你如果与 ChatGPT 分享一个项目、一个思路。TA 会先肯定你，然后提出可以优化的建议。虽然整个流程看起来很正常，属于非常理智的。但如果是几十人、几百人的群组，理智往往是那么的珍贵和稀缺，大改只有立场先行和整活、玩梗的存在。

::text-tip
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


::
