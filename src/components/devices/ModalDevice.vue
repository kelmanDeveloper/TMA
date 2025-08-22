<script setup>
import { ref, computed, watchEffect } from "vue";
import { useDeviceList } from "@/stores/deviceList";
import { useLanguageStore } from "@/stores/languageStore";
import { deleteDevice } from "@/utils/data";
import ConfirmDeleteModal from "./ConfirmDeleteModal.vue";

const languageStore = useLanguageStore();
const devices = ref([])
const showConfirmDelete = ref(false);

// Props
const props = defineProps({
  device: {
    type: Object,
    required: true,
  },
});

// Emit для закрытия и действий
const emit = defineEmits(["close", "action"]);

// Pinia store
const deviceList = useDeviceList();

// Управление загрузкой при удалении устройства
const isDeleting = ref(false);

const isActivating = ref(false);

// Функция для закрытия модального окна
const closeModal = () => {
  emit("close");
};

function getUptime(device) {
  // Если статус устройства отсутствует или false — возвращаем 0
  if (!device?.status) return 0;
  // Безопасно достаем uptime, если что — 0
  return device?.deviceInfo?.system?.uptime ?? 0;
}

// Хелпер для форматирования в ЧЧ:ММ:СС
function formatUptime(uptime) {
  const sec = Math.floor(uptime % 60);
  const min = Math.floor((uptime / 60) % 60);
  const hr = Math.floor(uptime / 3600);
  return `${hr.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

const deviceUptime = computed(() => getUptime(props.device));
const formattedUptime = computed(() => formatUptime(deviceUptime.value));



watchEffect(() => {
  if (deviceList.deviceList) {
    devices.value = deviceList.deviceList;
    if (isDeleting.value) {
      isDeleting.value = false;
      closeModal();
    }
  }
});

// Проверяем, забанено ли устройство или нет
const isBanned = computed(() => props.device.banned);
const isInactive = computed(() => !props.device.status && !props.device.banned);

// Функция для удаления устройства
const remove = () => {
  showConfirmDelete.value = true;
};

const handleConfirmDelete = () => {
  showConfirmDelete.value = false;
  isDeleting.value = true;
  deleteDevice(props.device.id);
};

const handleCancelDelete = () => {
  showConfirmDelete.value = false;
};
</script>

<template>
  <div class="modal-wrapper" @click.self="closeModal">
    <div class="modal">
      <h3 class="modal-title">
        {{ languageStore.t("devicePage.modal.title") }}
      </h3>
      <div class="device-info">
        <p class="device-name">{{ device.id }}</p>
        <p class="device-description">
          CPU: {{ (device.cpu).toFixed(2) }} Cores, RAM: {{ (device.ram / 1024).toFixed(2) }} GB, Disk:
          {{ (device.hdd / 1024).toFixed(2) }} GB, GPU: {{ (device.gpu / 1024).toFixed(2) }} GB
        </p>
        <p class="device-description">
          CPUIndex: {{ device.cpuIndex }}, RAMIndex: {{ device.ramIndex }}, DISKIndex:
          {{ device.diskIndex }}, GPUIndex: {{ device.gpuIndex }}
        </p>
        <p class="device-location">
          {{ languageStore.t("devicePage.modal.lastUsed") }}:
          {{ new Date(device.timestamp * 1000).toLocaleString() }}
        </p>
        <p class="device-description">
          Uptime: {{ formattedUptime }}
        </p>        
        <p class="device-status">
          {{ languageStore.t("devicePage.modal.statusTitle") }}:
          <span>
            {{
              isBanned
                ? languageStore.t("devicePage.modal.deviseStatusBanned")
                : isInactive
                ? languageStore.t("devicePage.modal.deviseStatusNotActive")
                : languageStore.t("devicePage.modal.deviseStatusActive")
            }}
          </span>
        </p>
      </div>

      <div class="modal-actions">
        <button
          class="btn delete"
          v-if="!isActivating"
          @click="remove"
          :disabled="isDeleting"
        >
          {{
            isDeleting
              ? languageStore.t("devicePage.modal.btnDeleting")
              : languageStore.t("devicePage.modal.btnDelete")
          }}
        </button>
        <!-- <button v-if="isInactive && !isDeleting" class="btn activate" @click="activateDevice">
          {{ isActivating ? "Активация..." : "Активировать" }}
        </button> -->
      </div>
    </div>
    <ConfirmDeleteModal
      v-if="showConfirmDelete"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>


<style scoped>
/* Основные стили модального окна */
.modal-wrapper {
  display: grid;
  place-content: center;
  position: fixed;
  padding: 0 2rem;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Анимация для появления и исчезновения обертки */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active в версиях Vue до 2.1.8 */ {
  opacity: 0;
}

/* Анимация для появления и исчезновения модального окна */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-fade-enter,
.modal-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.modal {
  background-color: #1e1d21; /* Тёмно-синий фон */
  padding: 1.6rem;
  border-radius: 4px;
  width: 100%;
  color: #fff; /* Белый текст */
  border: 1px #816bfa solid;
  font-family: Arial, sans-serif;
}

/* Заголовок */
.modal-title {
  color: #a6aab2;
  font-size: 14px;
  margin-bottom: 1.4rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

/* Информация об устройстве */
.device-info {
  line-height: 16px;
}

/* Название устройства */
.device-name {
  color: #e5eef7;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.device-description,
.device-location {
  color: #a6aab2;
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 1rem;
}

.device-description:first-child {
  margin-bottom: 1rem;
}

.device-status {
  span {
    color: #816bfa;
  }
}

/* Контейнер для кнопок */
.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: 1.6rem;
}

/* Кнопки */
.btn {
  padding: 8px 10px;
  font-size: 1.2rem;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-weight: 500;
  width: 100%;
  color: #112235;
  border-radius: 4px;
  border: 1px solid #2b2b36;
  color: #a6aab2;
  background: #2b2b36;
}

/* Кнопка удаления */

/* Эффект наведения на кнопки */
.btn.activate:hover {
  background-color: #6cbdf0;
}

.btn.delete:hover {
  background-color: #394952;
  color: #d49af7; /* Светло-фиолетовый при наведении */
}
</style>
