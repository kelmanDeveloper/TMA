<script setup>
import MacBookIcon from "@/components/icons/MacBookIcon.vue";
import { computed, ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useDeviceList } from "@/stores/deviceList";
import { getDeviceList } from "@/utils/data";

const deviceList = useDeviceList();
const languageStore = useLanguageStore();
const currentPage = ref(Number(localStorage.getItem("currentDevicePage")) || 1);
const devices = ref([]);
const allPagesLoaded = ref(false);
const observer = ref(null);
const listEnd = ref(null);
const emit = defineEmits(["openModal", "refresh-skeleton"]);

// Функция для рендеринга устройств
const renderDevices = (devices, statusText) => {
  return devices.map((device) => ({
    ...device,
    statusText,
    isInactive: !device.status,
    isBanned: device.banned,
  }));
};

// Обновляем список устройств при изменении store
watchEffect(() => {
  if (deviceList.deviceList) {
    devices.value = deviceList.deviceList;
    allPagesLoaded.value = false;
  } else {
    allPagesLoaded.value = true;
  }
});

// Функция загрузки дополнительных устройств
const loadMoreDevices = () => {
  if (!allPagesLoaded.value) {
    currentPage.value++;
    localStorage.setItem("currentDevicePage", currentPage.value);
    getDeviceList(currentPage.value);
  }
};

// Фильтрация устройств
const devicesData = computed(() => [
  ...renderDevices(
    devices.value.filter((device) => device.status && !device.banned),
    languageStore.t("devicePage.modal.deviseStatusActive")
  ),
  ...renderDevices(
    devices.value.filter((device) => !device.status && !device.banned),
    languageStore.t("devicePage.modal.deviseStatusNotActive")
  ),
  ...renderDevices(
    devices.value.filter((device) => device.banned),
    languageStore.t("devicePage.modal.deviseStatusBanned")
  ),
]);

const refreshDeviceList = () => {
  localStorage.removeItem("friendListData");
  localStorage.removeItem("currentDevicePage");
  emit("refresh-skeleton");
  currentPage.value = 1;
  allPagesLoaded.value = false;
  devices.value = [];
  deviceList.getDeviceList(localStorage.getItem("accessToken"), 1);
};

// Открытие модального окна с устройством
const handleDeviceClick = (device) => {
  emit("openModal", device);
};

onMounted(async () => {
  const MINUTE = 1 * 60 * 1000;
  const currentTime = Date.now();

  const deviceListData = JSON.parse(localStorage.getItem("deviceList")) || [];

  const isMissingDeviceList = !deviceListData || deviceListData.length === 0;

  const storedUpdateTime =
    JSON.parse(localStorage.getItem("updateTimestamps")) || {};

  const lastUpdated = (storedUpdateTime.deviceListUpdatedTimestamp || 0) * 1000;

  const isDataOutdated = currentTime - lastUpdated > MINUTE;

  if (isMissingDeviceList || isDataOutdated) {
    localStorage.removeItem("currentDevicePage");
    currentPage.value = 1;
    devices.friendListData = [];
    await getDeviceList(currentPage.value);
  }

  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !allPagesLoaded.value) {
      loadMoreDevices();
    }
  });
});

watchEffect(() => {
  if (listEnd.value && observer.value) observer.value.observe(listEnd.value);
});

onUnmounted(() => {
  if (observer.value && listEnd.value) observer.value.unobserve(listEnd.value);
});
</script>

<template>
  <div class="devices_block-items">
    <div v-if="devices.length > 0">
      <h4 class="not-empty-list">
        {{ languageStore.t("devicePage.notEmptySubtitle") }}
        <svg
          fill="#7f7c7c"
          height="18px"
          width="18px"
          @click="refreshDeviceList"
          viewBox="0 0 489.645 489.645"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path
                d="M460.656,132.911c-58.7-122.1-212.2-166.5-331.8-104.1c-9.4,5.2-13.5,16.6-8.3,27c5.2,9.4,16.6,13.5,27,8.3 c99.9-52,227.4-14.9,276.7,86.3c65.4,134.3-19,236.7-87.4,274.6c-93.1,51.7-211.2,17.4-267.6-70.7l69.3,14.5 c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-122.8-25c-20.6-2-25,16.6-23.9,22.9l15.6,123.8 c1,10.4,9.4,17.7,19.8,17.7c12.8,0,20.8-12.5,19.8-23.9l-6-50.5c57.4,70.8,170.3,131.2,307.4,68.2 C414.856,432.511,548.256,314.811,460.656,132.911z"
              ></path>
            </g>
          </g>
        </svg>
      </h4>
      <div v-for="(device, index) in devicesData" :key="device.id">
        <button
          class="devices_block-item"
          :style="{
            backgroundColor: device.isBanned
              ? 'transparent'
              : device.isInactive
              ? '#2B2B36'
              : '#2B2B36',
            borderColor:
              device.isBanned || device.isInactive ? '#2B2B36' : '#816BFA',
            borderWidth:
              device.isBanned || device.isInactive ? '1px' : '1px',
            borderStyle: 'solid',
          }"
          @click="handleDeviceClick(device)"
        >
          <MacBookIcon
            :style="{
              fill: device.isBanned
                ? '#A6AAB2'
                : device.isInactive
                ? '#E5EEF7'
                : '#fff ',
            }"
          />
          <div>
            <div
              class="devices_block-item-name"
              :style="{
                color: device.isBanned
                  ? '#A6AAB2'
                  : device.isInactive
                  ? '#e5eef7'
                  : '',
              }"
            >
              {{ device.name }}
            </div>
            <p
              class="devices_block-item-device"
              :style="{
                color: device.isBanned
                  ? '#A6AAB2'
                  : device.isInactive
                  ? '#A6AAB2'
                  : '',
              }"
            >
              {{ device.id }}
            </p>
            <p
              class="devices_block-item-status"
              :style="{
                color: device.isBanned
                  ? '#A6AAB2'
                  : device.isInactive
                  ? '#E5EEF7'
                  : '#fff',
              }"
            >
              {{ languageStore.t("devicePage.deviseStatusTitle") }}:
              <span
                :style="{
                  color: device.isBanned
                    ? '#A6AAB2'
                    : device.isInactive
                    ? ''
                    : '#816BFA',
                }"
              >
                {{ device.statusText }}
              </span>
            </p>
          </div>
        </button>
        <div v-if="index === devicesData.length - 1" ref="listEnd"></div>
      </div>
      <div ref="listEnd"></div>
    </div>
    <div v-else>
      <p class="empty">{{ languageStore.t("devicePage.emptyListTitle") }}</p>
    </div>
  </div>
</template>




<style scoped>
.devices_block-item-status,
.devices_block-item-banned {
  margin-top: 0.5rem;
  color: var(--color-text-grey);
}
.empty {
  color: white;
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  padding-top: 3rem;
}
.nonactive-title,
.blocked-title {
  color: var(--color-white);
  font-size: var(--size-12);
  line-height: var(--height-16);
  font-weight: var(--regular);
  text-transform: uppercase;
  margin: 2rem 0 2rem 0;
}
.devices_block-items {
  display: grid;
  gap: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: var(--color-white);
    font-size: var(--size-12);
    line-height: var(--height-16);
    font-weight: var(--regular);
    text-transform: uppercase;
  }
  .devices_block-item {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    padding: 1rem;
    text-align: left;
    align-items: start;
    gap: 10px;
    border-radius: 4px;
    background: #112235;
    border: 1px solid #6da1dc;

    .devices_block-item-name {
      font-size: var(--size-12);
      font-weight: var(--semibold);
      line-height: var(--height-16);
      color: var(--color-white);
      text-transform: uppercase;
    }

    .devices_block-item-device {
      font-size: var(--size-12);
      font-weight: var(--regular);
      line-height: var(--height-16);
      color: var(--color-white);
    }

    .devices_block-item-time {
      color: var(--color-text-grey);
      font-size: var(--size-12);
      font-weight: var(--regular);
      line-height: var(--height-16);
    }

    /* &:hover {
      transition: background 0.5s;
      background: var(--color-dark-grey)
        radial-gradient(circle, transparent 1%, var(--color-dark-grey) 1%)
        center/15000%;
    } */

    &:active {
      background-color: #2e3f4d;
      background-size: 100%;
      transition: background 0s;
    }
  }
}
</style>