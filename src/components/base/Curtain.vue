<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useCurtainStore } from "@/stores/curtain";
import { useWalletStore } from "@/stores/walletStore";
// import CurtainAccount from "@/components/base/curtain/CurtainAccount.vue";
import CurtainLevel from "@/components/curtain/CurtainLevel.vue";
import CurtainTasks from "@/components/curtain/CurtainTasks.vue";
import CurtainPolicy from "@/components/curtain/CurtainPolicy.vue";
import CurtainRating from "@/components/curtain/CurtainRating.vue";
import CurtainInvite from "@/components/curtain/CurtainInvite.vue";
import CurtainReward from "@/components/curtain/CurtainReward.vue"
import CloseIcon from "@/components/icons/CloseIcon.vue";
import CurtainWallet from "@/components/curtain/CurtainWallet.vue";

const isAnimating = ref(false);
const isVisible = ref(false);
const overlay = ref(false);

const curtainStore = useCurtainStore();
const customProp = computed(() => curtainStore.customProp);
const walletStore = useWalletStore();

const route = useRoute();

const showCloseButton = computed(() => {
  return !(route.path === "/" || route.name === "loader");
});

watch(
  () => curtainStore.isOpen,
  async (newVal) => {
    if (newVal) {
      isVisible.value = true;
      overlay.value = true;
      await nextTick(); // Ждем, пока DOM обновится
      requestAnimationFrame(() => {
        isAnimating.value = true;
        overlay.value = true;
      });
    } else {
      isAnimating.value = false;
      overlay.value = false;
    }
  }
);

function onTransitionEnd() {
  if (!isAnimating.value) {
    isVisible.value = false;
    overlay.value = true;
  }
}

const computedStyle = computed(() => {
  if (customProp.value === "tasks") {
    return { height: "65%" };
  }
  if (customProp.value === "main") {
    return { height: "95dvh" };
  }
});

function handleDisconnect() {
  walletStore.disconnectWallet();
  curtainStore.toggleCurtain();
}
</script>

<template>
  <div v-if="isVisible">
    <div v-if="overlay" class="curtain-overlay"></div>

    <transition name="curtain" @after-leave="onTransitionEnd">
      <div :class="['curtain', { open: isAnimating }]" :style="computedStyle">
        <!-- Conditionally render the close button -->
        <button
          v-if="showCloseButton"
          v-haptic-heavy
          class="close"
          @click="curtainStore.toggleCurtain"
        >
          <CloseIcon />
        </button>

        <CurtainTasks v-if="customProp === 'tasks'"></CurtainTasks>

        <CurtainInvite v-if="customProp === 'invite'"></CurtainInvite>

        <CurtainLevel v-if="customProp === 'levels'"></CurtainLevel>

        <CurtainPolicy v-if="customProp === 'policy'"></CurtainPolicy>

        <CurtainRating v-if="customProp === 'rating'"></CurtainRating>

        <CurtainReward v-if="customProp === 'reward'"></CurtainReward>

        <CurtainWallet v-if="customProp === 'wallet'" :address="walletStore.address || ''" @disconnect="handleDisconnect" />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.curtain-overlay {
  position: absolute;
  height: 100dvh;
  top: -30%;
  z-index: 1;
  width: 100%;
  background: rgba(67, 9, 9, 0.07);
  backdrop-filter: blur(4px);
}

.curtain {
  width: 100%;
  background-color: #1E1D21;
  border-radius: 2.4rem 2.4rem 0 0;
  position: fixed;
  left: 0;
  bottom: -100%;
  z-index: 5;
  transition: bottom 0.3s ease;
  border-top: 1px solid #2B2B36;
}

.close {
  position: absolute;
  right: 14px;
  top: 12px;
  z-index: 1;
}

.curtain-enter-from,
.curtain-leave-to {
  bottom: -100%;
}

.curtain-enter-active,
.curtain-leave-active {
  transition: bottom 0.3s ease;
}

.curtain.open {
  bottom: 0;
}
</style>
