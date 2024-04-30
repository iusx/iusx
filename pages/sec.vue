<template>
  <main>
    <div class="left">-> Vulnerability Report</div>
    <div class="main">
      <div class="main-title">
        <p>My Vulnerability <br />Report</p>
        <span>SECURITY</span>
        <Icon class="red" name="RedIcon" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
main {
  height: 100vh;
  width: 100vw;
  display: flex;
}
.main {
  width: inherit;
  .main-title {
    p {
      font-size: 6vh;
      color: #EF0000;
      font-weight: 600;
      z-index: 10;
      position: relative;
    }
    span {
      color: transparent;
      -webkit-text-stroke: 1px #dfdfdf;
      font-size: 19vw;
      position: absolute;
      top: 0;
      z-index: 0;
    }
    .red {
        position: absolute;
        right: 3vw;
    }
  }
}
.title {
  width: 40vw !important;
}
.left {
  text-transform: uppercase;
  padding: 2vh;
  writing-mode: tb-rl;
  padding-right: 5vw;
  font-weight: bold;
  color: #b5b5b5;
  margin-right: 5vw;
  background: #f5f5f5;
  height: 100vh;
  letter-spacing: 3.28px;
}
</style>
