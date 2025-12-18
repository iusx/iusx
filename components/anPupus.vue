<template>
  <mian>
    <div class="pop-lay" @click.self="close">
      <div class="pop-box">
        <div class="pop-title">
          <svg
            style="cursor: pointer"
            @click="close"
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
            <p>{{ pupusData.title }}</p>
            <span>{{ pupusData.subtitle }}</span>
          </div>
        </div>
        <div class="pop-content">
          <div
            v-for="(plan, index) in pupusData.plans"
            :key="index"
            class="pop-c_box"
          >
            <div class="pop-c_b_t">
              <p>{{ plan.name }}</p>
              <span>{{ plan.code }}</span>
            </div>
            <div class="pop-c_c">
              <p v-html="plan.desc"></p>
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
const props = defineProps({
  pupusData: {
    type: Object,
    required: true,
    default: () => ({
      title: "",
      subtitle: "",
      plans: [],
    }),
  },
});
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.pop-lay {
  position: fixed;
  z-index: 1;
  inset: 0;
  background: rgb(240 240 240 / 81%);
  display: flex;
  transition: opacity 0.3s ease;
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
            font-size: 17px;
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
      position: sticky;
      top: 0;
      background: inherit;
      z-index: 10;
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

.dark-mode .pop-box {
  background: #1e1e1e;
  border-color: #444;
  color: #ddd;
}

.dark-mode .pop-box::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.dark-mode .pop-box::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.dark-mode .pop-box::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 5px;
}

.dark-mode .pop-box::-webkit-scrollbar-thumb:hover {
  background: #777;
}

.dark-mode .pop-box {
  scrollbar-width: thin;
  scrollbar-color: #555 #2a2a2a;
}

.pop-enter {
  opacity: 1;
  transform: translateY(0);
}

.pop-leave {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
