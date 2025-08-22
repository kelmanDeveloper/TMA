<script setup>
import Footer from "@/components/base/Footer.vue";
import Curtain from "@/components/base/Curtain.vue";
import { useRouter, useRoute } from "vue-router";
import { watchEffect, computed, inject, provide, ref, onMounted } from "vue";
import { useCurtainStore } from "@/stores/curtain";
import BaseModal from "@/components/base/BaseModal.vue";
import Overlay from "@/components/base/Overlay.vue";
import { getData } from "@/utils/data";
import { preloadComponents } from "@/js/preload";
import { useWalletStore } from "@/stores/walletStore";
// import Onboarding from "@/components/base/Onboarding.vue";

preloadComponents();

const showOnboarding = ref(false);
const route = useRoute();
const isLoadingScreen = computed(() => route.path === "/");
const isSettingsScreen = computed(() => route.path === "/settings");
const baseModalRef = ref(null);
const router = useRouter();
const walletStore = useWalletStore();
const footerVisible = ref(true); // Состояние видимости footer

// Функция для управления footer
const setFooterVisible = (visible) => {
  footerVisible.value = visible;
};

provide("showBaseModal", (msg, type, duration) => {
  baseModalRef.value?.showBaseModal(msg, type, duration);
});

// Создаем глобальную функцию для доступа из utils
window.showBaseModal = (type) => {
  baseModalRef.value?.showBaseModal(null, type, null);
};

// Предоставляем функцию управления footer дочерним компонентам
provide("setFooterVisible", setFooterVisible);

const tg = inject("tg");

tg.headerColor = "#000";
tg.backgroundColor = "#000";
tg.bottomBarColor = "#000";
tg.isOrientationLocked = true;

const curtainStore = useCurtainStore();

const back = () => {
  router.push("/main");
};

const handleOnboardingClose = () => {
  showOnboarding.value = false;
};

tg.BackButton.onClick(back);
tg.isVerticalSwipesEnabled = true;

router.beforeEach((to) => {
  if (["devices", "invite", "rating", "settings"].includes(to.name)) {
    tg.BackButton.show();
  } else {
    tg.BackButton.hide();
  }
  // Восстанавливаем footer при переходах между страницами
  setFooterVisible(true);

  if (Telegram.WebApp.HapticFeedback) {
    Telegram.WebApp.HapticFeedback.impactOccurred("soft");
  }
});
// Отслеживаем изменения маршрута
watchEffect(() => {
  getData(route.path);
});

// Инициализация приложения при монтировании App.vue
onMounted(async () => {
  try {
    await walletStore.initApp();
  } catch (error) {
    console.error("[App.vue] Error during walletStore.initApp():", error);
  }
  // Проверяем, показывался ли уже онбординг
  // const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
  
  // if (!hasSeenOnboarding) {
  //   // Если онбординг еще не показывался, показываем его через 10 секунд
  //   setTimeout(() => {
  //     showOnboarding.value = true;
  //     // Сохраняем информацию о том, что пользователь видел онбординг
  //     localStorage.setItem("hasSeenOnboarding", "true");
  //   }, 10000);
  // }
});
</script>

<template>
  <Curtain :customProp="curtainStore.customProp" />
  <BaseModal ref="baseModalRef" />
  <!-- <Alert /> -->
  <RouterView />
  <Overlay />
  <!-- <transition name="slide-down">
    <Onboarding
      v-if="showOnboarding"
      @close="handleOnboardingClose"
    ></Onboarding>
  </transition> -->
  <Footer v-if="!isLoadingScreen && !isSettingsScreen && footerVisible" />
</template>


<style>
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(0%);
  opacity: 0;
}

.slide-down-enter-to, .slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}

</style>
