<script setup>
import MainButton from "@/components/base/MainButton.vue";
import { ref, computed, inject } from "vue";
import { useCurtainStore } from "@/stores/curtain";
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();


const tg = inject("tg");


// Pinia Store для управления состоянием
const curtainStore = useCurtainStore();

// Реактивные состояния для каждого чекбокса
const licenseAgreement = ref(false);
const privacyPolicy = ref(false);
const cookieConsent = ref(false);

// Вычисляемое свойство для проверки, активны ли все чекбоксы
const allChecked = computed(() => {
  return (
    licenseAgreement.value &&
    privacyPolicy.value &&
    cookieConsent.value
  );
});

// Функция для работы с кнопкой
const handleButtonClick = () => {
  if (allChecked.value) {
    // Передаем статус "все чекбоксы отмечены" в Pinia
    curtainStore.setAllChecked(true); // Передаем true в Pinia
  }
};
</script>

<template>
  <div class="curtain_inner_policy">
    <div class="checkbox-group">
      <!-- Чекбокс 1 -->
      <label class="checkbox-item">
        <input type="checkbox" v-model="licenseAgreement" />
        <span class="checkbox-text">
          
          {{ languageStore.t("baseComponents.curtain.policy.familiar") }}
          <a @click="externalOne" href="" class="checkbox-link">{{ languageStore.t("baseComponents.curtain.policy.licenseAgreement") }}</a>
        </span>
      </label>

      <!-- Чекбокс 2 -->
      <label class="checkbox-item">
        <input type="checkbox" v-model="privacyPolicy" />
        <span class="checkbox-text">
          {{ languageStore.t("baseComponents.curtain.policy.familiar") }}
          <a @click="externalTwo" class="checkbox-link">{{ languageStore.t("baseComponents.curtain.policy.privacyPolicy") }}</a>
        </span>
      </label>

      <!-- Чекбокс 3 -->
      <label class="checkbox-item">
        <input type="checkbox" v-model="cookieConsent" />
        <span class="checkbox-text">
          {{ languageStore.t("baseComponents.curtain.policy.familiar") }}
          <a @click="externalThree" class="checkbox-link"
            >{{ languageStore.t("baseComponents.curtain.policy.cookieConsent") }}</a
          >
        </span>
      </label>

    </div>

    <div class="curtain_inner_policy-bottom">
      <MainButton
        :disabled="!allChecked"
        @click="handleButtonClick"
        v-haptic-heavy
        :msg="languageStore.t('baseComponents.curtain.policy.btn')"
        :class="{ 'button-disabled': !allChecked }"
      />
    </div>
  </div>
</template>


<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  padding: 5rem 2rem 4rem 2rem;
  gap: 1.6rem;
}

.curtain_inner_policy-bottom {
  padding: 0 2rem 5rem 2rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.checkbox-item input {
  display: none; /* Скрываем стандартный чекбокс */
}

.checkbox-item:before {
  content: "";
  background-color: transparent;
  border: 2px solid #6da1dc;
  border-radius: 4px;
  padding: 10px;
  display: inline-block;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
}

/* Галочка появляется при checked */
.checkbox-item input:checked + .checkbox-text:before {
  content: "";
  display: block;
  width: 6px;
  height: 14px;
  border: solid #6da1dc;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  position: absolute;
  top: 45%;
  left: -2.45rem;
  transform: translateY(-50%) rotate(45deg);
}

/* Стили текста чекбокса */
.checkbox-text {
  position: relative;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.checkbox-link {
  color: #6da1dc;
  font-size: 12px;
  font-weight: 500;
  text-decoration: underline;
}

/* Стили для кнопки */
.button-disabled {
  background-color: #6c7075 !important; /* Серый фон для неактивной кнопки */
  cursor: not-allowed;
  &:hover {
    background-color: #6c7075 !important; /* Серый фон для неактивной кнопки */
  }
}
</style>
