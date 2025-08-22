import { defineStore } from 'pinia';

export const useCurtainStore = defineStore('curtain', {
  state: () => ({
    isOpen: false,
    customProp: null, 
    currentTask: null, // Текущее выбранное задание
    allChecked: false // Добавляем состояние для всех чекбоксов
  }),
  actions: {
    toggleCurtain() {
      this.isOpen = !this.isOpen;
    },
    setCustomProp(value) {
      this.customProp = value;
      if (value !== 'tasks') {
        this.clearTask();
      }
    },
    setTask(task) {
      this.currentTask = { ...task };
    },
    clearTask() {
      this.currentTask = null;
    },
    // Метод для установки состояния "все чекбоксы отмечены"
    setAllChecked(status) {
      this.allChecked = status;
    }
  }
});
