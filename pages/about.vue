<template>
  <div class="page-container">
    <div class="main-wrapper">

      <div class="left-pane">
        <div class="text-content">
          <h1 class="main-title">
            <span class="text-light">Visual Instincts.</span><br />
            <span class="text-dark">Pragmatic Execution.</span>
          </h1>
          <p class="description">
            Zero professional background. Everyone knows me for design, not
            code. I just write enough average code to implement my ideas and
            force the system to render the exact effects I want.
          </p>
        </div>

        <div class="premium-index-list">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            class="index-row"
            :class="{ active: activeTag === link.radarId }"
            @mouseenter="handleTagHover(link.radarId)"
          >
            <div class="active-indicator"></div>
            <div class="row-left">
              <span class="num">{{ link.num }}</span>
              <span class="name">{{ link.name }}</span>
            </div>
            <div class="row-right">
              <span class="meta">{{ link.meta }}</span>
              <span class="arrow">↗</span>
            </div>
          </a>
        </div>

        <div class="action-footer">
          <a href="mailto:rhyme.qing@gmail.com" class="sleek-btn">
            <div class="btn-content">
              <span class="status-glow"></span>
              <span class="btn-text">LINKE ME</span>
            </div>
            <div class="btn-line"></div>
          </a>
        </div>
      </div>

      <div class="right-pane">
        <div class="dark-card">
          <header class="card-header">
            <h2>Capability Matrix</h2>
            <p>
              A visual map of how I spend my time: designing the interface,
              aggressively Googling how to build it, and researching
              Windows/macOS security while waiting for my first CVE.
            </p>
          </header>

          <div class="chart-container">
            <svg
              class="radar-chart"
              viewBox="0 0 300 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="cyanGlow"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="#38e7cd" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.2" />
                </linearGradient>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="bgHalo" cx="150" cy="100" r="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#38e7cd" stop-opacity="0.08" />
                  <stop offset="100%" stop-color="#38e7cd" stop-opacity="0" />
                </radialGradient>
              </defs>

              <circle cx="150" cy="100" r="70" fill="url(#bgHalo)" />

              <g class="wireframe" :stroke="wireframeColor" stroke-width="1" fill="none">
                <line x1="150" y1="30" x2="50" y2="150" />
                <line x1="150" y1="30" x2="250" y2="150" />
                <line x1="50" y1="150" x2="250" y2="150" />
                <line x1="150" y1="30" x2="150" y2="130" stroke-dasharray="3 3" opacity="0.6" />
                <line x1="50" y1="150" x2="150" y2="130" stroke-dasharray="3 3" opacity="0.6" />
                <line x1="250" y1="150" x2="150" y2="130" stroke-dasharray="3 3" opacity="0.6" />
                <line x1="100" y1="90" x2="200" y2="90" :stroke="wireframeDim" stroke-dasharray="2 4" opacity="0.4" />
                <line x1="120" y1="120" x2="180" y2="120" :stroke="wireframeDim" stroke-dasharray="2 4" opacity="0.4" />
              </g>

              <polygon
                points="150,40 110,138 225,145"
                fill="url(#cyanGlow)"
                stroke="#38e7cd"
                stroke-width="1.2"
                opacity="0.5"
              />

              <circle
                cx="150"
                cy="40"
                :r="activeTag === 'Design' ? 6 : 4"
                :fill="activeTag === 'Design' ? '#ffffff' : '#38e7cd'"
                class="data-point"
                filter="url(#softGlow)"
              />
              <circle
                cx="110"
                cy="138"
                :r="activeTag === 'Security' ? 6 : 4"
                :fill="activeTag === 'Security' ? '#ffffff' : '#38e7cd'"
                class="data-point"
                filter="url(#softGlow)"
              />
              <circle
                cx="225"
                cy="145"
                :r="activeTag === 'Development' ? 6 : 4"
                :fill="activeTag === 'Development' ? '#ffffff' : '#38e7cd'"
                class="data-point"
                filter="url(#softGlow)"
              />

              <circle cx="150" cy="40" r="10" stroke="#38e7cd" stroke-width="0.4" fill="none" opacity="0.2" />
              <circle cx="110" cy="138" r="10" stroke="#38e7cd" stroke-width="0.4" fill="none" opacity="0.2" />
              <circle cx="225" cy="145" r="10" stroke="#38e7cd" stroke-width="0.4" fill="none" opacity="0.2" />
            </svg>

            <div class="chart-labels">
              <span class="label top" :class="{ active: activeTag === 'Design' }">Design</span>
              <span class="label left" :class="{ active: activeTag === 'Security' }">Security</span>
              <span class="label right" :class="{ active: activeTag === 'Development' }">Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const socialLinks = [
  {
    num: "01",
    name: "Behance",
    meta: "DESIGN_ARCHIVE",
    url: "https://www.behance.net/1ui",
    radarId: "Design",
  },
  {
    num: "02",
    name: "GitHub",
    meta: "SOURCE_CODE",
    url: "https://github.com/iusx",
    radarId: "Development",
  },
  {
    num: "03",
    name: "Steam",
    meta: "GAEM_LOG",
    url: "https://steamcommunity.com/id/wvw_wvw/",
    radarId: "Security",
  },
];

const activeTag = ref<string>(socialLinks[0].radarId);
const handleTagHover = (id: string) => {
  activeTag.value = id;
};

const wireframeColor = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--wireframe-main').trim() || '#333';
});
const wireframeDim = computed(() => {
  return getComputedStyle(document.documentElement).getPropertyValue('--wireframe-dim').trim() || '#222';
});
</script>

<style scoped lang="scss">

.page-container {
  --page-bg: #f4f5f7;
  --wrapper-bg: #ffffff;
  --left-pane-text: #0f172a;
  --left-pane-text-light: #94a3b8;
  --left-pane-text-secondary: #64748b;
  --border-subtle: #f1f5f9;
  --border-strong: #e2e8f0;
  --row-hover-bg: #f8fafc;
  --num-color: #cbd5e1;
  --meta-color: #94a3b8;
  --arrow-color: #cbd5e1;
  --arrow-hover: #0f172a;

  --dark-card-bg: #111111;
  --dark-card-text: #ffffff;
  --dark-card-text-secondary: #a1a1aa;
  --card-border: #333;
  --label-bg: rgba(17, 17, 17, 0.8);
  --label-text: #a1a1aa;
  --label-active-border: #38e7cd;

  --wireframe-main: #333;
  --wireframe-dim: #222;
  --accent: #38e7cd;

  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--page-bg);
  padding: 40px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  .page-container {
    --page-bg: #0a0a0a;
    --wrapper-bg: #1a1a1a;
    --left-pane-text: #ededed;
    --left-pane-text-light: #6b7280;
    --left-pane-text-secondary: #9ca3af;
    --border-subtle: #2a2a2a;
    --border-strong: #3a3a3a;
    --row-hover-bg: #222222;
    --num-color: #4b5563;
    --meta-color: #6b7280;
    --arrow-color: #4b5563;
    --arrow-hover: #ffffff;

    --dark-card-bg: #0c0c0c;
    --dark-card-text: #f0f0f0;
    --dark-card-text-secondary: #a0a0a0;
    --card-border: #2a2a2a;
    --label-bg: rgba(0, 0, 0, 0.7);
    --label-text: #b0b0b0;

    --wireframe-main: #555;
    --wireframe-dim: #333;
  }
}

.main-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1080px;
  background: var(--wrapper-bg);
  border-radius: 32px;
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  padding: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  @media (max-width: 900px) {
    flex-direction: column;
    padding: 8px;
  }
}

.left-pane {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    padding: 40px 24px;
  }

  @media (max-width: 600px) {
    padding: 32px 20px;
  }

  .text-content {
    margin-bottom: 60px;

    @media (max-width: 600px) {
      margin-bottom: 40px;
    }

    .main-title {
      font-size: 2.4rem;
      line-height: 1.15;
      margin: 0 0 20px 0;
      letter-spacing: -0.04em;

      @media (max-width: 600px) {
        font-size: 2rem;
      }

      .text-light {
        color: var(--left-pane-text-light);
        font-weight: 300;
      }
      .text-dark {
        color: var(--left-pane-text);
        font-weight: 700;
      }
    }

    .description {
      color: var(--left-pane-text-secondary);
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 90%;
      margin: 0;

      @media (max-width: 600px) {
        font-size: 0.95rem;
        max-width: 100%;
      }
    }
  }

  .premium-index-list {
    display: flex;
    flex-direction: column;
    margin-bottom: auto;
    border-top: 1px solid var(--border-subtle);
  }

  .index-row {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    border-bottom: 1px solid var(--border-subtle);
    text-decoration: none;
    color: var(--left-pane-text);
    transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;

    @media (max-width: 600px) {
      padding: 18px 0;
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, var(--row-hover-bg) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 0;
    }

    .active-indicator {
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%) scaleY(0);
      width: 2px;
      height: 60%;
      background: var(--accent);
      box-shadow: 0 0 10px rgba(56, 231, 205, 0.6);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 2px;
    }

    .row-left,
    .row-right {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .row-left {
      gap: 24px;

      @media (max-width: 600px) {
        gap: 16px;
      }

      .num {
        font-family: "JetBrains Mono", "Fira Code", monospace;
        font-size: 0.8rem;
        color: var(--num-color);
        font-weight: 500;
        transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .name {
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.02em;

        @media (max-width: 600px) {
          font-size: 1.1rem;
        }
      }
    }

    .row-right {
      gap: 16px;

      .meta {
        font-family: "JetBrains Mono", "Fira Code", monospace;
        font-size: 0.75rem;
        color: var(--meta-color);
        letter-spacing: 0.05em;
        opacity: 0;
        transform: translateX(10px);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .arrow {
        color: var(--arrow-color);
        font-size: 1.2rem;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
    }

    &:hover,
    &.active {
      &::after {
        opacity: 1;
      }

      .active-indicator {
        left: 0;
        transform: translateY(-50%) scaleY(1);
      }

      .row-left {
        transform: translateX(16px);

        .num {
          color: var(--accent);
        }
      }

      .row-right {
        .meta {
          opacity: 1;
          transform: translateX(0);
        }
        .arrow {
          color: var(--arrow-hover);
          transform: translate(4px, -4px);
        }
      }
    }
  }

  .action-footer {
    margin-top: 60px;

    @media (max-width: 600px) {
      margin-top: 40px;
    }

    .sleek-btn {
      background: transparent;
      border: none;
      padding: 0;
      color: var(--left-pane-text);
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      flex-direction: column;
      gap: 8px;
      position: relative;

      .btn-content {
        display: flex;
        align-items: center;
        gap: 10px;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
          color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .status-glow {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--accent);
        box-shadow: 0 0 8px var(--accent);
        animation: pulse 2s infinite ease-in-out;
      }

      .btn-line {
        height: 2px;
        width: 100%;
        background: var(--border-strong);
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: var(--accent);
          transform: translateX(-101%);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      }

      &:hover {
        .btn-content {
          transform: translateY(-2px);
          color: var(--accent);
        }
        .btn-line::after {
          transform: translateX(0);
        }
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}

.right-pane {
  flex: 1.15;
  display: flex;

  .dark-card {
    background: var(--dark-card-bg);
    border-radius: 24px;
    width: 100%;
    padding: 50px;
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.2);
    color: var(--dark-card-text);
    position: relative;
    overflow: hidden;
    background-image: radial-gradient(circle at top right, #222 0%, #111 60%);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    @media (max-width: 900px) {
      padding: 32px;
      border-radius: 24px;
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 600px) {
      padding: 24px;
    }
  }

  .card-header {
    margin-bottom: 50px;
    z-index: 2;

    @media (max-width: 900px) {
      margin-bottom: 30px;
    }

    h2 {
      color: #fff;
      font-size: 1.6rem;
      font-weight: 600;
      margin: 0 0 16px 0;
      letter-spacing: -0.02em;

      @media (max-width: 600px) {
        font-size: 1.4rem;
      }
    }

    p {
      color: var(--dark-card-text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
      margin: 0;

      @media (max-width: 600px) {
        font-size: 0.85rem;
      }
    }
  }
}

.chart-container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -20px;

  .radar-chart {
    width: 100%;
    max-width: 360px;
    height: auto;
    overflow: visible;

    .wireframe line {
      stroke-linecap: round;
      transition: stroke 0.3s ease;
    }

    .data-point {
      transition: r 0.3s cubic-bezier(0.4, 0, 0.2, 1), fill 0.3s ease;
    }
  }

  .chart-labels {
    position: absolute;
    inset: 0;
    pointer-events: none;

    .label {
      position: absolute;
      font-size: 0.8rem;
      color: var(--label-text);
      background: var(--label-bg);
      padding: 4px 10px;
      border-radius: 100px;
      border: 1px solid var(--card-border);
      backdrop-filter: blur(4px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;

      @media (max-width: 600px) {
        font-size: 0.7rem;
        padding: 2px 8px;
      }

      &.active {
        color: #fff;
        border-color: var(--label-active-border);
        box-shadow: 0 0 12px rgba(56, 231, 205, 0.4);
        z-index: 10;
      }
    }

    .top {
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
      &.active {
        transform: translateX(-50%) scale(1.1);
      }
    }
    .left {
      bottom: 15%;
      left: -5%;
      @media (max-width: 600px) {
        left: 0%;
      }
      &.active {
        transform: scale(1.1);
      }
    }
    .right {
      bottom: 15%;
      right: -5%;
      @media (max-width: 600px) {
        right: 0%;
      }
      &.active {
        transform: scale(1.1);
      }
    }
  }
}
</style>
