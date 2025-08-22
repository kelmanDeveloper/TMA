<template>
  <div class="curtain_inner_policy">
    <canvas ref="qrContainer" class="qr"></canvas>
    <div>
      <MainButton
        @click="shareReferralLink"
        v-haptic
        class="custom_styles-button animate"
        :msg="languageStore.t('invitePage.inviteFriend')"
      />
      <CopyButton
        @click="copyInviteLink"
        @mouseup="resetButtonState"
        v-haptic-heavy
        class="animate"
      />
    </div>
  </div>
</template>

<script setup>
import QRCode from "qrcode";
import { inject, ref, onMounted } from "vue";
import MainButton from "../base/MainButton.vue";
import CopyButton from "../base/CopyButton.vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useCurtainStore } from "@/stores/curtain";

const curtainStore = useCurtainStore();

function toggleCurtain() {
  curtainStore.setCustomProp("invite");
  curtainStore.toggleCurtain();
}

const languageStore = useLanguageStore();

const tg = inject("tg");



const qrContainer = ref(null);

// Функция для генерации QR-кода
async function generateQRCode() {
  if (qrContainer.value) {
    await QRCode.toCanvas(qrContainer.value, qrValue.value, {
      color: {
        dark: "#fff", // Цвет точек
        light: "#1E1D21 ", // Цвет фона
      },
    });
  }
}

// Генерация QR-кода при монтировании компонента
onMounted(() => {
  generateQRCode();
});


  navigator.clipboard
    .writeText(referralLink)
    .then(() => {
      toggleCurtain();
    })
    .catch((err) => {
      console.error("Ошибка при копировании ссылки:", err);
    })
    .finally(() => {
      setTimeout(() => {
        isCopying = false;
      }, 1000); // 1 секунда задержки
    });
}

// Опционально: чтобы сбрасывать состояние кнопки, если это может быть причиной
function resetButtonState(event) {
  event.target.disabled = false;
}
</script>

<style scoped>
.curtain_inner_policy {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 3rem 3rem;
  canvas.qr {
    margin-bottom: 1rem;
    width: 100% !important;
    height: auto !important;
    max-width: 100%;
  }
  div {
    display: flex;
    width: 95%;
    gap: 4px;
    .custom_styles-button {
      width: calc(100% - 50px);
      background: #816bfa;
      border-radius: 10px;
      padding: 16px 32px;
    }
  }
}
</style>
