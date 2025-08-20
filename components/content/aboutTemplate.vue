<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();
defineProps(["title", "desc", "time", "name", "about"]);

useSeoMeta({
  title: "About",
  description: "Computer networking,Security, and Design Enthusiast.",
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
    name: "Mini fridge ",
    time: "2018",
    post: "presented by",
    url: "https://music.163.com/song?id=1382535015&userid=1548171212",
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
    name: "Turing Robot",
    time: "2020",
    post: "Vulnerability Report",
    url: "https://www.turingapi.com/",
  },
  {
    name: "expressjs",
    time: "2021",
    post: "translate contribution",
    url: "https://expressjs.com/",
  },
  {
    name: "HONKER UNION OF CHINA GROUP CO., LIMITED",
    time: "2021",
    post: "Intern",
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
    post: "translate contribution",
    url: "https://astro.build/",
  },
  {
    name: "Mini fridge ",
    time: "2023",
    post: "CD cover design",
    url: "https://music.163.com/song?id=2075128378&userid=1548171212",
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
    post: "UX contribution",
    url: "/outher/ethereum-website-pr",
  },
  {
    name: "Xmatrix",
    time: "2024",
    post: "UX&Dev",
    url: "",
  },
  {
    name: "Fail Better",
    time: "2025",
    post: "Music plan",
    url: "https://music.163.com/album?id=269753280&uct2=U2FsdGVkX18HYVDgqixHSCRrizD9UnRXY4cZjvOxTVY=",
  },
  {
    name: "Scala AST-explorer",
    time: "2025",
    post: "Contributor",
    url: "https://scalameta.org/ast-explorer/",
  },
];
</script>

<template>
  <main class="about-page">
    <div class="hello">
      <div class="tip">
        <p class="about">
          <this-page>about</this-page>
        </p>
        <div class="tip-title">
          <p>interest://</p>
          <an-font
            class="me-tip"
            :text="[
              'Exploring Cybersecurity',
              'Designing for Fun',
              'Making Animations',
              'Creating Technical Art',
              'Building Full Stack Projects',
            ]"
          />
        </div>
        <div class="desc">
          <div class="desc-layout">
            <div v-html="about"></div>
          </div>
        </div>
      </div>
      <div class="work">
        <div class="work-info">
          <p>Contribution Logs</p>
          <div class="work-info-text">
            <slot name="contributiondes" />
          </div>
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
            <span class="job-time">{{ time }}</span>
            <p class="job-name">{{ name }}</p>
            <span class="title">{{ title }}</span>
            <small>"{{ desc }}"</small>
          </div>
        </div>
      </div>
      <div class="work-log">
        <slot name="end"></slot>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.about-page {
  a {
    text-decoration: none;
  }

  .desc-layout {
    color: #cbcbcb;
    font-size: 15px;

    margin-top: 30px;

    p {
      margin: 0px;
      margin-bottom: 0px;
    }
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
        color: #a6a6a6;
        font-size: initial;
        font-weight: bold;
      }
    }
  }

  .work-info {
    flex: 1;

    p {
      padding: 0;
      color: #000;
    }

    .work-info-text {
      p {
        color: #a6a6a6;
        font-weight: 400 !important;
        display: block;
        padding-bottom: 1rem;
        text-align: justify;
        margin: 0;
        font-size: 14px;
      }
    }
  }

  .hello {
    background: #ffffff;

    .tip {
      padding-top: 20vh;
      padding-bottom: 15vh;
      font-size: 2.8vw;
      width: 60%;

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
        color: #a6a6a6;
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
        font-size: 2vh;
        width: 100%;
        line-height: 1.5;
        margin-top: 1vh;

        .desc-layout {
          text-align: justify;

          p:nth-child(n + 2) {
            margin-top: 20px;
          }

          @media (max-width: 1024px) {
            column-count: 1;
          }
        }
      }
    }
  }

  .about {
    font-size: x-large;
    color: #38e7cd !important;
    text-transform: uppercase;

    small {
      color: #404040;
      font-size: initial;
      padding-right: 10px;
    }
  }
}

.dark-mode .hello {
  background: rgb(0, 0, 0);
}

.dark-mode .work-info p {
  color: #ffffff;
}
</style>
