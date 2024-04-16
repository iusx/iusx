<template>
  <video src="/background.mp4" playsinline loop muted autoplay="true"></video>
  <main>
    <div class="title">
      <p>
        <span>Full-stack</span> development,<br />
        <span>Security</span>, <span>Design</span>.
        <br />
      </p>
      <span>github + hackerone ≈ behance ÷ researchgate</span>
    </div>
    <div class="copyright">
      <p>
        This work is licensed under the Creative Commons Attribution 4.0
        International License (CC BY 4.0) and the MIT License
      </p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
video {
  position: absolute;
  z-index: -1;
  right: 0;
  height: 100vh;
}

@keyframes colorTransition {
  0%, 100% { color: #d6d6d6; }
  33%, 66% { color: #1c0000; }
}


main {
  width: 90%;
  margin: 0 auto;
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  line-height: 3;
  transform: translateY(30vh);
  p {
    color: #d6d6d6;
    font-size: 4em;
    line-height: 1;
    padding: 0;
    margin: 0;
    span {
      padding: 0;
      margin: 0;
      text-transform: capitalize;
      color: #d6d6d6;
      animation-name: colorTransition;
      animation-duration: 13s;
      animation-iteration-count: infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 1s;
      }

      &:nth-child(3) {
        animation-delay: 2s;
      }
    }
  }
  span {
    padding: 0;
    margin: 0;
    text-transform: capitalize;
    color: #b7b7b7;
  }
}
.copyright {
  width: 25vw;
  color: #a1a1a1;
  font-size: small;
}
</style>
