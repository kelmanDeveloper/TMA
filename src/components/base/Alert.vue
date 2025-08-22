<script setup>
import { computed } from "vue";
import { useAlertStore } from "@/stores/Alert";

const alertStore = useAlertStore();
const visibleAlerts = computed(() => {
  return alertStore.alerts.filter((alert) => alert.isVisible);
});
</script>

<template>
  <div class="alert-container">
    <transition-group name="fade" tag="div">
      <div
        v-for="alert in visibleAlerts"
        :key="alert.id"
        :class="['alert', alert.type]"
      >
        <div class="alert-content">
          <span class="alert-message">{{ alert.message }}</span>
          <span class="loader"></span>
        </div>
      </div>
    </transition-group>
  </div>
</template>


<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  flex-direction: column;
  gap: 10px;
}

.alert-content {
  display: flex;
  align-items: center;
}

.alert {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
  color: #fff;
  opacity: 1;
  transition: opacity 0.5s;
  margin-bottom: 4px;
  background: #131d29;
}

/* .alert.error {
  background-color: #f44336;
}

.alert.success {
  background-color: #4caf50;
} */

/* .alert.info {
  background-color: #2196f3;
} */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loader {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border-top: 2px solid #46ff52;
}

.alert.error .loader {
  border-top: 2px solid #ff0000;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
