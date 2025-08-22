import './assets/styles/main.css';
import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { useLanguageStore } from "@/stores/languageStore";
import { Buffer } from 'buffer';

const tg = window.Telegram.WebApp;

const app = createApp(App);


// Подключаем Pinia перед использованием стора
const pinia = createPinia();
app.use(pinia);

// Инициализируем languageStore после подключения Pinia
const languageStore = useLanguageStore();

// Получение языка пользователя из Telegram WebApp
const languageCode = tg.initDataUnsafe?.user?.language_code || "en";

// Список поддерживаемых языков
const supportedLanguages = ["ru", "en", "es", "de", "fr", "pt"];
// Проверяем, есть ли язык в localStorage, иначе задаём по Telegram
if (!localStorage.getItem("language")) {
    const appLanguage = supportedLanguages.includes(languageCode) ? languageCode : "en";
    languageStore.setLanguage(appLanguage);
}

app.directive('haptic', {
    mounted(el) {
        el.addEventListener('click', () => {
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('soft');
            } else {
                console.warn('Telegram WebApp HapticFeedback не доступен');
            }
        });
    }
});

app.directive('haptic-heavy', {
    mounted(el) {
        el.addEventListener('click', () => {
            if (tg && tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('rigid');
            } else {
                console.warn('Telegram WebApp HapticFeedback не доступен');
            }
        });
    }
});

app.use(router);
app.use(VueQueryPlugin);
app.provide('tg', tg);

window.Buffer = Buffer;

app.mount('#app');
