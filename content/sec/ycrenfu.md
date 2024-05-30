---
"title": YICHANG HUMANWELL PHARMACEUTICAL CWE-89
"director": "RHYME.Q"
"time": "2019.08.06"
"platform": "cnnvd"
description: "从对安全的兴趣到学习第一个漏洞，我探索了 OWASP TOP 10，并发现了 Injection 漏洞，尤其是 SQL 注入。漏洞的发现让我认识到安全问题是系统设计和逻辑处理不当的结果。随着学习的深入，发现了更多类型的漏洞，而安全研究也不断拓展。安全领域的探索是一个持续学习和探索的过程，每个人都有自己的独特见解和关注点。"
"info": "http://www.ycrenfu.com.cn/"
types: "cc"
client: "Guosen Technology"
img: "05/1.png"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:text-sum{:desc="description"}

这是我从 Security 感兴趣，到学习 Security 的第一个 Vulnerability，那是正值初三临近，和小伙伴们一起讨论 [OWASP TOP 10](https://owasp.org/www-project-top-ten/)。那时的我提议要不要照着 TOP TEN 一个一个寻找并提交，以加深记忆。很幸运，我是第一个找到的，而且还是最为著名的 [A03:2021-Injection](https://owasp.org/Top10/A03_2021-Injection/) 类别中的其中一项。

虽然他目前滑落在第三名的位置，但在一些较为老旧的系统架构中，存在的概率很大。我发现的这个是属于 A03 中的 CWE-89:SQL Injection 分支，还算是较为严重的，因为可以任意查询到数据库的信息甚至是篡改。虽然在安全领域中，它的占比比较高，但在开发中这是最基础的问题，发生这个问题可能是 Code 的逻辑处理不当所导致的。

::text-space
---
img: 05/info/1.png
type: flat
info: 图源 1 | OWASP TOP TEN:Globally recognized by developers as the first step towards more secure coding.
---
::

往后发现。CWE-89 可能很少遇到，更多的是是 [A08:2021-Software and Data Integrity Failures](https://owasp.org/Top10/A03_2021-Injection/) 这一类别的 Vulnerability，因为更往后，越涉及到传输、Code 逻辑、调试等方面，而并非像是入门级那么容易发现，所以 Security 也是循序渐进的。

当 TOP TEN 的分类走到 5/1 或 5/2 时，就到了一个分叉口，即全职和研究、业余的区分，如果要走研究，那可能要细分很多领域，例如微架构安全的研究。很多时候不是在学习就是在学习的路上，有时候可能在学习的过程中，可能会碰到一些切入点，然后才有了 Vulnerability。

到了这个阶段，几乎并非是为了 Vulnerability 而 Vulnerability，更多的是学习和探索。大多数人更多的是走前人已走过的路，因此很自然的就会执着于 Vulnerability 和各种演讲、证书和比赛，心以浮躁，沉下心来无名无利的研究某项事物，可能已是稍有难度的事情。每个人都有对 Security 的见解和认识。有的人执迷与赏金、排名和竞赛，有的人执迷与探索和研究，更有的人执迷于演讲和步道。

正如看到这篇文章的你一样，可能你会发现很多的错别字，和表述不通的情况。假如你是一个专业的文学工作者，几乎一眼过去就以发现了其中的问题，你可能会到处指责错误，也可能是联系我修复这些错误，一切取决于你的选择。

在这个过程中，将这些一个一个的问题视作 Vulnerability ，生活中，很有可能会有更多奇奇怪怪超脱逻辑问题的发生，可以尝试下 [A01:2021 – Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)，很有可能发生意想不到的结果。
::