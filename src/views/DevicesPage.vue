<script setup>
import MainTitle from "@/components/base/MainTitle.vue";
import DeviceItems from "@/components/devices/DeviceItems.vue";
import ModalDevice from "@/components/devices/ModalDevice.vue";
import DeviceConnectionSuccessModal from "@/components/devices/DeviceConnectionSuccessModal.vue";
import MainButton from "@/components/base/MainButton.vue";
import ComputerIcon from "@/components/icons/ComputerIcon.vue";
import { ref, inject, onUnmounted, onMounted, computed, watch } from "vue";
import BotBanner from "@/components/base/BotBanner.vue";
import DownloadAlertModal from "@/components/devices/DownloadAlertModal.vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useAuthStore } from "@/stores/authStore";
import { useDeviceList } from "@/stores/deviceList";
import { watchEffect } from "vue";
import Modal from "@/components/settings/Modal.vue";
import {
  bindDevices,
  shouldStartOnboarding,
  completeInstruction,
} from "@/utils/data";
import { extractDeviceId, isValidUUID } from "@/shared/helpers/deviceId";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";
import { useRouter } from "vue-router";

const languageStore = useLanguageStore();
const authStore = useAuthStore();
const router = useRouter();

const deviceList = useDeviceList();
let intervalId;
const devices = ref([]); // Список устройств
const skeleton = ref(true); // Флаг загрузки
const loadingBtn = ref(false);
const isTitle = ref(false); // Для отображения заголовка
const selectedDevice = ref(null); // Выбранное устройство для модального окна
const showModal = ref(false); // Видимость модального окна
const isModal = ref(false);
const isModalLinux = ref(false);

// const port = ref(22);
const port = ref(22);
const login = ref("root");
const ip = ref("");
const password = ref("");
const showPassword = ref(false);
const loadingSSH = ref(false);
const showAlert = ref(false);
const alertMessage = ref("");
const showDeviceConnectionSuccess = ref(false);
const showDownloadAlertModal = ref(false);

// Состояние онбординга с localStorage управлением
const onboardingActive = ref(false);
const onboardingStep = ref(0);
const showContinueModal = ref(false);
const onboardingInactivityTimer = ref(null);
const devicesOnboardingSkip = ref(false);

// Обработчик скролла для онбординга
const handleScroll = () => {
  if (onboardingActive.value) {
    // Блокируем скролл во время онбординга
    preventScrollDuringOnboarding();
  }
};

// Безопасное получение инстанса Intro.js (v6/v7 совместимо)
const getIntroInstance = () =>
  typeof introJs.tour === "function" ? introJs.tour() : introJs();

// Константы для состояний онбординга devices
const DEVICES_ONBOARDING_STATES = {
  NOT_STARTED: "not_started",
  STEP_1_CLICK_BANNER: "step_1_click_banner",
  STEP_2_ALERT_OPENED: "step_2_alert_opened",
  STEP_3_ALERT_CLOSED: "step_3_alert_closed",
  STEP_4_CONNECT_BUTTON: "step_4_connect_button",
  STEP_5_MODAL_CLOSED: "step_5_modal_closed",
  COMPLETED: "completed",
};

// Функции для работы с состоянием онбординга devices
const getDevicesOnboardingState = () => {
  return (
    localStorage.getItem("TMA-onboarding-devices-state") ||
    DEVICES_ONBOARDING_STATES.NOT_STARTED
  );
};

const setDevicesOnboardingState = (state) => {
  localStorage.setItem("TMA-onboarding-devices-state", state);

  // Если онбординг завершен, устанавливаем глобальный флаг
  if (state === DEVICES_ONBOARDING_STATES.COMPLETED) {
    localStorage.setItem("TMA-onboarding-devices-completed", "true");
  }
};

const isDevicesOnboardingCompleted = () => {
  return getDevicesOnboardingState() === DEVICES_ONBOARDING_STATES.COMPLETED;
};

// Computed состояния для удобства использования в шаблоне
const currentOnboardingState = computed(() => getDevicesOnboardingState());
const isBannerStepActive = computed(
  () =>
    currentOnboardingState.value ===
    DEVICES_ONBOARDING_STATES.STEP_1_CLICK_BANNER
);
const isAlertStepActive = computed(
  () =>
    currentOnboardingState.value ===
    DEVICES_ONBOARDING_STATES.STEP_2_ALERT_OPENED
);
const isConnectButtonStepActive = computed(
  () =>
    currentOnboardingState.value ===
    DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON
);
const keyboardHeight = ref(0); // Для отслеживания высоты клавиатуры
const isIOS = ref(false); // Проверка на iOS

// Добавляем состояние загрузки для QR-сканера
const loadingQR = ref(false);

// Инжектим функцию для управления footer
const setFooterVisible = inject("setFooterVisible", null);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const showDownloadAlert = () => {
  showDownloadAlertModal.value = true;

  // Если онбординг активен и мы на первом шаге, переходим ко второму состоянию
  const currentState = getDevicesOnboardingState();
  if (currentState === DEVICES_ONBOARDING_STATES.STEP_1_CLICK_BANNER) {
    // Останавливаем текущий онбординг
    try {
      getIntroInstance().exit();
    } catch (e) {
      console.log("Текущий Intro.js тур не был активен");
    }

    // Добавляем класс к body для скрытия Intro.js элементов
    document.body.classList.add("modal-active");

    setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.STEP_2_ALERT_OPENED);
    // Сбрасываем таймер неактивности при активности пользователя
    resetInactivityTimer();
  }
};

const closeDownloadAlert = () => {
  showDownloadAlertModal.value = false;

  // Если онбординг активен и алерт был открыт, сразу переходим к следующему шагу
  const currentState = getDevicesOnboardingState();

  if (currentState === DEVICES_ONBOARDING_STATES.STEP_2_ALERT_OPENED) {
    setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON);

    // Запускаем следующий шаг онбординга с задержкой для корректного закрытия модалки
    setTimeout(async () => {
      // Убираем класс modal-active перед запуском нового онбординга
      document.body.classList.remove("modal-active");

      // Дополнительная очистка перед запуском нового онбординга
      try {
        const introElements = document.querySelectorAll(
          ".introjs-overlay, .introjs-tooltip, .introjs-helperLayer"
        );
        introElements.forEach((el) => {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      } catch (e) {
        console.log("Очистка не потребовалась");
      }

      await continueToConnectDevice();
    }, 300); // Задержка для корректного закрытия модалки
  } else {
    // Если это не онбординг, просто убираем класс
    document.body.classList.remove("modal-active");
  }
};

// Функции онбординга
const startDevicesOnboarding = async () => {
  // Сбрасываем флаг skip при запуске нового онбординга
  devicesOnboardingSkip.value = false;

  // Проверяем нужно ли запускать онбординг на основе authStore.instruction
  if (!shouldStartOnboarding("TMA-onboarding-devices-completed")) {
    return;
  }

  const currentState = getDevicesOnboardingState();

  // Если уже завершен, не запускаем
  if (currentState === DEVICES_ONBOARDING_STATES.COMPLETED) {
    return;
  }

  // Если мы на шаге 4 (кнопка подключения), не запускаем первый шаг
  if (currentState === DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON) {
    await continueToConnectDevice();
    return;
  }

  onboardingActive.value = true;
  onboardingStep.value = 1;
  setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.STEP_1_CLICK_BANNER);

  // СПЕРВА скролл к верху, ПОТОМ блокировка скролла и онбординг
  document.getElementById("app")?.scrollTo({ top: 0, behavior: "smooth" });

  // Ждем завершения скролла, затем запускаем онбординг
  await new Promise((resolve) => setTimeout(resolve, 600)); // Ждем завершения анимации скролла

  // Убираем класс modal-active перед запуском онбординга
  document.body.classList.remove("modal-active");

  // Очищаем предыдущие туры Intro.js
  try {
    getIntroInstance().exit();
    const introElements = document.querySelectorAll(
      ".introjs-overlay, .introjs-tooltip, .introjs-helperLayer"
    );
    introElements.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.log("Предыдущий тур не был активен в startDevicesOnboarding");
  }

  // Блокируем скролл во время онбординга
  preventScrollDuringOnboarding();

  // Запускаем таймер неактивности
  startInactivityTimer();

  try {
    const tour = getIntroInstance();
    tour.setOptions({
      exitOnEsc: false,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      showBullets: false,
      showProgress: false,
      scrollToElement: true,
      scrollTo: "element", // Возвращаем автоматический скролл
      scrollPadding: 30,
      overlayOpacity: 0.75,
      disableInteraction: false, // Разрешаем взаимодействие с выделенными элементами
      tooltipPosition: "auto",
      positionPrecedence: ["bottom", "top", "right", "left"],
      hidePrev: true,
      hideNext: true, // Скрываем кнопку "Далее"
      showButtons: true, // Показываем кнопки навигации для Skip
      skipLabel: "Пропустить",
      doneLabel: "Понятно",
      showSkipButton: true,
      helperElementPadding: 10,
      highlightClass: "introjs-highlight",
      steps: [
        {
          element: "#bot-banner",
          intro: languageStore.t("tutorial.devicesPage.downloadApp.intro"),
          title: languageStore.t("tutorial.devicesPage.downloadApp.title"),
          position: "bottom",
        },
      ],
    });

    // Подключаем обработчик для Skip-кнопки на первом шаге
    const attachSkipClassWatcher1 = () => {
      const tagAndMove = () => {
        document.querySelectorAll(".introjs-skipbutton").forEach((btn) => {
          // Класс для стилизации
          btn.classList.add("hn-skip");
          // Переносим кнопку внутрь панели кнопок текущего тултипа
          const tooltip = btn.closest(".introjs-tooltip");
          const buttonsBar = tooltip
            ? tooltip.querySelector(".introjs-tooltipbuttons")
            : null;
          if (buttonsBar && btn.parentElement !== buttonsBar) {
            try {
              buttonsBar.insertBefore(btn, buttonsBar.firstChild || null);
            } catch (_) {}
          }
          // Принудительно перехватываем клик по Skip ПЕРЕД обработкой Intro.js
          if (
            !btn.dataset.hnBound &&
            btn.classList.contains("introjs-skipbutton")
          ) {
            btn.addEventListener(
              "click",
              (e) => {
                // Останавливаем всплытие событий к Intro.js только для кнопки Skip
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Помечаем что это Skip
                devicesOnboardingSkip.value = true;

                // Принудительно вызываем exit вместо complete
                setTimeout(() => {
                  try {
                    tour.exit();
                  } catch (_) {}
                }, 0);

                return false;
              },
              true
            ); // Фаза захвата для приоритета перед Intro.js
            btn.dataset.hnBound = "1";
          }
        });
      };
      tagAndMove();
      window.devicesSkipObserver1 = new MutationObserver(() => tagAndMove());
      window.devicesSkipObserver1.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    tour.onafterchange(() => {
      if (!window.devicesSkipObserver1) attachSkipClassWatcher1();
    });
    tour.oncomplete(() => {
      onboardingActive.value = false;
      preventScrollDuringOnboarding();
      if (window.devicesSkipObserver1) {
        window.devicesSkipObserver1.disconnect();
        window.devicesSkipObserver1 = null;
      }
    });
    tour.onexit(() => {
      // Проверяем, что это действительно Skip, а не случайный exit
      if (!devicesOnboardingSkip.value) {
        // Если это не Skip, просто выходим без дополнительных действий
        return;
      }

      console.log("🎯 Skip button clicked on step 1!");
      // Завершаем весь онбординг и отправляем запрос на сервер
      setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
      localStorage.setItem("TMA-onboarding-main-completed", "true");
      localStorage.setItem("TMA-onboarding-devices-completed", "true");
      localStorage.setItem("TMA-onboarding-invite-state", "completed");
      onboardingActive.value = false;
      preventScrollDuringOnboarding();
      clearInactivityTimer();
      if (window.devicesSkipObserver1) {
        window.devicesSkipObserver1.disconnect();
        window.devicesSkipObserver1 = null;
      }

      completeInstruction().catch((error) => {
        console.error("❌ Ошибка при завершении инструкции:", error);
      });
    });

    // Observer уже сохранен глобально в attachSkipClassWatcher1
    tour.start();
  } catch (error) {
    console.error("❌ Ошибка при запуске Intro.js тура:", error);
    handleIntroJsError(error);
  }
};

const continueToConnectDevice = async () => {
  // Сбрасываем флаг skip при запуске нового шага
  devicesOnboardingSkip.value = false;

  // Отключаем предыдущий observer перед запуском нового шага
  if (window.devicesSkipObserver1) {
    window.devicesSkipObserver1.disconnect();
    window.devicesSkipObserver1 = null;
  }

  onboardingStep.value = 2;

  // Проверяем текущее состояние - если уже установлено STEP_4_CONNECT_BUTTON, не дублируем
  const currentState = getDevicesOnboardingState();
  if (currentState !== DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON) {
    setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON);
  }

  // СПЕРВА скролл к верху, ПОТОМ блокировка скролла и онбординг
  document.getElementById("app")?.scrollTo({ top: 0, behavior: "smooth" });

  // Ждем завершения скролла, затем запускаем онбординг
  await new Promise((resolve) => setTimeout(resolve, 600)); // Ждем завершения анимации скролла

  // Убираем класс modal-active перед запуском нового онбординга
  document.body.classList.remove("modal-active");

  // Агрессивно останавливаем все предыдущие туры Intro.js
  try {
    // Останавливаем активный тур
    getIntroInstance().exit();

    // Принудительно удаляем все элементы Intro.js
    const introElements = document.querySelectorAll(
      ".introjs-overlay, .introjs-tooltip, .introjs-helperLayer"
    );
    introElements.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.log("Предыдущий Intro.js тур не был активен или уже очищен");
  }

  // Сбрасываем флаг активности и устанавливаем заново
  onboardingActive.value = false;
  setTimeout(() => {
    onboardingActive.value = true;
  }, 100);

  // Добавляем специальный обработчик для кнопки подключения
  setTimeout(() => {
    const connectBtn = document.getElementById("connect-device-btn");
    if (connectBtn) {
      connectBtn.style.pointerEvents = "auto";
      connectBtn.style.zIndex = "9999";
    }
  }, 100);

  try {
    // Отключаем observer первого шага
    if (window.devicesSkipObserver1) {
      window.devicesSkipObserver1.disconnect();
      window.devicesSkipObserver1 = null;
    }

    const tour = getIntroInstance();
    tour.setOptions({
      exitOnEsc: false,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      showBullets: false,
      showProgress: false,
      scrollToElement: true,
      scrollTo: "element", // Возвращаем автоматический скролл
      scrollPadding: 30,
      overlayOpacity: 0.75,
      disableInteraction: false, // Разрешаем взаимодействие с выделенными элементами
      tooltipPosition: "auto",
      positionPrecedence: ["bottom", "top", "right", "left"],
      hidePrev: true,
      hideNext: true,
      showButtons: true, // Показываем кнопки навигации для Skip
      skipLabel: "Пропустить",
      doneLabel: "Понятно",
      showSkipButton: true,
      helperElementPadding: 10,
      highlightClass: "introjs-highlight",
      steps: [
        {
          element: "#connect-device-btn",
          intro: languageStore.t("tutorial.devicesPage.connectDevice.intro"),
          title: languageStore.t("tutorial.devicesPage.connectDevice.title"),
          position: "top",
        },
      ],
    });

    // Подключаем обработчик для Skip-кнопки на втором шаге
    const attachSkipClassWatcher2 = () => {
      const tagAndMove = () => {
        document.querySelectorAll(".introjs-skipbutton").forEach((btn) => {
          // Класс для стилизации
          btn.classList.add("hn-skip");
          // Переносим кнопку внутрь панели кнопок текущего тултипа
          const tooltip = btn.closest(".introjs-tooltip");
          const buttonsBar = tooltip
            ? tooltip.querySelector(".introjs-tooltipbuttons")
            : null;
          if (buttonsBar && btn.parentElement !== buttonsBar) {
            try {
              buttonsBar.insertBefore(btn, buttonsBar.firstChild || null);
            } catch (_) {}
          }
          // Принудительно перехватываем клик по Skip ПЕРЕД обработкой Intro.js
          if (
            !btn.dataset.hnBound &&
            btn.classList.contains("introjs-skipbutton")
          ) {
            btn.addEventListener(
              "click",
              (e) => {
                // Останавливаем всплытие событий к Intro.js только для кнопки Skip
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Помечаем что это Skip
                devicesOnboardingSkip.value = true;

                // Принудительно вызываем exit вместо complete
                setTimeout(() => {
                  try {
                    tour.exit();
                  } catch (_) {}
                }, 0);

                return false;
              },
              true
            ); // Фаза захвата для приоритета перед Intro.js
            btn.dataset.hnBound = "1";
          }
        });
      };
      tagAndMove();
      window.devicesSkipObserver2 = new MutationObserver(() => tagAndMove());
      window.devicesSkipObserver2.observe(document.body, {
        childList: true,
        subtree: true,
      });
    };

    tour.onafterchange(() => {
      if (!window.devicesSkipObserver2) attachSkipClassWatcher2();
    });
    tour.oncomplete(() => {
      completeDevicesOnboarding();
      if (window.devicesSkipObserver2) {
        window.devicesSkipObserver2.disconnect();
        window.devicesSkipObserver2 = null;
      }
    });
    tour.onexit(() => {
      // Проверяем, что это действительно Skip, а не случайный exit
      if (!devicesOnboardingSkip.value) {
        // Если это не Skip, просто выходим без дополнительных действий
        return;
      }

      console.log("🎯 Skip button clicked on step 2!");
      // Завершаем весь онбординг и отправляем запрос на сервер
      setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
      localStorage.setItem("TMA-onboarding-main-completed", "true");
      localStorage.setItem("TMA-onboarding-devices-completed", "true");
      localStorage.setItem("TMA-onboarding-invite-state", "completed");
      onboardingActive.value = false;
      preventScrollDuringOnboarding();
      clearInactivityTimer();
      if (window.devicesSkipObserver2) {
        window.devicesSkipObserver2.disconnect();
        window.devicesSkipObserver2 = null;
      }

      completeInstruction().catch((error) => {
        console.error("❌ Ошибка при завершении инструкции:", error);
      });
    });

    // Observer уже сохранен глобально в attachSkipClassWatcher2
    tour.start();
  } catch (error) {
    console.error("❌ Ошибка при запуске Intro.js тура (шаг 2):", error);
    handleIntroJsError(error);
  }
};

const showContinueOnboarding = () => {
  const currentState = getDevicesOnboardingState();
  if (currentState === DEVICES_ONBOARDING_STATES.STEP_3_ALERT_CLOSED) {
    showContinueModal.value = true;
  }
};

const continueTour = async () => {
  showContinueModal.value = false;
  // Сбрасываем таймер при активности пользователя
  resetInactivityTimer();
  await continueToConnectDevice();
};

const skipDevicesOnboarding = () => {
  showContinueModal.value = false;
  setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
  onboardingActive.value = false;

  // Убираем класс modal-active
  document.body.classList.remove("modal-active");

  // Сбрасываем стили кнопки подключения
  const connectBtn = document.getElementById("connect-device-btn");
  if (connectBtn) {
    connectBtn.style.pointerEvents = "";
    connectBtn.style.zIndex = "";
  }

  // Разблокируем скролл
  preventScrollDuringOnboarding();
  // Очищаем таймер неактивности
  clearInactivityTimer();
};

const completeDevicesOnboarding = () => {
  setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
  onboardingActive.value = false;

  // Убираем класс modal-active
  document.body.classList.remove("modal-active");

  // Сбрасываем стили кнопки подключения
  const connectBtn = document.getElementById("connect-device-btn");
  if (connectBtn) {
    connectBtn.style.pointerEvents = "";
    connectBtn.style.zIndex = "";
  }

  // Разблокируем скролл
  preventScrollDuringOnboarding();
  // Очищаем таймер неактивности
  clearInactivityTimer();
  // Переход на /invite теперь происходит в финальном онбординге
};

// Обработчик клика на кнопку подключения устройства
const handleConnectDeviceClick = () => {
  const currentState = getDevicesOnboardingState();

  // Если онбординг активен и мы на 4-м шаге, завершаем онбординг и открываем модалку
  if (currentState === DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON) {
    // Останавливаем онбординг
    try {
      getIntroInstance().exit();
    } catch (e) {
      console.log("Intro.js тур не был активен");
    }

    // Сбрасываем флаг активности
    onboardingActive.value = false;

    // Сбрасываем стили кнопки подключения
    const connectBtn = document.getElementById("connect-device-btn");
    if (connectBtn) {
      connectBtn.style.pointerEvents = "";
      connectBtn.style.zIndex = "";
    }

    // Разблокируем скролл
    preventScrollDuringOnboarding();

    // Добавляем класс modal-active для скрытия Intro.js элементов
    document.body.classList.add("modal-active");

    // Устанавливаем состояние, что модалка открыта
    setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.STEP_5_MODAL_CLOSED);

    // Открываем модалку
    isModal.value = true;
    return;
  }

  // Обычная логика открытия модалки
  isModal.value = true;
};

// Финальный онбординг с кнопкой "Далее" для перехода на /friends
const startFinalOnboarding = async () => {
  // Сбрасываем флаг skip при запуске нового шага
  devicesOnboardingSkip.value = false;

  // Отключаем предыдущий observer перед запуском нового шага
  if (window.devicesSkipObserver2) {
    window.devicesSkipObserver2.disconnect();
    window.devicesSkipObserver2 = null;
  }

  onboardingStep.value = 3;

  // СПЕРВА скролл к верху, ПОТОМ блокировка скролла и онбординг
  document.getElementById("app")?.scrollTo({ top: 0, behavior: "smooth" });

  // Ждем завершения скролла, затем запускаем онбординг
  await new Promise((resolve) => setTimeout(resolve, 600)); // Ждем завершения анимации скролла

  // Агрессивно останавливаем все предыдущие туры
  try {
    // Останавливаем активный тур
    getIntroInstance().exit();

    // Принудительно удаляем все элементы Intro.js
    const introElements = document.querySelectorAll(
      ".introjs-overlay, .introjs-tooltip, .introjs-helperLayer"
    );
    introElements.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });

    // Дополнительная очистка - удаляем все элементы с классами introjs
    const allIntroElements = document.querySelectorAll('[class*="introjs"]');
    allIntroElements.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    console.log(
      "Предыдущий Intro.js тур не был активен в startFinalOnboarding"
    );
  }

  // Устанавливаем флаг активности
  onboardingActive.value = true;

  // Блокируем скролл во время онбординга
  preventScrollDuringOnboarding();

  // Добавляем небольшую задержку для полной очистки
  setTimeout(() => {
    // Финальный онбординг не требует проверки элементов

    try {
      // Отключаем observers предыдущих шагов
      if (window.devicesSkipObserver1) {
        window.devicesSkipObserver1.disconnect();
        window.devicesSkipObserver1 = null;
      }
      if (window.devicesSkipObserver2) {
        window.devicesSkipObserver2.disconnect();
        window.devicesSkipObserver2 = null;
      }

      const tour = getIntroInstance();
      tour.setOptions({
        exitOnEsc: false,
        exitOnOverlayClick: false,
        showStepNumbers: false,
        showBullets: false,
        showProgress: false,
        scrollToElement: true,
        scrollTo: "element",
        scrollPadding: 30,
        overlayOpacity: 0.75,
        disableInteraction: false,
        tooltipPosition: "auto",
        positionPrecedence: ["bottom", "top", "right", "left"],
        hidePrev: true,
        hideNext: false, // Показываем кнопку "Далее"
        showButtons: true, // Показываем все кнопки
        skipLabel: "Пропустить",
        doneLabel: "→",
        showSkipButton: true,
        helperElementPadding: 10,
        highlightClass: "introjs-highlight",
        steps: [
          {
            element: "body",
            intro: languageStore.t(
              "tutorial.devicesPage.deviceConnected.intro"
            ),
            title: languageStore.t(
              "tutorial.devicesPage.deviceConnected.title"
            ),
            position: "center",
          },
        ],
      });

      // Подключаем обработчик для Skip-кнопки на финальном шаге
      const attachSkipClassWatcher3 = () => {
        const tagAndMove = () => {
          document.querySelectorAll(".introjs-skipbutton").forEach((btn) => {
            // Класс для стилизации
            btn.classList.add("hn-skip");
            // Переносим кнопку внутрь панели кнопок текущего тултипа
            const tooltip = btn.closest(".introjs-tooltip");
            const buttonsBar = tooltip
              ? tooltip.querySelector(".introjs-tooltipbuttons")
              : null;
            if (buttonsBar && btn.parentElement !== buttonsBar) {
              try {
                buttonsBar.insertBefore(btn, buttonsBar.firstChild || null);
              } catch (_) {}
            }
            // Принудительно перехватываем клик по Skip ПЕРЕД обработкой Intro.js
            if (
              !btn.dataset.hnBound &&
              btn.classList.contains("introjs-skipbutton")
            ) {
              btn.addEventListener(
                "click",
                (e) => {
                  // Останавливаем всплытие событий к Intro.js только для кнопки Skip
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();

                  // Помечаем что это Skip
                  devicesOnboardingSkip.value = true;

                  // Принудительно вызываем exit вместо complete
                  setTimeout(() => {
                    try {
                      tour.exit();
                    } catch (_) {}
                  }, 0);

                  return false;
                },
                true
              ); // Фаза захвата для приоритета перед Intro.js
              btn.dataset.hnBound = "1";
            }
          });
        };
        tagAndMove();
        window.devicesSkipObserver3 = new MutationObserver(() => tagAndMove());
        window.devicesSkipObserver3.observe(document.body, {
          childList: true,
          subtree: true,
        });
      };

      tour.onafterchange(() => {
        if (!window.devicesSkipObserver3) attachSkipClassWatcher3();
      });
      tour.oncomplete(() => {
        // Переходим на страницу друзей
        router.push("/invite");
        setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
        onboardingActive.value = false;
        preventScrollDuringOnboarding();
        clearInactivityTimer();
        if (window.devicesSkipObserver3) {
          window.devicesSkipObserver3.disconnect();
          window.devicesSkipObserver3 = null;
        }
      });
      tour.onexit(() => {
        // Проверяем, что это действительно Skip, а не случайный exit
        if (!devicesOnboardingSkip.value) {
          // Если это не Skip, просто выходим без дополнительных действий
          return;
        }

        console.log("🎯 Skip button clicked on step 3!");
        // Завершаем весь онбординг и отправляем запрос на сервер БЕЗ редиректа
        setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
        localStorage.setItem("TMA-onboarding-main-completed", "true");
        localStorage.setItem("TMA-onboarding-devices-completed", "true");
        localStorage.setItem("TMA-onboarding-invite-state", "completed");
        onboardingActive.value = false;
        preventScrollDuringOnboarding();
        clearInactivityTimer();
        if (window.devicesSkipObserver3) {
          window.devicesSkipObserver3.disconnect();
          window.devicesSkipObserver3 = null;
        }

        completeInstruction().catch((error) => {
          console.error("❌ Ошибка при завершении инструкции:", error);
        });
      });
      tour.start();
    } catch (error) {
      // Простая обработка ошибки без вызова handleIntroJsError
      onboardingActive.value = false;
      preventScrollDuringOnboarding();
    }
  }, 200); // Задержка для полной очистки
};

// Функция для принудительного восстановления состояния (на случай сбоев)
const forceRestoreOnboarding = () => {
  // Останавливаем все активные туры
  try {
    getIntroInstance().exit();
  } catch (e) {
    console.log("Intro.js тур не был активен");
  }

  // Сбрасываем UI состояние
  onboardingActive.value = false;
  onboardingStep.value = 0;
  showContinueModal.value = false;
  showDownloadAlertModal.value = false;

  // Запускаем восстановление через 1 секунду
  setTimeout(() => {
    restoreOnboardingState();
  }, 1000);
};

// Функция для обработки ошибок в intro.js (через try-catch)
const handleIntroJsError = (error) => {
  console.error("❌ Ошибка в Intro.js:", error);

  // Если произошла ошибка, попытаемся восстановить состояние
  setTimeout(() => {
    const currentState = getDevicesOnboardingState();
    if (currentState !== DEVICES_ONBOARDING_STATES.COMPLETED) {
      forceRestoreOnboarding();
    }
  }, 2000);
};

// Функция для управления скроллом во время онбординга
const preventScrollDuringOnboarding = () => {
  const appElement = document.getElementById("app");
  if (!appElement) return;

  if (onboardingActive.value) {
    appElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.classList.add("onboarding-active");
  } else {
    appElement.style.overflow = "auto";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.classList.remove("onboarding-active");
  }
};

// Функция для ручного позиционирования рамки онбординга (если понадобится)
const updateOnboardingPosition = () => {
  const helperLayer = document.querySelector(".introjs-helperLayer");
  const tooltip = document.querySelector(".introjs-tooltip");

  if (helperLayer) {
    // Обновляем позицию рамки при скролле
    const rect = helperLayer.getBoundingClientRect();
    helperLayer.style.position = "fixed";
    helperLayer.style.top = rect.top + "px";
    helperLayer.style.left = rect.left + "px";
    helperLayer.style.width = rect.width + "px";
    helperLayer.style.height = rect.height + "px";
  }

  if (tooltip) {
    // Обновляем позицию тултипа при скролле
    const rect = tooltip.getBoundingClientRect();
    tooltip.style.position = "fixed";
    tooltip.style.top = rect.top + "px";
    tooltip.style.left = rect.left + "px";
  }
};

// Управление таймером неактивности онбординга
const startInactivityTimer = () => {
  clearInactivityTimer();

  // Устанавливаем таймер на 5 минут неактивности
  onboardingInactivityTimer.value = setTimeout(() => {
    const currentState = getDevicesOnboardingState();
    if (currentState !== DEVICES_ONBOARDING_STATES.COMPLETED) {
      setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.COMPLETED);
      onboardingActive.value = false;
      showContinueModal.value = false;
      showDownloadAlertModal.value = false;

      // Останавливаем intro.js если активен
      try {
        getIntroInstance().exit();
      } catch (e) {
        // Игнорируем ошибки
      }
    }
  }, 5 * 60 * 1000); // 5 минут
};

const clearInactivityTimer = () => {
  if (onboardingInactivityTimer.value) {
    clearTimeout(onboardingInactivityTimer.value);
    onboardingInactivityTimer.value = null;
  }
};

const resetInactivityTimer = () => {
  const currentState = getDevicesOnboardingState();
  if (
    currentState !== DEVICES_ONBOARDING_STATES.COMPLETED &&
    onboardingActive.value
  ) {
    startInactivityTimer();
  }
};

// Функция восстановления состояния онбординга после перезагрузки
const restoreOnboardingState = () => {
  const currentState = getDevicesOnboardingState();

  // Проверяем готовность DOM элементов
  const checkDOMReady = () => {
    const botBanner = document.getElementById("bot-banner");
    const connectBtn = document.getElementById("connect-device-btn");

    if (!botBanner && currentState !== DEVICES_ONBOARDING_STATES.COMPLETED) {
      setTimeout(checkDOMReady, 500);
      return;
    }

    // DOM готов, восстанавливаем состояние
    switch (currentState) {
      case DEVICES_ONBOARDING_STATES.NOT_STARTED:
        // Проверяем нужно ли запускать онбординг перед стартом
        if (shouldStartOnboarding("TMA-onboarding-devices-completed")) {
          // startDevicesOnboarding(); // disabled
        }
        break;

      case DEVICES_ONBOARDING_STATES.STEP_1_CLICK_BANNER:
        onboardingActive.value = true;
        onboardingStep.value = 1;
        // Даем время DOM элементам инициализироваться, затем запускаем
        setTimeout(async () => {
          // await startDevicesOnboarding(); // disabled
        }, 300);
        break;

      case DEVICES_ONBOARDING_STATES.STEP_2_ALERT_OPENED:
        onboardingActive.value = true;
        onboardingStep.value = 1;
        // Запускаем таймер неактивности
        startInactivityTimer();
        // Показываем алерт, как будто пользователь только что кликнул на баннер
        setTimeout(() => {
          showDownloadAlertModal.value = true;
        }, 300);
        break;

      case DEVICES_ONBOARDING_STATES.STEP_3_ALERT_CLOSED:
        onboardingActive.value = true;
        // Запускаем таймер неактивности
        startInactivityTimer();
        // Показываем модалку продолжения сразу (без задержки, так как 5 сек уже прошли)
        setTimeout(() => {
          showContinueOnboarding();
        }, 500);
        break;

      case DEVICES_ONBOARDING_STATES.STEP_4_CONNECT_BUTTON:
        onboardingActive.value = true;
        onboardingStep.value = 2;
        // Запускаем таймер неактивности
        startInactivityTimer();
        // Проверяем что кнопка подключения существует
        if (connectBtn || !loadingBtn.value) {
          setTimeout(async () => {
            await continueToConnectDevice();
          }, 500);
        } else {
          setDevicesOnboardingState(
            DEVICES_ONBOARDING_STATES.STEP_3_ALERT_CLOSED
          );
          setTimeout(() => {
            showContinueOnboarding();
          }, 500);
        }
        break;

      case DEVICES_ONBOARDING_STATES.STEP_5_MODAL_CLOSED:
        onboardingActive.value = true;
        onboardingStep.value = 3;
        // Запускаем таймер неактивности
        startInactivityTimer();
        // Запускаем финальный онбординг
        setTimeout(async () => {
          await startFinalOnboarding();
        }, 500);
        break;

      case DEVICES_ONBOARDING_STATES.COMPLETED:
        // Убеждаемся что состояние UI чистое
        onboardingActive.value = false;
        onboardingStep.value = 0;
        showContinueModal.value = false;
        showDownloadAlertModal.value = false;
        break;

      default:
        setDevicesOnboardingState(DEVICES_ONBOARDING_STATES.NOT_STARTED);
        // startDevicesOnboarding(); // disabled
        break;
    }
  };

  // Запускаем проверку готовности DOM
  checkDOMReady();
};

// Функция для тестирования онбординга
const testDevicesOnboarding = () => {
  // Останавливаем все активные intro.js туры (совместимо с разными версиями API)
  try {
    const inst = getIntroInstance();
    inst.exit();
  } catch (_) {}

  // Полный локальный сброс онбординга устройств
  localStorage.removeItem("TMA-onboarding-devices-completed");
  localStorage.setItem(
    "TMA-onboarding-devices-state",
    DEVICES_ONBOARDING_STATES.NOT_STARTED
  );

  // Разрешаем запуск онбординга даже если инструкция была завершена
  try {
    authStore.instruction = false;
  } catch (_) {}

  // Сброс UI-состояния
  onboardingActive.value = false;
  onboardingStep.value = 0;
  showContinueModal.value = false;
  showDownloadAlertModal.value = false;
  document.body.classList.remove("modal-active");

  // Форсируем старт первого шага, минуя shouldStartOnboarding
  setTimeout(() => {
    // startDevicesOnboarding(); // disabled
  }, 200);
};

function resetDevicesOnboarding() {
  localStorage.removeItem("TMA-onboarding-main-completed");
  localStorage.removeItem("TMA-onboarding-devices-completed");
  localStorage.removeItem("TMA-onboarding-devices-state");
  localStorage.removeItem("TMA-onboarding-invite-state");
}

const handleRefreshSkeleton = () => {
  skeleton.value = true;
};

const handleWriteClick = () => {
  isModal.value = false;
  isModalLinux.value = true;
  // Скрываем footer при открытии модалки
  if (setFooterVisible) {
    setFooterVisible(false);
  }
};

watchEffect(() => {
  if (deviceList.deviceList) {
    devices.value = deviceList.deviceList;
    skeleton.value = false;
  }
});

async function createSSH() {
  // Сначала проверяем обязательные поля
  if (!login.value || !ip.value || !password.value) {
    // Если поля пустые - не включаем лоадинг, только показываем красные рамки
    return;
  }

  // Если все обязательные поля заполнены - включаем лоадинг
  loadingSSH.value = true;

  try {
    const result = await deviceList.createFromSSH(
      localStorage.getItem("accessToken"),
      ip.value,
      login.value,
      password.value,
      port.value === "" || port.value === null || port.value === undefined
        ? 22
        : parseInt(port.value)
    );

    if (result.success === true) {
      handleSuccessResponse();
    }
  } catch (error) {
    alertMessage.value = languageStore.t(
      "baseComponents.baseModal.authError.errorAlertText"
    );
    if (error === 400) {
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    }

    // При ошибке сбрасываем лоадинг и очищаем поля
    loadingSSH.value = false;
    ip.value = "";
    password.value = "";
    port.value = 22;
    return; // Выходим из функции при ошибке
  }

  // Успешное выполнение - очищаем поля и отключаем лоадинг
  ip.value = "";
  password.value = "";
  port.value = 22;
  loadingSSH.value = false;
}

// isValidUUID импортирован из хелпера

// Флаг для предотвращения множественной обработки QR
let qrProcessing = false;

// Глобальные обработчики QR-событий
const handleQrTextReceived = async (result) => {
  if (result && result.data && loadingQR.value && !qrProcessing) {
    qrProcessing = true;
    const scannedData = result.data.trim();
    const cleanId = extractDeviceId(scannedData);

    // Валидируем UUID - если невалидный, просто игнорируем
    if (!isValidUUID(cleanId)) {
      loadingQR.value = false;
      qrProcessing = false;
      try { tg.closeScanQrPopup(); } catch (_) {}
      return;
    }

    try {
      const bindResult = await bindDevices(cleanId);
      isModal.value = false;
      
      if (bindResult === true) {
        showDeviceConnectionSuccess.value = true;
      }
    } catch (error) {
      console.error("Failed to bind device:", error);
    } finally {
      loadingQR.value = false;
      qrProcessing = false;
      try { tg.closeScanQrPopup(); } catch (_) {}
    }
  }
};

const handleQrScanClosed = () => {
  console.log("QR Popup closed manually");
  loadingQR.value = false;
  qrProcessing = false;
};

function openQrScanner() {
  if (loadingQR.value) {
    return; // Предотвращаем множественные вызовы
  }

  try {
    loadingQR.value = true;
    tg.showScanQrPopup({ text: "Please scan a QR code" });
  } catch (error) {
    console.error("Error opening QR Scanner:", error);
    loadingQR.value = false;
  }
}

const handleSuccessResponse = () => {
  isModalLinux.value = false;
  showDeviceConnectionSuccess.value = true;
};

// Function to bind the device

const tg = inject("tg");

// Обработка клавиатуры для iOS через события фокуса
const isKeyboardOpen = ref(false);
const focusTimeout = ref(null); // Для отмены blur таймера

const handleInputFocus = () => {
  if (isIOS.value) {
    // Отменяем blur таймер если он запущен
    if (focusTimeout.value) {
      clearTimeout(focusTimeout.value);
      focusTimeout.value = null;
    }
    isKeyboardOpen.value = true;
  }
};

const handleInputBlur = () => {
  if (isIOS.value) {
    // Задержка только если нет другого focus события
    focusTimeout.value = setTimeout(() => {
      isKeyboardOpen.value = false;
      focusTimeout.value = null;
    }, 150);
  }
};

onMounted(() => {
  // Определяем iOS устройство
  isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Устанавливаем обработчики QR-событий безопасно (сначала отписываемся)
  try { window.Telegram.WebApp.offEvent("qrTextReceived", handleQrTextReceived); } catch (_) {}
  try { window.Telegram.WebApp.offEvent("scanQrPopupClosed", handleQrScanClosed); } catch (_) {}
  window.Telegram.WebApp.onEvent("qrTextReceived", handleQrTextReceived);
  window.Telegram.WebApp.onEvent("scanQrPopupClosed", handleQrScanClosed);

  // Добавляем обработчик скролла для обновления позиции рамки онбординга
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Проверяем состояние онбординга и восстанавливаем при необходимости
  setTimeout(() => {
    // restoreOnboardingState(); // disabled
  }, 1000);
});

// Открытие модального окна при выборе устройства
const openModal = (device) => {
  selectedDevice.value = device;
  showModal.value = true;
};

// Закрытие модального окна устройств (ModalDevice)
const closeDeviceModal = () => {
  showModal.value = false;
  selectedDevice.value = null;
};

// Закрытие модального окна сканирования QR (Modal)
const closeModal = () => {
  isModal.value = false;

  // Если онбординг был активен и мы на 5-м шаге, запускаем финальный онбординг
  const currentState = getDevicesOnboardingState();

  if (currentState === DEVICES_ONBOARDING_STATES.STEP_5_MODAL_CLOSED) {
    // Убираем класс modal-active перед запуском финального онбординга
    document.body.classList.remove("modal-active");

    // Немедленно очищаем старые элементы Intro.js
    try {
      const introElements = document.querySelectorAll(
        ".introjs-overlay, .introjs-tooltip, .introjs-helperLayer"
      );
      introElements.forEach((el) => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    } catch (e) {
      console.log("Очистка не потребовалась");
    }

    // Запускаем финальный онбординг через небольшую задержку
    setTimeout(async () => {
      await startFinalOnboarding();
    }, 200);
  } else {
    // Если это не онбординг, просто убираем класс
    document.body.classList.remove("modal-active");
  }
};

// Функция закрытия SSH модалки с восстановлением footer
const closeSSHModal = () => {
  isModalLinux.value = false;
  // Показываем footer при закрытии модалки
  if (setFooterVisible) {
    setFooterVisible(true);
  }
};

// Обработка кнопки удаления или активации

onUnmounted(() => {
  clearInterval(intervalId);

  // Очищаем таймер неактивности онбординга
  clearInactivityTimer();

  // Разблокируем скролл при размонтировании
  preventScrollDuringOnboarding();

  // Удаляем обработчик скролла
  window.removeEventListener("scroll", handleScroll);

  // Очищаем обработчики QR-событий
  window.Telegram.WebApp.offEvent("qrTextReceived", handleQrTextReceived);
  window.Telegram.WebApp.offEvent("scanQrPopupClosed", handleQrScanClosed);
});
</script>

<template>
  <ModalDevice
    v-if="showModal"
    :device="selectedDevice"
    @close="closeDeviceModal"
  />

  <DeviceConnectionSuccessModal
    v-if="showDeviceConnectionSuccess"
    @close="showDeviceConnectionSuccess = false"
  />

  <Modal v-if="isModal" @close="closeModal">
    <template #devices-actions>
      <button class="btn" @click="handleWriteClick">
        {{ languageStore.t("devicePage.scanModal.writeBtn") }}
      </button>
      <button class="btn" @click="openQrScanner" :disabled="loadingQR">
        {{
          loadingQR
            ? "Сканирование..."
            : languageStore.t("devicePage.scanModal.scanBtn")
        }}
      </button>
    </template>
  </Modal>

  <div v-if="showAlert" class="ssh-alert">
    {{ alertMessage }}
  </div>
  <div
    v-if="isModalLinux"
    class="modal-ssh-wrapper"
    :style="{
      transform: isIOS && isKeyboardOpen ? 'translateY(200px)' : 'none',
    }"
  >
    <Modal @close="closeSSHModal">
      <template #devices-actions>
        <div class="modal-input-inner">
          <label
            >IP<input
              type="text"
              maxlength="50"
              placeholder="192.168.123.132"
              name="ip"
              v-model="ip"
              :class="{ error: !ip }"
              autocomplete="off"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
          /></label>
          <label
            >Port<input
              type="number"
              min="1"
              max="65535"
              placeholder="22"
              name="port"
              v-model="port"
              autocomplete="off"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
          /></label>
          <label
            >Login<input
              type="text"
              maxlength="50"
              placeholder="Mars"
              name="login"
              v-model="login"
              :class="{ error: !login }"
              autocomplete="off"
              @focus="handleInputFocus"
              @blur="handleInputBlur"
          /></label>
          <label>
            Password
            <div class="password-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                maxlength="50"
                placeholder="8H*j$L4!q#7X@z"
                v-model="password"
                name="password"
                :class="{ error: !password }"
                autocomplete="off"
                @focus="handleInputFocus"
                @blur="handleInputBlur"
              />
              <button type="button" @click="togglePassword" class="toggle-btn">
                <span v-if="showPassword">
                  <!-- закрытый глаз -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4.5 15.5C7.5 9 16.5 9 19.5 15.5"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.8162 12.1825L19.5 8.5"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 10.625V7"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.18383 12.1825L4.5 8.5"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>

                <span v-else>
                  <!-- открытый глаз -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </label>
        </div>
        <button
          @click="createSSH"
          class="modal-input-button"
          :disabled="loadingSSH"
        >
          {{
            loadingSSH
              ? "Подключение..."
              : languageStore.t("baseComponents.curtain.policy.btn")
          }}
        </button>
      </template>
    </Modal>
  </div>

  <main class="devices_main">
    <MainTitle :msg="languageStore.t('devicePage.title')" />
    <div class="devices_main-icon animate">
      <ComputerIcon />
    </div>
    <!-- <h4 class="devices_main-subtitle animate-base">
      {{ languageStore.t("devicePage.subtitle") }}
    </h4> -->

    <MainButton
      v-if="!loadingBtn"
      @click="handleConnectDeviceClick"
      v-haptic-heavy
      class="custom_styles-button animate-base"
      :class="{ skeleton }"
      :msg="languageStore.t('devicePage.baseBtn')"
      id="connect-device-btn"
    />

    <MainButton
      class="custom_styles-button animate-base"
      v-if="loadingBtn"
      :msg="languageStore.t('devicePage.baseStatus')"
    />

    <div id="bot-banner">
      <BotBanner @showDownloadAlert="showDownloadAlert"></BotBanner>
    </div>

    <section class="devices_block">
      <h4 class="shake_revers" v-if="isTitle">
        {{ languageStore.t("devicePage.deviceListTitle") }}
      </h4>

      <!-- Кнопка перезапуска онбординга -->
      <!-- <div style="margin: 10px">
        <button
          @click="testDevicesOnboarding"
          style="
            padding: 8px 12px;
            background: #b5a4ff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 12px;
          "
        >
          🔄 Перезапуск онбординга
        </button>
        <button
          @click="resetDevicesOnboarding"
          style="
            padding: 8px 12px;
            background: #b5a4ff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 12px;
            margin-left: 10px;
          "
        >
          🔄 Сброс
        </button>
      </div> -->
      <!-- Показываем список устройств -->
      <div v-if="skeleton" :class="{ skeleton }"></div>
      <div v-if="skeleton" :class="{ skeleton }"></div>
      <div v-if="skeleton" :class="{ skeleton }"></div>
      <div v-if="skeleton" :class="{ skeleton }"></div>
      <div v-if="skeleton" :class="{ skeleton }"></div>
      <div v-if="skeleton" :class="{ skeleton }"></div>

      <DeviceItems
        :devices="devices"
        @openModal="openModal"
        @refresh-skeleton="handleRefreshSkeleton"
      />
      
    </section>
  </main>

  <!-- Модальное окно с алертом для скачивания -->
  <DownloadAlertModal
    :show="showDownloadAlertModal"
    :onboarding-active="onboardingActive"
    @close="closeDownloadAlert"
  />

  <!-- Модальное окно "Продолжить знакомство" -->
  <div
    v-if="showContinueModal"
    class="alert-overlay"
    @click="skipDevicesOnboarding"
  >
    <div class="alert-modal continue-modal" @click.stop>
      <div class="alert-content">
        <h3>Продолжить знакомство</h3>
        <p>Давайте продолжим тур и покажем вам, как подключить устройство</p>
        <div class="continue-buttons">
          <button class="continue-btn" @click="continueTour">Продолжить</button>
          <button class="skip-btn" @click="skipDevicesOnboarding">
            Пропустить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
input {
  all: unset;
}

/* Отключаем встроенные иконки браузера для полей пароля */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

input[type="password"]::-webkit-credentials-auto-fill-button,
input[type="password"]::-webkit-strong-password-auto-fill-button {
  display: none !important;
}

/* Убираем стрелочки у числовых полей */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.modal-input-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 3rem;
}

.modal-input-inner label {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-input-inner input {
  background: #2b2b36;
  padding: 10px 6px;
  border-radius: 6px;
  width: 100%;
  margin-left: 8px;
}

.modal-input-button {
  border: 2px solid #816bfa;
  padding: 12px;
  border-radius: 8px;
  text-transform: uppercase;
  background: transparent;
  color: #fff;
  cursor: pointer;
}

.modal-input-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: #666;
}

.skeleton {
  height: 74px;
  margin-bottom: 1rem;
}

.devices_main-icon {
  display: flex;
  justify-content: center;
}

.devices_main-subtitle {
  text-align: center;
}

.custom_styles-button {
  margin-bottom: 1rem;
  background: #816bfa;
  border-radius: 10px;
  padding: 16px 32px;
}

.devices_main-subtitle,
.devices_main h4 {
  color: var(--color-white);
  font-size: var(--size-12);
  line-height: var(--height-16);
  font-weight: var(--font-regular);
  margin-bottom: var(--spacing-8);
  text-wrap: balance;
  margin-bottom: 2rem;
}

.devices_block {
  padding-bottom: 11rem;
}

.devices_block-platforms {
  font-size: var(--size-10);
  font-weight: var(--font-regular);
  line-height: var(--height-16);
  color: var(--color-text-grey);
}

.btn {
  padding: 16px 32px;
  width: 100%;
  border-radius: 7px;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.8rem;
  font-weight: 500;
  text-transform: uppercase;
  background: transparent;
  border: 1px #816bfa solid;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 40px !important;
}

.toggle-btn {
  position: absolute;
  right: 8px;
  top: 7px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  z-index: 10;
  color: #fff;
}

.toggle-btn:hover {
  opacity: 0.8;
}

.success-text {
  margin-bottom: 2rem;
  font-size: 1.4rem;
  line-height: 2rem;
  text-align: center;
  text-wrap: balance;
}

input.error {
  outline: 2px solid red;
  outline-offset: 0;
}

.ssh-alert {
  position: fixed;
  top: 2rem;
  left: 50%;
  background-color: #2b2b36;
  color: white;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: bold;
  z-index: 10001;
  border: 2px solid tomato;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInOut 0.3s ease;
  font-size: 1.2rem;
  line-height: 1.8rem;
  text-align: center;
  width: 30rem;
  transform: translateX(-50%);
}

/* Высокий z-index для модалки чтобы была поверх всего */
.modal-ssh-wrapper {
  z-index: 10000;
  position: relative;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Скрываем элементы Intro.js только когда модалка активна */
body.modal-active .introjs-overlay,
body.modal-active .introjs-tooltip,
body.modal-active .introjs-helperLayer,
.modal-active .introjs-overlay,
.modal-active .introjs-tooltip,
.modal-active .introjs-helperLayer {
  display: none !important;
}

/* Глобальное скрытие Intro.js элементов когда модалка активна */
body.modal-active ~ .introjs-overlay,
body.modal-active ~ .introjs-tooltip,
body.modal-active ~ .introjs-helperLayer,
.introjs-overlay:has(~ body.modal-active),
.introjs-tooltip:has(~ body.modal-active),
.introjs-helperLayer:has(~ body.modal-active) {
  display: none !important;
}

/* Стили для модального окна "Продолжить знакомство" */
.continue-modal {
  max-width: 280px;
}

.continue-modal h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.continue-modal p {
  color: #a6aaae;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 20px;
}

.continue-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.continue-btn {
  background: linear-gradient(135deg, #b5a4ff 0%, #9b7eff 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(181, 164, 255, 0.4);
}

.skip-btn {
  background: transparent;
  border: 1px solid rgba(166, 170, 178, 0.3);
  border-radius: 10px;
  color: #a6aaae;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skip-btn:hover {
  border-color: rgba(181, 164, 255, 0.5);
  color: #b5a4ff;
}

/* Стили для Intro.js в контексте онбординга */
:global(.introjs-overlay) {
  position: fixed !important;
  inset: 0 !important;
  background: black !important;
  opacity: 0.85 !important;
  z-index: 99998 !important;
}

/* Предотвращаем скролл во время онбординга */
:global(.introjs-overlay) ~ body {
  overflow: hidden !important;
}

/* Альтернативный способ - через класс на body */
body.onboarding-active {
  overflow: hidden !important;
  position: fixed !important;
  width: 100% !important;
}

:global(.introjs-fixedTooltip) {
  z-index: 100001 !important;
}

:global(.introjs-helperLayer) {
  background-color: transparent !important;
  border: 3px solid #b5a4ff !important;
  border-radius: 12px !important;
  box-shadow: 0 0 30px rgba(181, 164, 255, 0.5),
    inset 0 0 20px rgba(181, 164, 255, 0.1) !important;
  z-index: 99999 !important;
}

:global(.introjs-disableInteraction) {
  z-index: 99999 !important;
  background-color: transparent !important;
}

:global(.introjs-tooltip) {
  background: #2b2b36 !important;
  color: #ffffff !important;
  border-radius: 14px !important;
  border: 1px solid #b5a4ff !important;
  box-shadow: 0 10px 30px rgba(181, 164, 255, 0.3) !important;
  padding: 20px !important;
  max-width: 300px !important;
  font-family: inherit !important;
}

:global(.introjs-tooltip-title) {
  color: #ffffff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  margin-bottom: 10px !important;
}

:global(.introjs-tooltiptext) {
  color: #e1e1e1 !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}

:global(.introjs-skipbutton:hover) {
  border-color: rgba(181, 164, 255, 0.5) !important;
  color: #b5a4ff !important;
}

:global(.introjs-prevbutton) {
  display: none !important;
}

/* Стили для активных элементов во время онбординга */
.onboarding-active {
  position: relative;
  z-index: 100000 !important;
  pointer-events: auto !important;
}

.pointer-events-none {
  pointer-events: none !important;
  opacity: 0.5;
}
</style>
