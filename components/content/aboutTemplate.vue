<script setup lang="ts">
import { ref } from "vue";

interface TagItem {
  label: string;
  value: string;
}

interface PupusPlan {
  name: string;
  code: string;
  desc: string;
}

interface PupusData {
  title: string;
  subtitle: string;
  plans: PupusPlan[];
}

interface ContributionItem {
  name: string;
  time: string;
  post: string;
  url: string;
}

const props = defineProps<{
  tag: TagItem[];
  pupus: PupusData[];
  contribution: ContributionItem[];
}>();

const activePupus = ref<number | null>(null);

function openPupus(index: number) {
  if (props.pupus && props.pupus[index]) {
    activePupus.value = index;
  }
}

function closePupus() {
  activePupus.value = null;
}

</script>

<template>
  <main class="about-page">
    <div class="hello">
      <div class="tip">
        <p class="about">
          <this-page>about</this-page>
        </p>
        <div class="tip-title">
          <p>interest://</p>
          <an-font
            class="me-tip"
            :text="[
              'Exploring Cybersecurity',
              'Designing for Fun',
              'Making Animations',
              'Creating Technical Art',
              'Building Full Stack Projects',
            ]"
          />
        </div>
        <div class="desc">
          <div class="desc-layout">
            <div class="desc-tag">
              <div
                class="desc-c_t"
                v-for="(item, index) in tag"
                :key="index"
                @click="openPupus(index)"
              >
                <p>{{ item.label }}</p>
                <span>{{ item.value }}</span>
              </div>
            </div>
            <transition name="pop" @after-leave="afterLeave">
              <an-pupus
                v-if="activePupus !== null"
                :pupus-data="pupus[activePupus]"
                @close="closePupus"
              />
            </transition>
            <slot></slot>
          </div>
        </div>
      </div>
      <div class="work">
        <div class="work-info">
          <p>Contribution Logs</p>
          <div class="work-info-text">
            <slot name="contributiondes" />
          </div>
        </div>
        <div class="work-layout">
          <div class="tables">
            <an-table :table="contribution" />
          </div>
        </div>
      </div>
      <div class="work">
        <div class="work-info">
          <p>Work Experience</p>
        </div>
        <div class="work-layout flex">
          <div class="job-layout">
            <div class="job" v-for="(work, index) in works" :key="index">
              <span class="job-time">{{ work.time }}</span>
              <p class="job-name">{{ work.name }}</p>
              <span class="title">{{ work.title }}</span>
              <small>"{{ work.desc }}"</small>
            </div>
          </div>
        </div>
      </div>
      <div class="work-log">
        <slot name="end"></slot>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.about-page {
  .job-layout {
    display: flex;
    gap: 60px;
    flex-direction: column;
    width: 100%;
  }
  a {
    text-decoration: none;
  }

  .desc-layout {
    color: #cbcbcb;
    font-size: 15px;

    margin-top: 30px;
    .desc-tag {
      .desc-c_t {
        cursor: pointer;
        transition: opacity 0.3s ease;
        &:hover {
          opacity: 0.6;
        }
      }
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }
    p {
      margin: 0px;
      margin-bottom: 0px;
    }
  }

  .work {
    color: #cbcbcb;
    width: 80%;
    font-size: larger;
    margin: 0 auto;

    @media (max-width: 768px) {
      width: 90%;
    }

    @media (max-width: 1024px) {
      display: block;
    }

    display: flex;
    padding-bottom: 15rem;
  }

  .work-log {
    width: 80%;

    @media (max-width: 768px) {
      width: 90%;
    }

    margin: 0 auto;
    padding-bottom: 15rem;
    color: #cbcbcb;
    text-transform: uppercase;

    p {
      margin: 0;
    }
  }

  .work-layout {
    display: flex;
    width: 100%;
    flex: 2;

    @media (max-width: 1024px) {
      display: block;
    }

    flex-direction: row-reverse;

    .tables {
      width: 90%;
    }

    .job {
      display: block;
      font-weight: 300;
      text-transform: capitalize;
      width: 90%;

      small {
        display: block;
        padding-top: 1rem;
        font-size: initial;
      }

      p {
        margin: 0;
      }

      .job-time {
        color: #a6a6a6;
        font-size: initial;
        font-weight: bold;
      }
    }
  }

  .work-info {
    flex: 1;

    p {
      padding: 0;
      color: #000;
    }

    .work-info-text {
      p {
        color: #a6a6a6;
        font-weight: 400 !important;
        display: block;
        padding-bottom: 1rem;
        text-align: justify;
        margin: 0;
        font-size: 14px;
      }
    }
  }

  .hello {
    background: #ffffff;

    .tip {
      padding-top: 20vh;
      padding-bottom: 15vh;
      font-size: 2.8vw;
      width: 60%;

      @media (max-width: 768px) {
        width: 90%;
      }

      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      .tip-title {
        display: flex;
        width: 100%;
      }

      p {
        color: #a6a6a6;
        margin: 0;
        padding-right: 5px;
      }

      .me-tip {
        font-weight: 300;
        width: 80%;

        @media (max-width: 768px) {
          width: 90%;
        }

        color: #cbcbcb;
      }

      .desc {
        font-size: 2vh;
        width: 100%;
        line-height: 1.5;
        margin-top: 1vh;

        .desc-layout {
          text-align: justify;

          p:nth-child(n + 2) {
            margin-top: 20px;
          }

          @media (max-width: 1024px) {
            column-count: 1;
          }
        }
      }
    }
  }

  .about {
    font-size: x-large;
    color: #38e7cd !important;
    text-transform: uppercase;

    small {
      color: #404040;
      font-size: initial;
      padding-right: 10px;
    }
  }
}

.dark-mode .hello {
  background: rgb(0, 0, 0);
}

.dark-mode .work-info p {
  color: #ffffff;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.pop-enter-to,
.pop-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
