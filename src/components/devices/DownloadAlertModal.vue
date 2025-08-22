<template>
  <div 
    v-if="show" 
    class="alert-overlay" 
    :class="{ 'onboarding-alert': onboardingActive }"
    @click="closeModal"
  >
    <div class="alert-modal" @click.stop id="download-alert">
      <div class="alert-header">
        <button class="close-btn" @click="closeModal">✕</button>
      </div>
      <div class="alert-content">
        <h3>{{ languageStore.t('baseComponents.downloadAlert.title') }}</h3>
        <div class="link-container">
          <div class="link-text">{{ languageStore.t('baseComponents.downloadAlert.link') }}</div>
        </div>
        <button 
          :disabled="copied" 
          class="copy-btn" 
          @click="copyLink" 
          id="copy-link-btn"
        >
          <span class="copy-btn-content">
            <span class="copy-btn-text">{{ languageStore.t('baseComponents.downloadAlert.copyButton') }}</span>
            <span v-if="copied" class="copy-success">✓</span>
          </span>
        </button>
        <div class="alert-note">
          {{ languageStore.t('baseComponents.downloadAlert.note') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLanguageStore } from '@/stores/languageStore';

const languageStore = useLanguageStore();

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  onboardingActive: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close']);

// Reactive data
const copied = ref(false);

// Methods
const closeModal = () => {
  emit('close');
};

const copyLink = async () => {
  try {
    const link = languageStore.t('baseComponents.downloadAlert.link');
    await navigator.clipboard.writeText(link);
    console.log('Ссылка скопирована в буфер обмена');
    
    // Показываем галочку
    copied.value = true;
    
    // Убираем галочку через 5 секунд
    setTimeout(() => {
      copied.value = false;
    }, 5000);
    
  } catch (err) {
    console.error('Ошибка при копировании ссылки:', err);
    // Fallback для старых браузеров
    const textArea = document.createElement('textarea');
    textArea.value = languageStore.t('baseComponents.downloadAlert.link');
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Показываем галочку и для fallback
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 5000);
  }
};
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.alert-overlay.onboarding-alert {
  z-index: 100000;
}





.alert-modal {
  background: #1a1a1a;
  border-radius: 16px;
  padding: 24px;
  max-width: 90%;
  width: 400px;
  border: 1px solid #333;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.alert-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.alert-content h3 {
  color: #fff;
  font-size: 18px;
  margin-bottom: 16px;
  text-align: center;
}

.link-container {
  background: #2b2b36;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #444;
}

.link-text {
  color: #b5a4ff;
  font-family: monospace;
  font-size: 14px;
  word-break: break-all;
  text-align: center;
}

.copy-btn {
  width: 100%;
  background: linear-gradient(135deg, #b5a4ff 0%, #816bfa 100%);
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
  position: relative;
}

.copy-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(181, 164, 255, 0.3);
}

.copy-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.copy-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.copy-btn-text {
  font-size: 14px;
}

.copy-success {
  color: #4caf50;
  font-weight: bold;
  font-size: 16px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.alert-note {
  color: #ffa726;
  font-size: 12px;
  text-align: center;
  line-height: 1.4;
  background: rgba(255, 167, 38, 0.1);
  border-radius: 6px;
  padding: 8px;
  border: 1px solid rgba(255, 167, 38, 0.2);
}
</style> 