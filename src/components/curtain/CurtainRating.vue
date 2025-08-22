<script setup>
import MainButton from "@/components/base/MainButton.vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useCurtainStore } from "@/stores/curtain";


const curtainStore = useCurtainStore();
const languageStore = useLanguageStore();


function toggleCurtain() {
  curtainStore.toggleCurtain();
}
</script>

<template>
  <div>
    <h1 v-html="languageStore.t('ratingPage.curtain.title')"></h1>
    {{ languageStore.t('ratingPage.curtain.text') }}
    <MainButton v-haptic-heavy class="custom_styles-button" :msg="languageStore.t('ratingPage.curtain.btn')" @click="toggleCurtain"/>
  </div>
</template>






<style scoped>
div {
  color: #816bfa;
  font-size: 1.6rem;
  line-height: 24px;
  padding: 4rem 2.4rem 28rem 2.4rem;



  background-image: url('@/assets/img/rating/curtain/bg-coin.webp'), url('@/assets/img/rating/curtain/curtain-cat.webp'), url('@/assets/img/rating/curtain/bg-coins.webp') ;
  background-position: top right, bottom, bottom;
  background-size: auto, 70%, contain;
  background-repeat: no-repeat;
  h1 {
    color: #fff;
    font-size: 2rem;
    font-weight: 500;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }
  .custom_styles-button {
    margin-top: 2rem;
  }
}
</style>