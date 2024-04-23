<script setup>
const contribution = [
  {
    name: "darkworl analysis",
    time: "2015",
    post: "software engineer",
  },
  {
    name: "Miji Innovation",
    time: "2018",
    post: "Java GUI engineer",
  },
  {
    name: "Yichang Humanwell Pharmaceutical Co., Ltd",
    time: "2019",
    post: "security service",
    url: "http://www.ycrenfu.com.cn/",
  },
  {
    name: "China Telecom Group Guangdong Corporation",
    time: "2020",
    post: "security service",
    url: "https://www.cnvd.org.cn/flaw/show/1976603",
  },
  {
    name: "Henan Yadu Medical Group Corporation",
    time: "2020",
    post: "security service",
    url: "https://www.yadugroup.com/",
  },
  {
    name: "Topchoice Medical Invesment Co., Inc",
    time: "2020",
    post: "security service",
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
  },
  {
    name: "Shenzhen Edraw Software CO.,LTD.",
    time: "2021",
    post: "security service",
    url: "https://www.cnvd.org.cn/flaw/show/3173261",
  },
  {
    name: "Cloud Competition Epoch co., ltd.",
    time: "2022",
    post: "Full stack",
  },
  {
    name: "Lunar art",
    time: "2022",
    post: "front-end",
  },
  {
    name: "WEB3IN TECH-LAB",
    time: "2023",
    post: "UX",
  },
  {
    name: "astro",
    time: "2023",
    post: "translate",
    url: "https://astro.build/",
  },
  {
    name: "China Sciences Anxin",
    time: "2023",
    post: "design",
  },
  {
    name: "GitHub",
    time: "2023",
    post: "security service",
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
        <p class="about">ABOUT</p>
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
              Lucky you stumbled upon my profile! I'm currently a freelance
              laissez-faire designer, a developer you shouldn't trust, an
              architect with a tech stack messier than a teenager's room, a
              product designer whose designs have gone unnoticed, an operations
              guy with triple-digit views, and a blockchain developer who's
              experienced a few too many "Oops!" moments.
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
        <p>Contribution Logs</p>
        <div class="work-layout">
          <div class="tables">
            <an-table :table="contribution" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.work {
  color: #cbcbcb;
  width: 80%;
  font-size: larger;
  margin: 0 auto;
}
.work-layout {
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  .tables {
    width: 80%;
  }
}
.hello {
  background: #000000;
  height: 200vh;
  .tip {
    height: 100vh;
    font-size: 5.8vw;
    width: 80%;
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
}
</style>
