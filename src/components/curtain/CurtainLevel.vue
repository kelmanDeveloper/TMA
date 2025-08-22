<script setup>
import { computed } from "vue";
import CPU from "@/components/icons/level/CPUIcon.vue";
import HDD from "@/components/icons/level/HDDIcon.vue";
import RAM from "@/components/icons/level/RAMIcon.vue";
import levelsData from "@/services/levels.js";
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();

const levels = computed(() => {
  const currentLanguage = languageStore.currentLanguage;
  const levelsKey = `levels${
    currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1)
  }`;
  const allLevels = levelsData.data()[levelsKey] || [];
  return allLevels.filter((level) => level.id >= 1); // Отфильтровываем только уровни с id >= 1
});
</script>



<template>
  <div class="curtain_inner_levels">
    <div class="curtain_inner_levels-top">
      <span>{{
        languageStore.t("baseComponents.curtain.level.mainTitle")
      }}</span>
    </div>

    <div class="level-section">
      <div v-for="level in levels" :key="level.id" class="level-wrapper">
        <div class="level-title">
          {{ languageStore.t("baseComponents.curtain.level.title") }}
          {{ level.level }}
        </div>
        <div class="level-subtitle">{{ level.title }}</div>

        <!-- Картинка кота для текущего уровня -->

        <div class="params-wrapper">
          <div class="cat">
            <img
              :src="`img/cats/cat-${level.level}.webp`"
              :alt="`cat level ${level.level}`"
            />
          </div>
          <div class="params-tech">
            <div class="params-squares">
              <div class="icon" style="padding-left: 2px">
                <CPU />
              </div>
              <div class="name">CPU</div>
              <div class="params">
                <span>{{ level.params.CPU }}</span>
              </div>
            </div>
            <span class="or">
              {{ languageStore.t("baseComponents.curtain.level.or") }}
            </span>
            <div class="params-squares">
              <div class="icon">
                <HDD style="margin-left: 4px; margin-right: 2px" />
              </div>
              <div class="name">HDD</div>
              <div class="params">
                <span>{{ level.params.HDD }}</span>
              </div>
            </div>
            <span class="or">
              {{ languageStore.t("baseComponents.curtain.level.or") }}
            </span>
            <div class="params-squares">
              <div class="icon">
                <RAM />
              </div>
              <div class="name">RAM</div>
              <div class="params">
                <span>{{ level.params.RAM }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="income">
          {{ level.income }} HN
          <span>
            {{ languageStore.t("baseComponents.curtain.level.per") }}
          </span>
        </div>
        <p class="text">{{ level.text }}</p>
        <!-- Отображение звездочек для уровня -->
        <div class="params-grade">
          <div>
            <svg
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 1.11309L12.0074 7.29116L12.0635 7.46391H12.2451H18.7411L13.4858 11.2822L13.3388 11.3889L13.3949 11.5617L15.4023 17.7397L10.1469 13.9215L10 13.8147L9.85305 13.9215L4.59768 17.7397L6.60505 11.5617L6.66118 11.3889L6.51423 11.2822L1.25886 7.46391H7.75486H7.9365L7.99262 7.29116L10 1.11309Z"
                fill="#FBF42E"
                stroke="#FBF42E"
                stroke-width="0.5"
              />
            </svg>
            {{ level.stars.first }}
          </div>
          <div>
            <svg
              width="20"
              height="19"
              viewBox="0 0 20 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 1.11309L12.0074 7.29116L12.0635 7.46391H12.2451H18.7411L13.4858 11.2822L13.3388 11.3889L13.3949 11.5617L15.4023 17.7397L10.1469 13.9215L10 13.8147L9.85305 13.9215L4.59768 17.7397L6.60505 11.5617L6.66118 11.3889L6.51423 11.2822L1.25886 7.46391H7.75486H7.9365L7.99262 7.29116L10 1.11309Z"
                fill="#FBF42E"
                stroke="#FBF42E"
                stroke-width="0.5"
              />
            </svg>
            {{ level.stars.second }}
          </div>
          <div>
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
              <path
                d="M10 1.11309L12.0074 7.29116L12.0635 7.46391H12.2451H18.7411L13.4858 11.2822L13.3388 11.3889L13.3949 11.5617L15.4023 17.7397L10.1469 13.9215L10 13.8147L9.85305 13.9215L4.59768 17.7397L6.60505 11.5617L6.66118 11.3889L6.51423 11.2822L1.25886 7.46391H7.75486H7.9365L7.99262 7.29116L10 1.11309Z"
                fill="#FBF42E"
                stroke="#FBF42E"
                stroke-width="0.5"
              />
            </svg>
            {{ level.stars.third }}
          </div>
        </div>
      </div>

      <div class="flexibility">
        <h3 class="title">
          {{
            languageStore.t("baseComponents.curtain.level.flexibilityTitle")
          }}:
        </h3>

        <p class="text">
          {{ languageStore.t("baseComponents.curtain.level.textOne") }}
        </p>

        <p>
          <span
            >{{ languageStore.t("baseComponents.curtain.level.textTitle") }}:
          </span>
          {{ languageStore.t("baseComponents.curtain.level.textTwo") }}
        </p>
        <p>
          {{ languageStore.t("baseComponents.curtain.level.textThree") }}
        </p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.curtain_inner_levels {
  text-wrap: balance;
  position: relative;
  padding: 1.3rem 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;

  .curtain_inner_levels-top {
    margin-bottom: 3rem;
    text-align: center;
    color: var(--color-white);
    font-size: 20px;
    font-weight: 500;
  }
  .level-section {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .level-wrapper:not(:last-child)::before {
    content: "";
    position: absolute;
    border-bottom: 1px solid #2b536c;
    width: 200%;
    bottom: 0;
    left: -50px;
  }
  .level-wrapper {
    margin-bottom: 20px;

    .level-title {
      color: #816bfa;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .level-subtitle {
      text-wrap: balance;
      line-height: 18.2px;
      color: #6da1dc;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .cat {
      flex: 1;
      img {
        height: 240px;
      }
    }
    .text {
      text-align: left;
      color: white;
      font-size: 12px;
      font-weight: 500;
      padding: 10px;
      background: #6da1dc;
      border-radius: 4px;
      margin-bottom: 8px;
      text-wrap: balance;
    }

    .params-wrapper {
      display: flex;
      gap: 8px;
      position: relative;
      align-items: center;
      .params-tech {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        border-radius: 4px;
        flex: 1;
        .or {
          margin: 6px 0;
          width: 100%;
          text-align: center;
          color: #6da1dc;
          font-size: 9px;
          font-weight: 300;
        }
        .icon {
          margin-right: 6px;
        }
        > div {
          display: flex;
          border-radius: 4px;
          padding: 8px 10px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          /* text-transform: uppercase; */
          /* background-color: #6da1dc; */
          border: 1px solid #6da1dc;
          width: 100%;
          align-items: center;
          .params {
            margin-left: auto;
            color: white;
            font-size: 10px;
            font-weight: 400;
          }
        }
      }
    }

    .params-grade {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: space-evenly;
      margin-bottom: 40px;
      > div {
        color: white;
        font-size: 12px;
        font-weight: 500;
        display: grid;
        align-items: center;
        gap: 8px;
        grid-auto-flow: column;
        svg {
          width: 20px !important;
          height: 20px;
          path {
            fill: #7f6af7;
            stroke: #7f6af7;
          }
        }
      }
    }
  }
}
.income {
  color: #816bfa;
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;

  span {
    color: white;
    font-size: 10px;
    font-weight: 400;
  }
}

.flexibility {
  display: flex;
  flex-direction: column;
  gap: 13px;
  margin-bottom: 24px;
  .title {
    color: #6da1dc;
    font-size: 12px;
    font-family: Montserrat;
    font-weight: 600;
    text-align: left;
    padding-left: 1rem;
  }
  p {
    color: white;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 500;
    text-align: left;
    padding-left: 1rem;
    span {
      font-weight: 300;
      display: block;
    }
  }
  .text {
    font-weight: 500;
    padding: 1rem;
    background: #6da1dc;
    border-radius: 4px;
    text-wrap: balance;
  }
}
</style>