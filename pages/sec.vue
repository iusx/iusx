<template>
  <main>
    <div class="left">-> Vulnerability Report</div>
    <div class="main">
      <div class="main-title">
        <p>My Vulnerability <br />Report</p>
        <span>SECURITY</span>
        <Icon class="red" name="RedIcon" />
      </div>
      <div class="content-layout">
        <p class="title-desc">
          Although I'm not officially in the security biz, I've stumbled upon a
          few security hiccups in my<br />
          work or daily life and reported them, more or less.
        </p>
        <swiper :slides-per-view="3" :space-between="10">
          <swiper-slide class="swi-width">
            <div class="content-box">
              <div class="content-time">
                <img src="/img/page/cnvd.png" /><span>2023</span>
              </div>
              <p class="box-title">CHINA TELECOM GROUP GUANGDONG CORPORATION</p>
            </div></swiper-slide
          >
          <swiper-slide class="swi-width">
            <div class="content-box">
              <div class="content-time">
                <img src="/img/page/cnvd.png" /><span>2023</span>
              </div>
              <p class="box-title">CHINA TELECOM GROUP GUANGDONG CORPORATION</p>
            </div></swiper-slide
          >
          <swiper-slide class="swi-width">
            <div class="content-box">
              <div class="content-time">
                <img src="/img/page/cnvd.png" /><span>2023</span>
              </div>
              <p class="box-title">CHINA TELECOM GROUP GUANGDONG CORPORATION</p>
            </div></swiper-slide
          >
          <swiper-slide class="swi-width">
            <div class="content-box">
              <div class="content-time">
                <img src="/img/page/cnvd.png" /><span>2023</span>
              </div>
              <p class="box-title">CHINA TELECOM GROUP GUANGDONG CORPORATION</p>
            </div></swiper-slide
          >
          <swiper-slide class="swi-width">
            <div class="content-box">
              <div class="content-time">
                <img src="/img/page/cnvd.png" /><span>2023</span>
              </div>
              <p class="box-title">CHINA TELECOM GROUP GUANGDONG CORPORATION</p>
            </div></swiper-slide
          >
        </swiper>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.swi-width {
  width: 31vh !important;
}
.content-layout {
  .content-box-layout {
    display: flex;
    overflow: auto;
  }
  .content-box {
    height: 31vh;
    background: transparent;
    border: 2px solid #dfe3e9;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: space-between;
    transition: background-color 0.3s ease, color 0.3s ease,
      box-shadow 0.3s ease;
    &:hover {
      background: #181818;
      color: white;
      box-shadow: 0px 4px 64.5px 11px rgba(0, 0, 0, 0.26);
      .content-time {
        span {
          color: #3a3a3a;
        }
      }
      .box-title {
        border-bottom: 0px solid red;
      }
    }
    .content-time {
      display: flex;
      flex-direction: row;
      padding: 2.5vh;

      justify-content: space-between;
      span {
        transition: color 0.3s ease;
        writing-mode: tb-rl;
        color: #f4f4f4;
        font-size: 3vh;
      }
    }
    img {
      width: 20vh;
      height: -webkit-fill-available;
      height: intrinsic;
    }
    .box-title {
      border-bottom: 10px solid red;
      transition: border-bottom 0.3s ease;
      margin: 0;
      padding: 2.5vh;
      font-weight: bold;
    }
  }
}
main {
  display: flex;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  position: fixed;
  .title-desc {
    color: #b5b5b5;
    margin-top: 4vh;
    margin-bottom: 3vh;
    font-size: small;
  }
}
.main {
  width: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .main-title {
    p {
      font-size: 6vh;
      color: #ef0000;
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
