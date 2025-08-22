// stores/alertStore.js
import { defineStore } from "pinia";

export const useAlertStore = defineStore("alertStore", {
  state: () => ({
    alerts: [], // Массив уведомлений
  }),
  actions: {
    addAlert(message, type = "error", duration = 3000) {
      const id = Date.now(); // Уникальный ID для уведомления
      const alert = { id, message, type, isVisible: true, duration };

      // Добавляем уведомление в массив
      this.alerts.push(alert);

      // Таймер для скрытия уведомления
      setTimeout(() => {
        this.hideAlert(id);
      }, duration - 500); // Уменьшаем время на 500 мс для плавного исчезновения
    },
    hideAlert(id) {
      const alert = this.alerts.find((alert) => alert.id === id);
      if (alert) {
        alert.isVisible = false; // Устанавливаем флаг для анимации исчезновения
        setTimeout(() => {
          this.removeAlert(id);
        }, 500); // Ожидаем завершения анимации (500 мс)
      }
    },
    removeAlert(id) {
      this.alerts = this.alerts.filter((alert) => alert.id !== id);
    },
  },
});
