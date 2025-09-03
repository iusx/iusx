<template>
  <mian>
    <div class="pop-lay">
      <div class="pop-box">
        <div class="pop-title">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.33333 2.33333L11.6667 11.6667"
              stroke="#333333"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2.33333 11.6667L11.6667 2.33333"
              stroke="#333333"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="left">
            <p>The person I aspire to be</p>
            <span>The path/goal I am pursuing or working toward</span>
          </div>
        </div>
        <div class="pop-content">
          <div class="pop-c_box">
            <div class="pop-c_b_t">
              <p>独立安全研究</p>
              <span>PLAN-1</span>
            </div>
            <div class="pop-c_c">
              <p>
                很小的时候，我就觉得安全很酷，特别是什么漏洞、报告、威胁情报、预警之类的名词听起来就很帅,仿佛那种保护世界的感觉一样。
              </p>
            </div>
          </div>
          <div class="pop-c_box">
            <div class="pop-c_b_t">
              <p>前后端开发</p>
              <span>PLAN-2</span>
            </div>
            <div class="pop-c_c">
              <p>
                这是我入门 Code
                的起点。虽然大家都觉得前端和后端很简单，但却是一个上限很高的领域。例如你写个
                html/css 也是前端，做一个类似 React JavaScript library
                也是前端。对于后端，你写一个 CURD
                也是后端，规划一个分布式架构，也是后端。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </mian>
</template>

<script setup>
import { defineProps } from "vue";
const colorMode = useColorMode();

defineProps(["table"]);
</script>

<style lang="scss" scoped>
.pop-lay {
  position: fixed;
  inset: 0;
  background: rgb(240 240 240 / 81%);
  display: flex;
  justify-content: center;
  align-items: center;

  .pop-box {
    .pop-content {
      padding: 20px;
      display: flex;
      gap: 60px;
      flex-direction: column;
      .pop-c_box {
        .pop-c_b_t {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 6px;
          justify-content: space-between;
          flex-direction: column-reverse;
          p {
            font-size: 16px;
          }
          span {
            font-size: 10px;
            border: 1px solid #c1c1c1;
            padding: 4px;
            color: #c1c1c1;
          }
        }
        .pop-c_c {
          font-size: 14px;
        }
      }
    }
    &::before {
      content: "";
      width: 2px;
      height: 10%;
      background: #38e7cd;
      box-shadow: -1px 0px 11px 1px #38e7cd;
      position: absolute;
      display: block;
      left: 12px;
    }
    border: 1px solid #ececec;
    width: 80%;
    max-width: 900px;
    height: 80%;
    max-height: 90vh;
    background: white;
    overflow: auto;
    box-sizing: border-box;
    text-align: left;
    svg {
    }

    .pop-title {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      border-bottom: 1px solid #dddddd;
      padding-bottom: 23px;
      .left {
        width: 100%;
        p {
          font-size: 18px;
          color: #000;
        }
      }
    }
  }
}

.dark-mode {
  .pop-lay {
    background: rgb(0 0 0 / 81%);
    .pop-box {
      background: #0b0b0b;
      border: 1px solid #171717;
      .pop-title {
        border-bottom: 1px solid #222222;
        padding-bottom: 23px;
      }
      .pop-title .left {
        p {
          color: #ffffff;
        }
        span {
          color: #7b7b7b;
        }
      }
    }
  }
  .pop-lay .pop-box .pop-content .pop-c_box .pop-c_b_t span {
    border: 1px solid #99999957;
    color: #99999957;
  }
}
</style>
