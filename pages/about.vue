<script setup>
useSeoMeta({
  title: "About - RHYME.Q",
  description: "Github + Hackerone + Behance ÷ Researchgate",
});

const contribution = [
  {
    name: "darkworl analysis",
    time: "2015",
    post: "software engineer",
    url: "https://www.behance.net/gallery/185829735/Junior-high-school-works-(part)",
  },
  {
    name: "Miji Innovation",
    time: "2018",
    post: "Java GUI engineer",
    url: "https://www.behance.net/gallery/185829735/Junior-high-school-works-(part)",
  },
  {
    name: "Yichang Humanwell Pharmaceutical Co., Ltd",
    time: "2019",
    post: "Vulnerability Report",
    url: "http://www.ycrenfu.com.cn/",
  },
  {
    name: "China Telecom Group Guangdong Corporation",
    time: "2020",
    post: "Vulnerability Report",
    url: "https://www.cnvd.org.cn/flaw/show/1976603",
  },
  {
    name: "Henan Yadu Medical Group Corporation",
    time: "2020",
    post: "Vulnerability Report",
    url: "https://www.yadugroup.com/",
  },
  {
    name: "Topchoice Medical Invesment Co., Inc",
    time: "2020",
    post: "Vulnerability Report",
    url: "http://www.tcmedical.com.cn/",
  },
  {
    name: "expressjs",
    time: "2021",
    post: "translate",
    url: "https://expressjs.com/",
  },
  {
    name: "HONKER UNION OF CHINA GROUP CO., LIMITED",
    time: "2021",
    post: "Placement",
    url: "https://www.behance.net/gallery/185829735/Junior-high-school-works-(part)",
  },
  {
    name: "Shenzhen Edraw Software CO.,LTD.",
    time: "2021",
    post: "Vulnerability Report",
    url: "https://www.cnvd.org.cn/flaw/show/3173261",
  },
  {
    name: "Cloud Competition Epoch co., ltd.",
    time: "2022",
    post: "Full stack",
    url: "https://www.behance.net/gallery/186318467/Blockchain-screening-platform",
  },
  {
    name: "Programmer Community",
    time: "2022",
    post: "design",
    url: "https://www.behance.net/gallery/196951137/Programmer-Community",
  },
  {
    name: "CRG",
    time: "2022",
    post: "design",
    url: "https://www.behance.net/gallery/157417815/CRG-FPS-",
  },
  {
    name: "vulnerability find infinite co., ltd.",
    time: "2022",
    post: "design",
    url: "https://www.behance.net/gallery/196951973/vulnerability-find-infinite",
  },
  {
    name: "Lunar art co., ltd.",
    time: "2022",
    post: "front-end",
    url: "https://www.zcool.com.cn/work/ZNjE4MDAxMjg=.html",
  },
  {
    name: "SETI@Home",
    time: "2023",
    post: "UI",
    url: "https://www.behance.net/gallery/185824095/SETIHOME-SSITE",
  },
  {
    name: "WEB3IN TECH-LAB",
    time: "2023",
    post: "UI",
    url: "https://www.behance.net/gallery/186608845/Asteroid-Web-APP",
  },
  {
    name: "astro",
    time: "2023",
    post: "translate",
    url: "https://astro.build/",
  },
  {
    name: "China Sciences Anxin co., ltd.",
    time: "2023",
    post: "design",
    url: "https://www.behance.net/gallery/185824781/-Logo",
  },
  {
    name: "Kong translate co., ltd.",
    time: "2023",
    post: "UX",
  },
  {
    name: "Splash co., ltd.",
    time: "2023",
    post: "design",
    url: "https://www.behance.net/gallery/185824545/Spline-logo-Web",
  },
  {
    name: "NPO.NETWORK",
    time: "2023",
    post: "design",
    url: "https://www.behance.net/gallery/185829509/NPONETWORK-Logo-Web",
  },
  {
    name: "acglabs",
    time: "2023",
    post: "design",
  },
  {
    name: "GitHub",
    time: "2023",
    post: "Vulnerability Report",
    url: "https://hackerone.com/iepn",
  },
  {
    name: "Ethereum ORG",
    time: "2024",
    post: "UX",
    url: "https://ethereum.org/",
  },
];
</script>

<template>
  <main>
    <div class="hello">
      <div class="tip">
        <p class="about">
          <a href="/"><small>Home /</small> </a>ABOUT
        </p>
        <div class="tip-title">
          <p>TAG://</p>
          <an-font
            class="me-tip"
            :text="[
              'Software development',
              'Security research',
              'Designer',
              'Full stack development',
            ]"
          />
        </div>
        <div class="desc">
          <div class="desc-layout">
            <p>
              Lucky you stumbled upon my profile! Born in 2004, I've been
              immersed in computer networking knowledge since childhood. I'm
              currently a freelance laissez-faire designer, a developer you
              shouldn't trust, an architect with a tech stack messier than a
              first LEGO set, a product designer whose designs have gone
              unnoticed, an operations guy with triple-digit views, and a
              blockchain developer who's experienced a few too many "Oops!"
              moments.
            </p>
            <p>
              Though I often wear the hat of a Security Researcher, my days
              aren't filled with the monotony of NetworkStreams. Instead, I
              craft applications and protocols in the vast and intriguing realm
              of cybersecurity. So, let's ditch the "Vulnerability = ALL"
              mindset, shall we?
            </p>
            <p>
              Over the past decade, I've worn many hats—product design, security
              research, front-end, back-end, software dev, blockchain,
              DevOps—you name it.
            </p>
            <p>
              Nowadays, I lead the Jiangxue Academy Union Lab Team, dedicated to
              Fringe Science Research and Support. Fringe Science Research and
              Support.
            </p>
          </div>
        </div>
      </div>
      <div class="work">
        <div class="work-info">
          <p>Contribution Logs</p>
          <span
            >*I'm well aware that my understanding of design, development, and
            security is not yet sufficient.
          </span>
          <span>
            Therefore, all experiences before 2024 are flawed to some extent,
            and I plan to address these shortcomings as I continue to learn and
            grow.</span
          >
        </div>
        <div class="work-layout">
          <div class="tables">
            <an-table :table="contribution" />
          </div>
        </div>
      </div>
      <div class="work">
        <div class="work-info">
          <p>Work Experience</p>
        </div>
        <div class="work-layout">
          <div class="job">
            <span class="job-time">2015 - now Shenzhen </span>
            <p class="job-name">Jiangxue Academy</p>
            <span class="title">UNION LAB - software engineer</span>
            <small>"Fringe Science Research And Support"</small>
          </div>
        </div>
      </div>
      <div class="work-log">
        <p>
          Success is not final, failure is not fatal: It is the courage to
          continue that counts.
        </p>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.work {
  color: #cbcbcb;
  width: 80%;
  font-size: larger;
  margin: 0 auto;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 1024px) {
    display: block;
  }
  display: flex;
  padding-bottom: 15rem;
}
.work-log {
  width: 80%;
  @media (max-width: 768px) {
    width: 90%;
  }
  margin: 0 auto;
  padding-bottom: 15rem;
  color: #cbcbcb;
  text-transform: uppercase;
  p {
    margin: 0;
  }
}
.work-layout {
  display: flex;
  width: 100%;
  flex: 2;
  @media (max-width: 1024px) {
    display: block;
  }
  flex-direction: row-reverse;
  .tables {
    width: 90%;
  }
  .job {
    display: block;
    font-weight: 300;
    text-transform: capitalize;
    width: 90%;
    small {
      display: block;
      padding-top: 1rem;
      font-size: initial;
    }
    p {
      margin: 0;
    }
    .job-time {
      color: #5c5c5c;
      font-size: initial;
    }
  }
}
.work-info {
  flex: 1;
  p {
    padding: 0;
  }
  span {
    color: #404040;
    display: block;
    padding-bottom: 1rem;
    text-align: justify;
    font-size: initial;
  }
}
.hello {
  background: #000000;
  .tip {
    height: 100vh;
    font-size: 5.8vw;
    width: 80%;
    @media (max-width: 768px) {
      width: 90%;
    }
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    .tip-title {
      display: flex;
      width: 100%;
    }
    p {
      color: #404040;
      margin: 0;
      padding-right: 5px;
    }
    .me-tip {
      font-weight: 300;
      width: 80%;
      @media (max-width: 768px) {
        width: 90%;
      }
      color: #cbcbcb;
    }
    .desc {
      font-size: small;
      width: 100%;
      margin-top: 30px;
      line-height: 1.5;
      .desc-layout {
        column-count: 2;
        text-align: justify;
        @media (max-width: 1024px) {
          column-count: 1;
        }
        p {
          margin-bottom: 30px;
        }
      }
    }
  }
}
.about {
  font-size: x-large;
  color: #00ffc8 !important;
  text-transform: uppercase;
  small {
    color: #404040;
    font-size: initial;
    padding-right: 10px;
  }
}
</style>
