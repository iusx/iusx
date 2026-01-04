<template>
  <div class="mane-container" ref="main">
    <div class="mobile-progress">
      <svg viewBox="0 0 100 100">
        <circle class="track-circle" cx="50" cy="50" r="40" />
        <circle
          ref="mobileProgress"
          class="progress-circle"
          cx="50"
          cy="50"
          r="40"
        />
      </svg>
    </div>

    <div class="sticky-visual">
      <div ref="desktopProgress" class="desktop-progress"></div>

      <div
        v-for="(shape, index) in 6"
        :key="index"
        :class="['shape-container', `shape-${index + 1}`]"
        ref="shapes"
      >
        <div v-if="index === 0" class="circle-outline"></div>
        <div v-if="index === 1" class="stone-block"></div>
        <div v-if="index === 2" class="grid-lines">
          <div class="grid-box" v-for="n in 4" :key="n"></div>
        </div>
        <div v-if="index === 3" class="balance">
          <div class="b-circle b-1"></div>
          <div class="b-circle b-2"></div>
        </div>
        <div v-if="index === 4" class="light-orb"></div>
        <div v-if="index === 5" class="end-line"></div>
      </div>
    </div>

    <div class="content">
      <header>
        <div>
          <h1>MÅNE Studio</h1>
          <span class="title-large">Architecture<br />of Silence.</span>
        </div>
      </header>

      <section
        v-for="(section, i) in sections"
        :key="i"
        class="scroll-section"
        ref="sectionElements"
      >
        <p class="focus-text">{{ section.focus }}</p>
        <p class="description">{{ section.desc }}</p>
      </section>

      <div class="closing-section">
        <div class="closer">
          <strong>Start the conversation.</strong>
          hello@manestudio.com<br />
          Copenhagen / Tokyo / New York
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const main = ref(null);
const shapes = ref([]);
const sectionElements = ref([]);
const desktopProgress = ref(null);
const mobileProgress = ref(null);

const sections = [
  {
    focus: "We don't just fill space. We shape the void.",
    desc: "True luxury is the absence of noise. Our design philosophy centers on negative space as the primary material of construction.",
  },
  {
    focus: "Honest materials that age, but never break.",
    desc: "Raw oak. Brushed steel. Travertine stone. We select materials that develop a patina, telling the story of their use over decades.",
  },
  {
    focus: "Rigorous structure. Fluid living.",
    desc: "The grid is our foundation, but life is organic. We create systems that bring order to chaos without constraining the human spirit.",
  },
  {
    focus: "Objects that don't scream for attention.",
    desc: "In a world of constant demand, we create calm. Furniture and spaces that exist with quiet confidence and absolute purpose.",
  },
  {
    focus: "Light as the fourth dimension.",
    desc: "We sculpt light like a physical material. It guides the eye, reveals texture, and marks the passage of time throughout the day.",
  },
  {
    focus: "Sustainability is not a feature.",
    desc: "It is the default. We build for permanence. The most sustainable building is the one that never needs to be torn down.",
  },
];

onMounted(() => {
  let ctx = gsap.context(() => {
    // 1. Global Progress Bar (Desktop & Mobile)
    gsap.to(desktopProgress.value, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        scrub: 0.3,
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
      },
    });

    gsap.to(mobileProgress.value, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        scrub: 0.3,
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
      },
    });

    // 2. Section Text Focus & Shape Transitions
    sectionElements.value.forEach((section, index) => {
      const focusText = section.querySelector(".focus-text");
      const descText = section.querySelector(".description");
      const targetShape = shapes.value[index];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play reverse play reverse",
          // Use scrub: true if you want it strictly tied to scroll position
        },
      });

      // Animate Text
      tl.fromTo(
        [focusText, descText],
        { filter: "blur(12px)", opacity: 0, y: 40, scale: 0.9 },
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        },
      );

      // Animate Shape
      gsap.fromTo(
        targetShape,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "top 30%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    });
  }, main.value);
});

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
</script>

<style scoped>
/* Base Styles */
.mane-container {
  --bg: #080808;
  --text-muted: #444;
  --text-light: #e5e5e5;
  --accent: #d4c5a3;
  background: var(--bg);
  color: var(--text-light);
  font-family: "Manrope", sans-serif;
  min-height: 100vh;
}

.sticky-visual {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  display: grid;
  place-items: center;
  z-index: 10;
  pointer-events: none;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}

.shape-container {
  position: absolute;
  width: 400px;
  height: 400px;
  display: grid;
  place-items: center;
  opacity: 0; /* Managed by GSAP */
}

.content {
  width: 50%;
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10vw;
  padding-right: 2rem;
}

/* Typography */
h1 {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 300;
  color: var(--accent);
}
.title-large {
  font-size: 5rem;
  font-weight: 800;
  line-height: 1;
}
.focus-text {
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.1;
  color: var(--text-muted);
  max-width: 500px;
}
.description {
  font-size: 1.1rem;
  color: #666;
  margin-top: 1.5rem;
  max-width: 420px;
  border-left: 2px solid var(--accent);
  padding-left: 1.5rem;
}

/* Shape CSS (Remains largely the same) */
.circle-outline {
  width: 300px;
  height: 300px;
  border: 2px solid var(--text-light);
  border-radius: 50%;
}
.stone-block {
  width: 250px;
  height: 350px;
  background: linear-gradient(135deg, #333, #111);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.stone-block::after {
  content: "";
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
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
.balance {
  width: 300px;
  height: 300px;
  position: relative;
}
.b-circle {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  mix-blend-mode: exclusion;
}
.b-1 {
  background: #fff;
  top: 20%;
  left: 20%;
}
.b-2 {
  background: #666;
  bottom: 20%;
  right: 20%;
}
.light-orb {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    var(--accent),
    transparent 60%
  );
  filter: blur(40px);
  opacity: 0.6;
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

/* Progress */
.desktop-progress {
  position: absolute;
  left: -1px;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--accent);
  transform-origin: top;
  transform: scaleY(0);
  z-index: 20;
}
.mobile-progress {
  display: none;
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  padding: 5px;
  backdrop-filter: blur(10px);
}
.progress-circle {
  fill: none;
  stroke: var(--accent);
  stroke-width: 8;
  stroke-dasharray: 251.2;
  stroke-dashoffset: 251.2;
}
.track-circle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 8;
}
.closing-section {
  height: 60vh;
  display: flex;
  align-items: center;
  padding-left: 10vw;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .sticky-visual {
    opacity: 0.1;
    width: 100%;
    z-index: -1;
  }
  .content {
    width: 100%;
  }
  .mobile-progress {
    display: block;
  }
}
</style>
