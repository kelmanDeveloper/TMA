<script setup>
import MainButton from "@/components/base/MainButton.vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useCurtainStore } from "@/stores/curtain";
import { useRewardsStore } from "@/stores/rewardsStore";
import { computed } from "vue";

const curtainStore = useCurtainStore();
const languageStore = useLanguageStore();
const rewardsStore = useRewardsStore();

// Динамический текст с актуальными значениями наград
const dynamicBlockReferralInfo = computed(() => {
  const baseText = languageStore.t('mainPage.blockReferralInfo');
  
  // Если данные о наградах есть, заменяем захардкоженные значения
  if (rewardsStore.rewards) {
    const blockReward = rewardsStore.rewards.blockReward;
    const referralReward = rewardsStore.rewards.referralReward;
    
    // Заменяем различные форматы чисел в зависимости от языка
    return baseText
      .replace(/42[,.]*5/g, blockReward) // 42.5 или 42,5
      .replace(/7[,.]*5/g, referralReward); // 7.5 или 7,5
  }
  
  return baseText;
});

function toggleCurtain() {
  curtainStore.toggleCurtain();
}
</script>

<template>
  <div class="reward-curtain">
    <div v-html="dynamicBlockReferralInfo"></div>
    <MainButton
      v-haptic-heavy
      class="custom_styles-button"
      :msg="languageStore.t('ratingPage.curtain.btn')"
      @click="toggleCurtain"
    />
  </div>
</template>

<style>
.reward-curtain {
  padding: 5rem 4rem;
  overflow: auto;
  height: 80dvh;
}

.reward-curtain div h2 {
  color: #b5a4ff;
  font-size: 15px;
  line-height: 1.3;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.reward-curtain div p {
  color: #a6aab2;
  font-size: 13px;
  line-height: 1.3;
}

.reward-curtain div p:nth-child(3) {
  color: #e5eef7;
  margin: 2.5rem 0 3.6rem 0;
}

.reward-curtain div p:nth-child(6) {
  margin: 2.5rem 0 3.6rem 0;
}

.reward-curtain div strong {
  color: #e5eef7;
}

.reward-curtain .custom_styles-button {
  background: #2b2b36;
  border: 1px solid #b5a4ff;
  border-radius: 14px;
  padding: 14px 0;
}
</style>