<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const activeSection = ref(1);
const mainContainer = ref<HTMLElement | null>(null);
const horizontalTrack = ref<HTMLElement | null>(null);

const profileData = {
  intro: "A person with no education, no professional certificates, and not even any background. Focused on implementing functionality and achieving desired effects rather than pursuing perfection.",
  secGoal: "I hope my first CVE will be related to Windows, Linux/macOS, or a programming language such as Rust or Python.",
  career: "Full-Stack Software Engineer - 'Fringe Support And Analysis'"
};

const securityArchive = [
  { id: "#293802", year: "2023", target: "GITHUB", cwe: "CWE-16", desc: "Vulnerability Report", active: true },
  { id: "#293802", year: "2021", target: "EDRAW SOFTWARE", cwe: "CWE-840", desc: "Business Logic", active: false },
  { id: "#293802", year: "2020", target: "TOPCHOICE MEDICAL", cwe: "CWE-79", desc: "Reflected XSS", active: false },
  { id: "#293802", year: "2020", target: "YADU MEDICAL", cwe: "CWE-79", desc: "Reflected XSS", active: false },
  { id: "#293802", year: "2020", target: "CHINA TELECOM IPTV", cwe: "CWE-840", desc: "Business Logic", active: false },
  { id: "#293802", year: "2019", target: "HUMANWELL", cwe: "CWE-89", desc: "SQL Injection", active: false },
];

onMounted(() => {
  let mm = gsap.matchMedia();

  mm.add("(min-width: 1024px)", () => {
    if (!horizontalTrack.value || !mainContainer.value) return;

    const totalWidth = horizontalTrack.value.scrollWidth;
    const amountToScroll = totalWidth - (window.innerWidth / 2);

    gsap.to(horizontalTrack.value, {
      x: -amountToScroll,
      ease: "none",
      scrollTrigger: {
        trigger: mainContainer.value,
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });

    gsap.utils.toArray(".text-block").forEach((sec: any) => {
      gsap.from(sec, {
        opacity: 0,
        y: 50,
        scrollTrigger: {
          trigger: sec,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      });
    });
  });

  mm.add("(max-width: 1023px)", () => {

    gsap.from(".text-block", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    });
  });

  onUnmounted(() => {
    mm.revert(); 
  });
});
</script>

<template>
  <div ref="mainContainer" class="industrial-archive">
    <div class="scanline"></div>

    <div class="narrative-aside">
      <header class="aside-header">
        <div class="sys-info">:: IDENTITY_ARCHIVE</div>
        <div class="mode-toggle">DRIVERS [VEHICLE]</div>
      </header>

      <div class="text-flow">
        <div class="text-block">
          <h1 class="huge-title">IDENTITY<br><span class="dot-wrapper">SOURCE<span class="dot">.</span></span></h1>
          <p class="mono-desc">{{ profileData.intro }}</p>
        </div>

        <div class="text-block">
          <h2 class="sub-title">&#47;&#47; NETWORK_SECURITY</h2>
          <p class="mono-desc">CVE COUNT: 0. {{ profileData.secGoal }}</p>
        </div>

        <div class="text-block">
          <h2 class="sub-title">&#47;&#47; DESIGN_IDENTITY</h2>
          <p class="mono-desc">A designer who builds. Known by friends through design, not code. Coding is just average, but I implement effects.</p>
        </div>

        <div class="text-block">
          <div class="career-tag">2015 - NOW</div>
          <h3 class="corp-name">JIANGXUE ANALYSIS</h3>
          <p class="role-desc">{{ profileData.career }}</p>
        </div>
      </div>
    </div>

    <div class="monitor-viewport">
      <div class="live-axis desktop-only">
        <div class="live-label">LIVE</div>
        <div class="line"></div>
      </div>

      <div class="mobile-swipe-hint mobile-only">
        <span>SWIPE TO VIEW LOGS</span>
        <span class="arrow">→</span>
      </div>

      <div ref="horizontalTrack" class="data-track">
        <div 
          v-for="(item, index) in securityArchive" 
          :key="index" 
          class="archive-card"
          :class="{ active: item.active }"
        >
          <div class="card-meta">
            <span class="id-num">{{ item.id }}</span>
            <span class="arrow">{{ index % 2 === 0 ? '▶' : '◀' }}</span>
          </div>
          <div class="card-content">
            <div class="year">{{ item.year }}</div>
            <h3 class="target">{{ item.target }}</h3>
            <div class="cwe">{{ item.cwe }}</div>
            <p class="desc">{{ item.desc }}</p>
          </div>
          <div v-if="item.active" class="active-block"></div>
        </div>

        <div class="bottom-timeline desktop-only">
          <div v-for="n in 5" :key="n" class="timeline-row">
            <span class="row-dot"></span>
            <div class="row-track">
              <div class="segment" :style="{ left: n * 15 + '%' }">
                <div class="handle"></div>
                <div class="label">--- 30 ◀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

*, *::before, *::after {
  box-sizing: border-box;
}

$bg: #ffffff;
$text: #1a1a1a;
$accent: #ff5722; 
$mono: 'JetBrains Mono', 'Menlo', monospace;

.industrial-archive {
  display: flex;
  background-color: $bg;
  color: $text;
  font-family: $mono;
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
}

.desktop-only { display: block; }
.mobile-only { display: none; }

.narrative-aside {
  width: 45%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
  z-index: 10;
  background: $bg;
  position: relative;

  .aside-header {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 800;
    margin-bottom: 80px;
    .mode-toggle { border: 1px solid #000; padding: 2px 8px; }
  }

  .text-flow {
    flex: 1;
    overflow-y: auto;
    padding-right: 20px;
    &::-webkit-scrollbar { display: none; }
  }

  .text-block {
    margin-bottom: 120px;
    .huge-title {
      font-size: clamp(3rem, 6vw, 8rem);
      line-height: 0.85;
      font-weight: 900;
      letter-spacing: -0.05em;
      margin-bottom: 30px;
      word-break: break-word; 
      .dot { color: $accent; }
      .dot-wrapper { display: inline-block; }
    }
    .sub-title { font-size: 14px; font-weight: 800; margin-bottom: 20px; }
    .mono-desc { font-size: 14px; line-height: 1.6; color: #555; max-width: 400px; }
    .career-tag { font-size: 11px; background: #000; color: #fff; width: fit-content; padding: 2px 6px; margin-bottom: 10px; }
    .corp-name { font-size: 2rem; font-weight: 900; margin: 0; }
  }
}

.monitor-viewport {
  width: 55%;
  height: 100%;
  position: relative;
  background: #f9f9f9;
}

.live-axis {
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  transform: translateX(-50%);
  z-index: 100;
  pointer-events: none;
  .live-label { font-size: 12px; font-weight: 900; margin-top: 20px; margin-left: 10px; }
  .line { width: 2px; height: 100%; background: #000; }
}

.data-track {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 10vw; 
  position: relative;
}

.archive-card {
  min-width: 380px;
  height: 320px;
  background: #ebebeb;
  margin-right: 20px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  flex-shrink: 0;
  border: 1px solid transparent;

  &.active { background: #f0f0f0; border-color: #ddd; }

  .card-meta {
    display: flex; justify-content: space-between;
    .id-num { font-size: 40px; font-weight: 900; letter-spacing: -2px; }
    .arrow { font-size: 20px; }
  }

  .card-content {
    .year { font-size: 12px; font-weight: 800; }
    .target { font-size: 24px; font-weight: 900; margin: 5px 0; text-transform: uppercase; line-height: 1; }
    .cwe { font-size: 14px; color: $accent; font-weight: bold; }
    .desc { font-size: 11px; color: #888; margin-top: 10px; }
  }

  .active-block {
    position: absolute; inset: 0 0 0 auto;
    width: 110px; background: $accent;
  }
}

.bottom-timeline {
  position: absolute;
  bottom: 50px; left: 0; right: 0;
  display: flex; flex-direction: column; gap: 15px;
  opacity: 0.3;

  .timeline-row {
    display: flex; align-items: center; gap: 20px;
    padding-left: 40px;
    .row-dot { width: 6px; height: 6px; background: $accent; border-radius: 50%; }
    .row-track { flex: 1; height: 1px; background: #ddd; position: relative; }
    .segment {
      position: absolute; top: -10px; display: flex; align-items: center; gap: 10px;
      .handle { width: 30px; height: 2px; background: #000; position: relative;
        &::after { content: ''; position: absolute; right: -4px; top: -3px; width: 8px; height: 8px; background: #ccc; border-radius: 50%; }
      }
      .label { font-size: 9px; white-space: nowrap; }
    }
  }
}

.scanline {
  position: fixed; inset: 0; z-index: 999; pointer-events: none;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.03) 50%);
  background-size: 100% 4px;
}

@media (max-width: 1023px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: flex; }

  .industrial-archive {
    flex-direction: column;
    height: auto; 
    overflow-x: hidden; 
    width: 100vw;
  }

  .narrative-aside {
    width: 100%;
    height: auto;
    padding: 0; 
    border-right: none;

    .aside-header {
      position: sticky;
      top: 0;
      background: rgba($bg, 0.95);
      backdrop-filter: blur(8px);
      padding: 20px; 
      margin-bottom: 20px;
      z-index: 50;
      border-bottom: 1px solid #eee;
    }

    .text-flow {
      padding: 0 20px; 
      overflow: visible;
    }

    .text-block {
      margin-bottom: 60px;
      .huge-title { font-size: 3.2rem; margin-bottom: 20px; }
      .mono-desc { font-size: 13px; max-width: 100%; }
      .corp-name { font-size: 1.5rem; }
    }
  }

  .monitor-viewport {
    width: 100%;
    max-width: 100vw; 
    height: auto;
    background: #f4f4f4;
    padding: 40px 0 60px 0;
    border-top: 1px solid #ddd;
    overflow: hidden; 
  }

  .mobile-swipe-hint {
    padding: 0 20px;
    margin-bottom: 15px;
    font-size: 10px;
    color: $accent;
    font-weight: bold;
    justify-content: space-between;
    align-items: center;
    .arrow { animation: swipe-bounce 1.5s infinite; }
  }

  @keyframes swipe-bounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  }

  .data-track {
    width: 100%;
    padding: 0 20px 20px 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory; 
    -webkit-overflow-scrolling: touch;
    gap: 15px;
  }

  .archive-card {
    min-width: 85vw;
    max-width: 85vw; 
    height: 280px; 
    margin-right: 0;
    scroll-snap-align: center; 
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);

    .card-meta .id-num { font-size: 32px; }
    .card-content .target { font-size: 20px; }
    .active-block { width: 30px; }
  }
}
</style>
