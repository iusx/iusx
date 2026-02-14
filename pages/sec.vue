<script lang="ts" setup>
useSeoMeta({
  title: "Security | Vulnerability Reports",
  description: "Security research and vulnerability disclosure index.",
});

const { data: equalQuerySec } = await useAsyncData("equal", () => {
  return queryContent("sec/").find();
});

const sortedData = computed(() => {
  if (!equalQuerySec.value) return [];
  return [...equalQuerySec.value].sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
});
</script>

<template>
  <main class="sec-container">
    <div class="scanline"></div>

    <header class="sec-header">
      <div class="title-group">
        <h1 class="glitch-text" data-text="VULNERABILITY">VULNERABILITY</h1>
        <div class="subtitle">
          <span class="terminal-prefix">></span>
          <an-typing>REPORT_ARCHIVE_2024</an-typing>
        </div>
      </div>

      <div class="header-info">
        <p class="desc-text">

          Independent security research and ethical disclosure records.
        </p>
      </div>
    </header>

    <div class="content-grid">
      <div
        v-for="(sec, index) in sortedData"
        :key="sec._path"
        class="sec-card-wrapper"
      >
        <nuxt-link :to="sec._path" class="sec-card">
          <div class="card-id">
            #{{ (index + 1).toString().padStart(2, "0") }}
          </div>

          <div class="card-body">
            <div class="platform-box">
              <img
                :src="'/img/page/' + sec.platform + '.png'"
                :alt="sec.platform"
                class="platform-logo"
              />
              <span class="year-tag">{{ sec.time.slice(0, 4) }}</span>
            </div>
            <h3 class="card-title">{{ sec.title }}</h3>
          </div>

          <div class="card-footer">
            <span class="view-report">ACCESS_REPORT _</span>
            <div class="corner-decoration"></div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>

$bg-color: #0a0a0a;
$accent-color: #ef0000; 
$text-dim: #888;
$border-color: #222;
$font-mono: "JetBrains Mono", "Fira Code", monospace;

.sec-container {
  background-color: $bg-color;
  min-height: 100vh;
  padding: 4rem 2rem;
  font-family: $font-mono;
  color: #fff;
  position: relative;
  overflow-x: hidden;

  .scanline {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(
        90deg,
        rgba(255, 0, 0, 0.03),
        rgba(0, 255, 0, 0.01),
        rgba(0, 0, 255, 0.03)
      );
    background-size:
      100% 4px,
      3px 100%;
    pointer-events: none;
    z-index: 100;
  }
}

.sec-header {
  margin-bottom: 5rem;
  border-left: 4px solid $accent-color;
  padding-left: 1.5rem;

  .glitch-text {
    font-size: clamp(2rem, 8vw, 5rem);
    font-weight: 900;
    letter-spacing: -2px;
    margin: 0;
    line-height: 1;
    text-transform: uppercase;
  }

  .subtitle {
    color: $accent-color;
    font-size: 1.2rem;
    margin-top: 0.5rem;
    .terminal-prefix {
      margin-right: 0.5rem;
    }
  }

  .desc-text {
    margin-top: 2rem;
    color: $text-dim;
    font-size: 0.9rem;
    line-height: 1.6;
    .status-active {
      color: #00ff41;
      text-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
    }
  }
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1px; 
  background-color: $border-color;
  border: 1px solid $border-color;
}

.sec-card-wrapper {
  background-color: $bg-color;
  transition: all 0.3s ease;

  &:hover {
    background-color: #111;
    z-index: 2;
    transform: scale(1.02);
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }
}

.sec-card {
  display: flex;
  flex-direction: column;
  height: 280px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;

  .card-id {
    font-size: 0.8rem;
    color: $accent-color;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .card-body {
    flex-grow: 1;

    .platform-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .platform-logo {
        height: 14px;
        transition: filter 0.3s ease;
      }

      .year-tag {
        font-size: 0.8rem;
        background: #222;
        padding: 2px 6px;
      }
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.4;
      margin: 0;
      color: #ddd;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 1rem;

    .view-report {
      font-size: 0.75rem;
      letter-spacing: 1px;
      color: $text-dim;
    }

    .corner-decoration {
      width: 10px;
      height: 10px;
      border-right: 2px solid $accent-color;
      border-bottom: 2px solid $accent-color;
    }
  }

  &:hover {
    .platform-logo {
      filter: grayscale(0) brightness(1);
    }
    .card-title {
      color: #fff;
    }
    .view-report {
      color: $accent-color;
    }
  }
}

@media (max-width: 768px) {
  .sec-container {
    padding: 2rem 1rem;
  }
  .content-grid {
    grid-template-columns: 1fr;
  }
}

:global(.light-mode) {

  --sec-light-bg: #f4f5f7;
  --sec-light-card: #ffffff;
  --sec-light-text: #1a1b1e;
  --sec-light-border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
  .platform-logo {
    filter: grayscale(1) brightness(1.5);
    transition: filter 0.3s ease;
  }
}

@media (prefers-color-scheme: light) {
  .sec-container {
    background-color: var(--sec-light-bg);
    color: var(--sec-light-text);

    .scanline {
      opacity: 0.3;
      background:
        linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 50%),
        linear-gradient(90deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02));
      background-size:
        100% 3px,
        3px 100%;
    }
  }

  .sec-header {

    border-left-color: $accent-color;

    .subtitle {

      color: darken($accent-color, 5%);
    }

    .desc-text {
      color: #555; 

      .status-active {

        color: #008f24;
        text-shadow: none;
        font-weight: bold;
      }
    }
  }

  .content-grid {

    background-color: var(--sec-light-border);
    border-color: var(--sec-light-border);
  }

  .sec-card-wrapper {
    background-color: var(--sec-light-bg);

    &:hover {
      background-color: var(--sec-light-card);

      box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.1),
        0 8px 10px -6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px) scale(1.01);
      z-index: 5;
    }
  }

  .sec-card {

    color: var(--sec-light-text);

    .card-id {

      color: $accent-color;
      font-weight: 800;
      opacity: 1;
    }

    .card-body {
      .platform-box {
        .platform-logo {

        }
        .year-tag {

          background: #000;
          color: #fff;
        }
      }

      .card-title {
        color: #333;
        font-weight: 700;
      }
    }

    .card-footer {
      .view-report {
        color: #666;
        font-weight: 600;
      }

    }

    &:hover {
      .platform-logo {

        filter: grayscale(0) opacity(1);
      }
      .card-title {
        color: #000; 
      }
      .view-report {
        color: $accent-color;
      }
    }
  }
}
</style>
