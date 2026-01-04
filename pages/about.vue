<template>
  <div class="app-wrapper">
    <div class="sticky-visual">
      <div class="desktop-progress" ref="progressBar"></div>

      <div
        v-for="n in 6"
        :key="n"
        :class="[
          'shape-container',
          `shape-${n}`,
          { 'is-active': activeSection === n },
        ]"
      >
        <svg
          v-if="n === 1"
          class="shape-svg organic-breath"
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="150" cy="150" r="3" class="core-point" />

          <circle cx="150" cy="150" r="70" class="ring-breath" />

          <circle
            cx="150"
            cy="150"
            r="110"
            class="ring-influence"
            stroke-dasharray="1 8"
          />
        </svg>
        <div v-if="n === 2" class="vuln-cards-wrapper" ref="cardStack">
          <div v-for="(card, i) in vulnData" :key="i" class="vuln-card">
            <span class="card-tag">{{ card.platform }}</span>
            <h3 class="card-id">{{ card.id }}</h3>
            <p class="card-desc">{{ card.name }} {{ card.post }}</p>
          </div>
        </div>
        <div v-if="n === 3" class="design-grid-wrapper" ref="designGrid">
          <div class="grid-guides">
            <div class="v-line" v-for="i in 3" :key="'v' + i"></div>
            <div class="h-line" v-for="i in 3" :key="'h' + i"></div>
          </div>

          <div class="design-columns">
            <div class="design-col col-left">
              <div v-for="img in leftPhotos" :key="img" class="design-item">
                <img :src="img" loading="lazy" />
              </div>
            </div>
            <div class="design-col col-right">
              <div v-for="img in rightPhotos" :key="img" class="design-item">
                <img :src="img" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="n === 4" class="end-line"></div>
      </div>
    </div>

    <div class="content">
      <header>
        <div>
          <this-page style="margin: 0; padding: 0"><h1>I hobbies</h1></this-page>
          <span class="title-large"
            ><an-font
              class="me-tip"
              :text="[
                'Design',
                'Cybersecurity',
                'Technical Art',
                'Creating ideas',
                'Bicycle touring',
              ]"
          /></span>
          <span class="large-span">
            A person with no education, no professional certificates, and not
            even any background. Has considerable interest in security, design,
            technical art, and software development, but only as a hobby rather
            than with professional rigor. Focused on implementing functionality,
            achieving desired effects, or accomplishing specific goals, rather
            than pursuing perfection.
          </span>
        </div>
      </header>

      <section
        v-for="(sec, index) in sections"
        :key="index"
        ref="sectionRefs"
        :class="[
          'scroll-section',
          `s${index + 1}`,
          { 'has-table': sec.showTable },
        ]"
      >
        <p class="focus-text" v-html="sec.title"></p>
        <p class="description">{{ sec.desc }}</p>

        <div v-if="sec.showTable" class="table-wrapper">
          <div class="table-inner-scroll">
            <an-table :table="sec.tableData" />
          </div>
          <div class="mobile-table-hint">
            <span>Scroll to explore list</span>
            <div class="hint-line"></div>
          </div>
        </div>
        <div v-if="sec.showUser" class="userinfo">
          <a
            :href="user.behanceUrl"
            target="_blank"
            class="behance-card"
            v-for="user in userinfo"
          >
            <div
              class="logo-box"
              v-html="user.svg"
              style="filter: grayscale(100%)"
            ></div>
            <div class="divider"></div>

            <div class="meta-info">
              <span class="username">{{ user.name }}</span>
              <span class="stats">
                <strong>{{ user.followers }}</strong> Follow
              </span>
            </div>
          </a>
        </div>
      </section>

      <div class="closing-section">
        <div class="closer">
          <span>2015 - Now </span>
          <strong>Jiangxue analysis </strong>
          Full-Stack Software Engineer- "Fringe Support And Analysis"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const colorMode = useColorMode();
console.log(colorMode.preference);

gsap.registerPlugin(ScrollTrigger);

const activeSection = ref(0);
const sectionRefs = ref([]);
const progressBar = ref(null);
const progressCircle = ref(null);
const userinfo = [
  {
    name: "ᗜ ヘ ᗜ 💧",
    followers: "2.2k",
    behanceUrl: "https://www.behance.net/1ui",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_987_262)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0ZM19.2465 12.8531C18.7339 12.8531 18.2714 12.9438 17.8526 13.1247C17.4309 13.3061 17.0734 13.5549 16.7688 13.8672C16.4643 14.1795 16.2356 14.5507 16.0688 14.9832C15.9019 15.4288 15.8185 15.9012 15.8228 16.3769C15.8228 16.8912 15.9048 17.3676 16.0627 17.7973C16.2126 18.2089 16.4436 18.5865 16.7421 18.9077C17.0455 19.2209 17.4131 19.4651 17.8198 19.6235C18.2447 19.7904 18.7161 19.875 19.2432 19.875C19.9957 19.875 20.646 19.6997 21.176 19.3546C21.7148 19.0101 22.1075 18.4401 22.368 17.6364H20.7515C20.6901 17.8408 20.5289 18.0395 20.2623 18.2265C19.9957 18.4135 19.6738 18.507 19.3046 18.507C18.7892 18.507 18.3937 18.3723 18.1187 18.1035C17.8409 17.838 17.6651 17.3382 17.6651 16.815H22.4884C22.5232 16.3165 22.4797 15.8157 22.3595 15.3306C22.2396 14.8574 22.0461 14.4334 21.7738 14.0654C21.5016 13.6975 21.153 13.4025 20.7313 13.1832C20.3064 12.9611 19.8116 12.8531 19.2465 12.8531ZM11.8486 10.5H7.5V19.7048H11.9718C12.3874 19.7048 12.789 19.6525 13.1783 19.5501C13.5705 19.4477 13.9219 19.2896 14.2265 19.0736C14.5321 18.8576 14.782 18.5722 14.9555 18.241C15.1341 17.902 15.2249 17.5018 15.2249 17.0343C15.2249 16.4555 15.0905 15.9645 14.8093 15.5554C14.5282 15.1492 14.1098 14.863 13.5415 14.6994C13.9571 14.5007 14.2677 14.2492 14.4814 13.9397C14.6922 13.6301 14.7976 13.2444 14.7976 12.7797C14.7976 12.35 14.7274 11.9877 14.5868 11.6983C14.4406 11.4061 14.2415 11.1723 13.9838 10.997C13.7228 10.8217 13.4154 10.6926 13.0523 10.6169C12.6892 10.5379 12.2909 10.5 11.8486 10.5ZM11.7319 15.5989C12.171 15.5989 12.5252 15.6985 12.7918 15.9C13.0584 16.1043 13.1929 16.4438 13.1929 16.9169C13.1929 17.1596 13.1549 17.3583 13.0729 17.513C12.9909 17.671 12.8766 17.7907 12.7421 17.8814C12.6072 17.9749 12.446 18.0367 12.2647 18.0773C12.0857 18.118 11.8954 18.1358 11.6963 18.1358L11.6968 18.1325H9.52975V15.5989H11.7319ZM19.1875 14.2319C19.6354 14.2319 20.0074 14.3637 20.2239 14.6031C20.4436 14.8453 20.6048 15.1903 20.6489 15.6578H17.6619C17.6703 15.5293 17.6998 15.3801 17.7467 15.2193C17.7935 15.0528 17.8755 14.8953 17.9927 14.749C18.1215 14.5962 18.2799 14.4711 18.4584 14.381C18.6514 14.2814 18.8946 14.2319 19.1875 14.2319ZM11.4269 12.0667C11.6018 12.0657 11.7764 12.0814 11.9484 12.1135C12.1067 12.1377 12.2588 12.1923 12.3963 12.2743C12.5279 12.3515 12.6361 12.4626 12.7098 12.596C12.7862 12.7329 12.8241 12.9115 12.8241 13.1247C12.8241 13.51 12.7126 13.7905 12.4783 13.9602C12.244 14.1327 11.9456 14.2174 11.5853 14.2174H9.52928V12.0667H11.4269ZM21.026 11.2424H17.2866V12.1513H21.026V11.2424Z" fill="#37E8CE"/>
</g>
<defs>
<clipPath id="clip0_987_262">
<rect width="30" height="30" fill="white"/>
</clipPath>
</defs>
</svg>
`,
  },
  {
    name: "˶>𖥦<",
    followers: "500+",
    behanceUrl: "https://github.com/iusx",
    svg: `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_986_191)">
<path d="M14.7608 0.599833H14.8724C17.5628 0.599833 20.0804 1.33543 22.2368 2.61583L22.1708 2.57863C24.416 3.89143 26.234 5.70943 27.5096 7.88503L27.5468 7.95463C28.7948 10.0774 29.5316 12.6298 29.5316 15.3538C29.5316 21.841 25.352 27.3538 19.5392 29.3434L19.4348 29.3746C19.3592 29.3986 19.2728 29.4118 19.184 29.4118C18.9896 29.4118 18.8096 29.347 18.6644 29.239L18.6668 29.2402C18.5132 29.1022 18.4172 28.903 18.4172 28.681C18.4172 28.675 18.4172 28.669 18.4172 28.6642V28.6654C18.4172 28.627 18.4204 28.1366 18.4268 27.1942C18.4332 26.2518 18.4364 25.3902 18.4364 24.6094C18.4448 24.5194 18.4496 24.4162 18.4496 24.3106C18.4496 23.3602 18.062 22.501 17.4368 21.8806C18.1784 21.8074 18.848 21.685 19.4984 21.5146L19.4072 21.535C20.0948 21.343 20.6948 21.0874 21.2516 20.7646L21.2144 20.785C21.824 20.449 22.34 20.0218 22.7648 19.5154L22.772 19.507C23.2184 18.9358 23.5676 18.2638 23.78 17.533L23.7908 17.491C24.0416 16.6714 24.1856 15.7294 24.1856 14.7538C24.1856 14.6998 24.1856 14.6446 24.1844 14.5906V14.599C24.1844 14.5726 24.1856 14.5426 24.1856 14.5126C24.1856 13.015 23.6072 11.653 22.6628 10.6366L22.6664 10.6402C22.868 10.1122 22.9844 9.50263 22.9844 8.86543C22.9844 8.08663 22.8104 7.34983 22.4996 6.68863L22.5128 6.71983C22.3748 6.69343 22.2176 6.67783 22.0556 6.67783C21.6548 6.67783 21.2768 6.77143 20.9408 6.93703L20.9552 6.93103C20.2736 7.18303 19.6904 7.46863 19.1408 7.80223L19.1864 7.77583L18.4556 8.23663C17.3492 7.91983 16.0784 7.73743 14.7656 7.73743C13.4528 7.73743 12.182 7.91983 10.9772 8.26063L11.0744 8.23663C10.8696 8.09583 10.5972 7.92263 10.2572 7.71703C9.80964 7.46023 9.28044 7.21183 8.73084 7.00303L8.65164 6.97663C8.30004 6.79183 7.88364 6.68383 7.44084 6.68383C7.29204 6.68383 7.14564 6.69583 7.00404 6.71983L7.01964 6.71743C6.72204 7.34623 6.54804 8.08423 6.54804 8.86303C6.54804 9.50023 6.66444 10.111 6.87804 10.6738L6.86604 10.639C5.92404 11.6518 5.34684 13.0138 5.34684 14.5114C5.34684 14.5414 5.34684 14.5726 5.34804 14.6026V14.5978C5.34684 14.6446 5.34684 14.6986 5.34684 14.7538C5.34684 15.7246 5.49084 16.663 5.75964 17.5462L5.74164 17.4778C5.96844 18.2494 6.31284 18.9202 6.76164 19.5094L6.75084 19.4938C7.17564 20.0158 7.68924 20.4454 8.27124 20.7682L8.29764 20.7814C8.81604 21.0838 9.41724 21.3394 10.0496 21.5182L10.1048 21.5314C10.664 21.6814 11.3336 21.8038 12.0188 21.8722L12.074 21.877C11.5568 22.3906 11.2124 23.077 11.1332 23.8426L11.132 23.857C10.8836 23.9782 10.5944 24.0766 10.2932 24.1402L10.268 24.145C9.96084 24.2062 9.60924 24.241 9.24804 24.241C9.22164 24.241 9.19524 24.241 9.16884 24.241H9.17244C8.69964 24.2314 8.26524 24.0778 7.90644 23.8234L7.91364 23.8282C7.46844 23.5174 7.10844 23.1142 6.85644 22.645L6.84804 22.627C6.61044 22.2238 6.29724 21.8902 5.92644 21.6346L5.91564 21.6274C5.64564 21.4246 5.32764 21.2662 4.98444 21.1714L4.96524 21.1666L4.58124 21.109C4.55364 21.1066 4.52124 21.1054 4.48884 21.1054C4.32084 21.1054 4.16124 21.139 4.01604 21.1978L4.02444 21.1942C3.92204 21.2518 3.89004 21.3254 3.92844 21.415C3.97524 21.5182 4.03284 21.607 4.10244 21.685L4.10124 21.6838C4.17444 21.7702 4.25724 21.8458 4.34724 21.9118L4.35084 21.9142L4.48524 22.0102C4.82484 22.1878 5.10444 22.435 5.31684 22.7338L5.32164 22.741C5.55084 23.0254 5.75244 23.347 5.91444 23.6914L5.92644 23.7202L6.11844 24.1618C6.28044 24.6442 6.57444 25.0474 6.95844 25.339L6.96444 25.3438C7.32444 25.6246 7.75884 25.8262 8.23284 25.9174L8.25204 25.9198C8.64804 25.9966 9.10884 26.0446 9.57924 26.0542H9.58764C9.64164 26.0566 9.70404 26.0566 9.76764 26.0566C10.0808 26.0566 10.388 26.0314 10.688 25.9822L10.6556 25.987L11.0972 25.9102C11.0972 26.3974 11.1004 26.9646 11.1068 27.6118C11.1132 28.259 11.1164 28.6082 11.1164 28.6594V28.6762C11.1164 28.8982 11.0204 29.0974 10.8668 29.2354C10.724 29.3422 10.544 29.407 10.3484 29.407C10.2584 29.407 10.172 29.3938 10.0916 29.3686L10.0976 29.3698C4.18284 27.343 0.00683594 21.8302 0.00683594 15.3418C0.00683594 12.6202 0.741236 10.0702 2.02404 7.87903L1.98564 7.94863C3.29844 5.70343 5.11644 3.88543 7.29204 2.60983L7.36164 2.57263C9.44844 1.33183 11.9636 0.598633 14.6492 0.598633H14.7668H14.7608V0.599833ZM5.59284 21.799C5.63124 21.7094 5.58644 21.6326 5.45844 21.5686C5.33044 21.5302 5.24724 21.543 5.20884 21.607C5.17044 21.6966 5.21524 21.7734 5.34324 21.8374C5.45844 21.9142 5.54164 21.9014 5.59284 21.799ZM6.18924 22.453C6.27884 22.389 6.26604 22.2866 6.15084 22.1458C6.02284 22.0306 5.92044 22.0114 5.84364 22.0882C5.75404 22.1522 5.76684 22.2546 5.88204 22.3954C6.00924 22.521 6.11164 22.5398 6.18924 22.4518V22.453ZM6.76524 23.317C6.88044 23.2274 6.88044 23.1058 6.76524 22.9522C6.66284 22.7858 6.55404 22.7474 6.43884 22.837C6.32364 22.901 6.32364 23.0162 6.43884 23.1826C6.55404 23.349 6.66284 23.3938 6.76524 23.317ZM7.57164 24.1246C7.67404 24.0222 7.64844 23.9006 7.49484 23.7598C7.34124 23.6062 7.21324 23.587 7.11084 23.7022C6.99564 23.8046 7.02124 23.9262 7.18764 24.067C7.34124 24.2206 7.46924 24.2382 7.57164 24.1198V24.1246ZM8.66724 24.6046C8.70564 24.4638 8.62244 24.3614 8.41764 24.2974C8.22564 24.2462 8.10404 24.291 8.05284 24.4318C8.00164 24.5726 8.08484 24.6686 8.30244 24.7198C8.49444 24.7974 8.61604 24.759 8.66724 24.6046ZM9.87804 24.7006C9.87804 24.5342 9.76924 24.4638 9.55164 24.4894C9.34684 24.4894 9.24444 24.5598 9.24444 24.7006C9.24444 24.867 9.35324 24.9374 9.57084 24.9118C9.77564 24.9126 9.87804 24.8414 9.87804 24.7006ZM10.9928 24.5086C10.9672 24.3678 10.852 24.3102 10.6472 24.3358C10.4424 24.3742 10.3528 24.4702 10.3784 24.6238C10.404 24.7774 10.5192 24.8286 10.724 24.7774C10.9288 24.7262 11.0176 24.6366 10.9928 24.5086Z" fill="#37E8CE"/>
</g>
<defs>
<clipPath id="clip0_986_191">
<rect width="30" height="30" fill="white"/>
</clipPath>
</defs>
</svg>
`,
  },
];

const designPhotos = [
  "/img/des/01/1.jpg",
  "/img/des/01/2.jpg",
  "/img/des/01/3.jpg",
  "/img/des/01/4.jpg",
  "/img/des/01/5.jpg",
  "/img/des/01/6.jpg",
  "/img/des/01/7.jpg",
  "/img/des/01/8.jpg",
  "/img/des/01/9.jpg",
  "/img/des/01/10.jpg",
  "/img/des/01/11.jpg",
  "/img/des/01/12.jpg",
  "/img/des/01/13.jpg",
  "/img/des/01/14.jpg",
];

const leftPhotos = designPhotos.slice(0, 7);
const rightPhotos = designPhotos.slice(7);

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
    name: "Mini fridge",
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
    name: "Mini fridge",
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
    url: "",
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
    url: "",
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
    url: "plan/open-contribute/ethereum-website-pr",
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

const vulnData = [
  {
    platform: "HackerOne",
    id: "¥200 USD",
    time: "2023",
    url: "/sec/github-misconfiguration",
    name: "CWE-16 Vulnerability Report",
    post: "GIHUB",
  },
  {
    platform: "CNVD",
    id: "CNVD-2021-24498",
    time: "2021",
    url: "/sec/edrawmax",
    name: "CWE-840 Business Logic",
    post: "EDRAW SOFTWARE",
  },
  {
    platform: "CNNVD",
    id: "OWASP Top 10",
    time: "2020",
    url: "/sec/tcmedical",
    name: "CWE-79 Reflected XSS",
    post: "TOPCHOICE MEDICAL",
  },
  {
    platform: "CNNVD",
    id: "OWASP Top 10",
    time: "2020",
    url: "/sec/yadugroup",
    name: "CWE-79 Reflected XSS",
    post: "YADU MEDICAL",
  },
  {
    platform: "CNVD",
    id: "CNVD-2020-10601",
    time: "2020",
    url: "/sec/iptv",
    name: "CWE-840 Business Logic",
    post: "CHINA TELECOM IPTV",
  },
  {
    platform: "CNVD",
    id: "CNVD-2020-02799",
    time: "2020",
    url: "/sec/turing",
    name: "CWE-840 Business Logic and CWE-285",
    post: "TURING ROBOT",
  },
  {
    platform: "CNNVD",
    id: "OWASP Top 10",
    time: "2019",
    url: "/sec/ycrenfu",
    name: "CWE-89 SQL Injection",
    post: "HUMANWELL",
  },
];

const sections = [
  {
    title: "Proof of My Existence",
    desc: "Some of those people dont't do a lot\nThere's a lot of people who make small,small changes.",
    showTable: true,
    tableData: contribution,
  },
  {
    title: "I like network security<br>CVE count: 0.",
    desc: "I hope my first CVE will be related to Windows, Linux/macOS, or even a programming language such as Rust or Python, rather than various frameworks or applications.",
    showTable: true,
    tableData: vulnData,
  },
  {
    title: "I am a designer<br>but I build it",
    desc: "My friends and colleagues? Almost all know me through design, not code (honestly, my coding is pretty average).",
    showUser: true,
  },
];

onMounted(() => {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".scroll-section.s3",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })
    .to(".col-left", { y: -150, ease: "none" }, 0)
    .to(".col-right", { y: 150, ease: "none" }, 0)
    .from(
      ".design-item",
      {
        filter: "grayscale(1) brightness(0.5)",
        stagger: 0.05,
        duration: 1,
      },
      0,
    );

  const cards = gsap.utils.toArray(".vuln-card");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".scroll-section.s2",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      },
    })
    .from(cards, {
      y: 400,
      rotation: (i) => (i % 2 === 0 ? -10 : 10),
      opacity: 0,
      stagger: 0.2,
      scale: 0.8,
      ease: "power2.out",
    });
  gsap.to(progressBar.value, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  gsap.to(progressCircle.value, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  sectionRefs.value.forEach((el, i) => {
    const hasTable = el.classList.contains("has-table");

    ScrollTrigger.create({
      trigger: el,

      start:
        window.innerWidth < 1024
          ? hasTable
            ? "top 85%"
            : "top 80%"
          : "top 70%",
      end: "bottom 20%",
      onToggle: (self) => {
        if (self.isActive) activeSection.value = i + 1;
      },
      onEnter: () => animateInSection(el),
      onLeave: () => animateOutSection(el, -40),
      onEnterBack: () => animateInSection(el),
      onLeaveBack: () => animateOutSection(el, 40),
    });
  });
});

const animateInSection = (parentEl) => {
  const targets = parentEl.querySelectorAll(
    ".focus-text, .description, .table-wrapper, .mobile-table-hint, .vuln-card",
  );

  gsap.to(targets, {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power2.out",
    overwrite: true,
  });
};

const animateOutSection = (parentEl, yDist) => {
  const targets = parentEl.querySelectorAll(
    ".focus-text, .description, .table-wrapper, .design-item",
  );

  gsap.to(targets, {
    opacity: 0,
    filter: "blur(12px)",
    y: yDist,
    duration: 0.8,
    ease: "power2.in",
    overwrite: true,
  });
};

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
.app-wrapper {
  --bg: #080808;
  --text-muted: #444;
  --text-primary: #e5e5e5;
  --accent: #38e7cd;
  --section-shadow: 0 -50px 100px #0098811c;

  background-color: var(--bg);
  color: var(--text-primary);

  font-family: "Manrope", sans-serif;
  overflow-x: hidden;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

@media (prefers-color-scheme: light) {
  :root:not(.dark-mode) .app-wrapper {
    --bg: #ffffff;
    --text-muted: #999;
    --text-primary: #1a1a1a;
    --section-shadow: 0 -50px 100px rgba(0, 0, 0, 0.1);
  }
}

.light-mode .app-wrapper {
  --bg: #ffffff;
  --text-muted: #999;
  --text-primary: #1a1a1a;
  --section-shadow: 0 -50px 100px rgba(0, 0, 0, 0.1);
}

.sticky-visual {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  display: grid;
  place-items: center;

  z-index: 50;
  pointer-events: none;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.shape-container {
  position: absolute;
  width: 100%;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(40px) scale(0.9);
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.shape-container.is-active {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.content {
  width: 50%;
  padding-bottom: 20vh;
  position: relative;
  z-index: 20;
}

header {
  height: 90vh;
  display: flex;
  align-items: center;
  padding-left: 10vw;
}

.scroll-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10vw;
  padding-right: 5vw;
  position: relative;
  z-index: 1;
  box-shadow: var(--section-shadow);
}

h1 {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
}
.title-large {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
  display: block;
  margin-top: 1rem;
}

.focus-text {
  font-size: 3.5rem;
  font-weight: 600;
  color: var(--text-light);
  opacity: 0;
  filter: blur(12px);
  transform: translateY(40px);
}

.description {
  font-size: 1.1rem;
  color: #a7a7a7b0;
  margin-top: 1.5rem;
  border-left: 2px solid var(--accent);
  padding-left: 1.5rem;
  opacity: 0;
  filter: blur(12px);
}

.desktop-progress {
  position: absolute;
  left: -1px;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent);
  transform-origin: top;
  transform: scaleY(0);
}

.progress-circle {
  fill: none;
  stroke: var(--accent);
  stroke-width: 8;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.track-circle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 8;
}

.grid-lines {
  width: 300px;
  height: 300px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}
.grid-box {
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.mobile-table-hint {
  display: none;
}

@media (max-width: 1024px) {
  .sticky-visual {
    width: 100%;
    right: auto;
    left: 0;
    border-left: none;

    opacity: 2;
    display: flex;
    justify-content: center;
    align-items: center;

    mix-blend-mode: screen;
  }

  .scroll-section.s2 {
    background: transparent !important;
    box-shadow: none !important;
  }

  .shape-container {
    transform: scale(0.7) translateY(40px);
    width: 100%;
    left: 0;
    right: 0;
    margin: 0 auto;
  }

  .shape-container.is-active {
    transform: scale(0.8) translateY(0);
  }

  .content {
    width: 100%;
  }

  header {
    padding-left: 5vw;
    height: 100vh;
  }

  .scroll-section {
    padding-left: 5vw;
    padding-right: 5vw;
    height: 100vh;
    justify-content: center;
  }

  .title-large {
    font-size: 3rem;
  }

  .focus-text {
    font-size: 2.2rem;
    max-width: 100%;
  }

  .description {
    font-size: 1rem;
    max-width: 90%;
  }
}

.closing-section {
  height: 60vh;
  display: flex;
  align-items: center;
  padding-left: 10vw;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 10vh;
}

.closer {
  font-size: 1.2rem;
  font-weight: 300;
  color: var(--text-muted);
}
.closer strong {
  display: block;
  font-size: 2rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.large-span {
  font-size: 15px;
  color: var(--text-muted);
  display: block;
  width: 80%;
  margin-top: 20px;
}

.table-wrapper {
  margin-top: 2rem;
  width: 100%;
  max-width: 900px;

  max-height: 70vh;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
  overflow: hidden;
}

.table-inner-scroll {
  overflow-y: auto;
  padding-right: 10px;
}

.table-inner-scroll::-webkit-scrollbar {
  width: 4px;
}
.table-inner-scroll::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 10px;
}

@media (max-width: 1024px) {
  .scroll-section.has-table {
    height: 100vh;
    height: 100dvh;
    justify-content: flex-start;
    padding-top: 15vh;
  }

  .table-wrapper {
    margin-top: 1.5rem;

    max-height: 45vh;
    display: flex;
    flex-direction: column;
  }

  .table-inner-scroll {
    overflow-y: auto;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 20px;

    mask-image: linear-gradient(
      to bottom,
      black 0%,
      black 85%,
      transparent 100%
    );
  }

  .table-inner-scroll::-webkit-scrollbar {
    display: none;
  }

  .mobile-table-hint {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    font-size: 0.7rem;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.8;
  }

  .hint-line {
    height: 1px;
    flex-grow: 1;
    background: var(--accent);
    transform-origin: left;
    animation: line-grow 2s infinite;
  }
}

@keyframes line-grow {
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  50% {
    transform: scaleX(1);
    opacity: 1;
  }
  100% {
    transform: scaleX(0);
    opacity: 0;
    transform-origin: right;
  }
}

.ring-base,
.ring-accent,
.ring-light {
  fill: none;
  stroke-linecap: round;
}

.ring-base {
  stroke: var(--text-muted);
  stroke-width: 1;
  opacity: 0.3;
}

.ring-accent {
  stroke: var(--accent);
  stroke-width: 2;

  transform-origin: 150px 150px;
  animation: rotate-cw 20s linear infinite;
}

.ring-light {
  stroke: var(--text-light);
  stroke-width: 1.5;
  opacity: 0.6;
  transform-origin: 150px 150px;

  animation: rotate-ccw 35s linear infinite;
}

@keyframes rotate-cw {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotate-ccw {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.vuln-cards-wrapper {
  position: relative;
  width: 320px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vuln-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  backface-visibility: hidden;
}

.card-tag {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent);
  font-weight: 700;
}

.card-id {
  font-size: 1.4rem;
  font-weight: 300;
  margin: 0.5rem 0;
  color: #ebebeb;
}

.card-desc {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

.vuln-card:nth-child(1) {
  transform: translate(0, 0) rotate(-2deg);
}
.vuln-card:nth-child(2) {
  transform: translate(10px, 10px) rotate(1deg);
}
.vuln-card:nth-child(3) {
  transform: translate(-5px, 20px) rotate(-1deg);
}
.vuln-card:nth-child(4) {
  transform: translate(5px, 30px) rotate(2deg);
}

@media (max-width: 768px) {
  .vuln-cards-wrapper {
    width: 100%;
    transform: scale(0.8);
  }
}

.design-grid-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.design-columns {
  flex-direction: row-reverse;
  display: flex;
  gap: 1.5vw;
  width: 95vw;
  z-index: 2;
}

.design-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
  flex-wrap: wrap;
}

.col-left {
  padding-top: 10vh;
}

.col-right {
  padding-bottom: 10vh;
}

.design-item {
  width: 100%;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow: hidden;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.design-item img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;

  transform: scale(1.05);
  transition:
    transform 0.8s ease,
    filter 0.8s ease;
}

.design-item:hover img {
  transform: scale(1);
  filter: brightness(1.2);
}

@media (max-width: 1024px) {
  .design-columns {
    width: 100vw;
    gap: 10px;
  }

  .design-col {
    gap: 10px;
  }
}

.behance-card {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-light);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid rgb(174 174 174 / 37%);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.behance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 55, 255, 0.12);
  border-color: rgba(0, 87, 255, 0.2);
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.behance-icon {
  width: 28px;
  height: 28px;
  color: #1769ff;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: rgb(174 174 174 / 37%);
  margin: 0 16px;
}

.meta-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.3;
}

.username {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.stats {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.stats strong {
  color: #1769ff;
  font-weight: 700;
}

.userinfo {
  display: flex;
  gap: 19px;
  flex-direction: column;
}

.end-line {
  width: 2px;
  height: 300px;
  background: var(--text-light);
  position: relative;
}
.end-line::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 1px;
  background: var(--text-light);
}

.organic-breath {
  overflow: visible;
}

.core-point {
  fill: var(--accent);
  filter: drop-shadow(0 0 10px var(--accent));
  opacity: 0.9;
}

.ring-breath {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  opacity: 0.3;

  transform-origin: center;

  animation: deep-breath 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.ring-influence {
  fill: none;
  stroke: var(--text-muted);
  stroke-width: 1;
  opacity: 0.15;
  stroke-linecap: round;

  transform-origin: center;

  animation: subtle-drift 12s ease-in-out infinite alternate;
}

@keyframes deep-breath {
  0% {
    transform: scale(0.9);
    stroke-width: 1px;
    opacity: 0.2;
  }
  50% {
    transform: scale(1.05);
    stroke-width: 2px;
    opacity: 0.6;
  }
  100% {
    transform: scale(0.9);
    stroke-width: 1px;
    opacity: 0.2;
  }
}

@keyframes subtle-drift {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 0.15;
  }
  100% {
    transform: scale(0.98) rotate(15deg);
    opacity: 0.3;
  }
}
</style>
