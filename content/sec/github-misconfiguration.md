---
title: GraphQL Misconfiguration in CWE-16 Github API 
description: "This is my first time submitting a bug and receiving a bounty along with other rewards, so it's quite memorable for me. Since I've been fully immersed in product design and development, discovering security flaws in well-known companies or platforms again is like reaching a milestone for me."
director: "RHYME.Q"
time: "2023.12.04"
platform: "github"
img: "02/1.png"
info: "https://hackerone.com/iepn"
types: "cc"
client: "Github"
---

::main-content{:title="title" :client="client" :time="time" :img="img" :info="info" :types="types"}

:text-sum{:desc="description"}

I really like the GitHub Octocat, and I've even had friends who use it as their avatar.  The Octocat on the cover comes from [GitHub Octocats](https://octodex.github.com/), designed by [@James Kang](https://jeejkang.com/Information).  You can create your own Octocat at [myOctocat](https://myoctocat.com/).

In 2011, GitHub decided it was time to upgrade their mascot, the Octocat.  They invited many designers to create their own versions, including [Cameron McEfee](https://cameronmcefee.com/work/the-octocat/), [@James Kang](https://jeejkang.com/Information), [@KimEstoesta](https://www.kimestoesta.com/), and more.

::text-space
---
type: tip
---
@Cameron McEfee: From stickers on laptops and graphics on clothing to stickers on every bar wall, telephone pole, and street sign, the Octocat is one of the most recognizable symbols in the tech industry.
::

One of the Octocats designed by James Kang, the Private Investocat, serves as the iconic avatar for GitHub Security - GitHub Bug Bounty.

I also received a $200 USD ≈ 1,439 CNY bug bounty from GitHub Bug Bounty, the first time I've received such a generous cash reward on my security journey.

::text-space
---
img: 02/info/1.png
info: Figure 1 | I was lucky enough to receive their physical stickers and pins 13 years after they were proposed.  Their designers are @KimEstoesta and @Cameron McEfee.
---
::

Unfortunately, my role has always been as an ACD (Assistant) in the team, slow to grow and easy to be taken down solo. I have some achievements in various fields and limited recognition, but I lack significant influence and solid project support.

Four years ago, when I realized that security exists beneath development, I started transitioning slowly towards development. One of my teachers once said, "If you truly have talent, you shouldn't invest your time in applications and frameworks; you should focus on designing principles and underlying logic."

Clearly, I have zero talent and weak foundations, and I cannot achieve much in my lifetime. After realizing my shortcomings, I became less adept at socializing and withdrew from all community groups to focus on self-improvement.

However, when I truly witnessed the outstanding participants in various competitions and security experts easily winning rewards of 100k or 300k in various rankings, I lost the confidence I had in the past.

Gradually, I realized that sometimes you don't need a beautiful interface, elegant code, perfect logic processing, or even low security. You just need a gimmick to let them know you can do it; you don't need to be perfect.

There are many examples around me where, after reaching a certain level of development, they develop a "craftsman spirit," realizing that what they did before was not good enough and striving for higher standards.

Therefore, the two types of people I admire most in my life are those who have achieved or are pursuing this level of success and those who have not pursued this level and have remained at the initial stage.

::text-space
---
img: 02/info/2.png,02/info/3.png
info: Figure 2 | My first PR and analysis from gitroll (I personally think it's a bit exaggerated, but if you consider overall ability, it's still normal).
---
::

My first GitHub PR came from Node.js three years ago when I was still in school. While learning Node.js, I got to know [expressjs](https://expressjs.com/). Undoubtedly, I felt the enthusiasm from the open-source community for the first time, and they didn't criticize my code for its lack of elegance. Instead, they provided suggestions and how they would write the code if they were in my shoes.

Fortunately, the GitHub rating portraits recently gained popularity on Twitter, and my gitroll score is 9,10. I don't think this metric is very authoritative or should be used to measure a person's coding level. However, raising gitroll to 9.5 or even close to 10 still has some significance.
::
