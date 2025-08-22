<script setup>
import MainTitle from "@/components/base/MainTitle.vue";
import FriendList from "@/components/invite/FriendList.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import { useAuthStore } from "@/stores/authStore";
import { completeInstruction, shouldStartOnboarding } from "@/utils/data";
import introJs from "intro.js";

const languageStore = useLanguageStore();
const authStore = useAuthStore();
const skeleton = ref(true); // Флаг загрузки

// Состояние онбординга
const introStarted = ref(false);
const onboardingActive = ref(false);

// Константы для состояний онбординга
const INVITE_ONBOARDING_STATES = {
  NOT_STARTED: 'not_started',
  STEP_1_INFO: 'step_1_info',
  STEP_2_INVITE_BUTTON: 'step_2_invite_button',
  COMPLETED: 'completed'
};

// Функции для работы с localStorage
const getInviteOnboardingState = () => {
  return localStorage.getItem('TMA-onboarding-invite-state') || INVITE_ONBOARDING_STATES.NOT_STARTED;
};

const setInviteOnboardingState = (state) => {
  localStorage.setItem('TMA-onboarding-invite-state', state);
};

const isInviteOnboardingCompleted = () => {
  return getInviteOnboardingState() === INVITE_ONBOARDING_STATES.COMPLETED;
};

// Функция для блокировки скролла во время онбординга
const preventScrollDuringOnboarding = () => {
  const appElement = document.getElementById('app');
  if (!appElement) return;
  
  if (introStarted.value) {
    appElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('onboarding-active');
  } else {
    appElement.style.overflow = 'auto';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.classList.remove('onboarding-active');
  }
};

// Запуск онбординга
const startInviteOnboarding = async () => {
  // Проверяем, не завершен ли уже онбординг
  if (isInviteOnboardingCompleted()) {
    return;
  }

  introStarted.value = true;
  setInviteOnboardingState(INVITE_ONBOARDING_STATES.STEP_1_INFO);

  // СПЕРВА скролл к верху, ПОТОМ блокировка скролла и онбординг
  document.getElementById('app')?.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Ждем завершения скролла, затем запускаем онбординг
  await new Promise(resolve => setTimeout(resolve, 600)); // Ждем завершения анимации скролла
  
  preventScrollDuringOnboarding();

  // Активируем onboarding состояние
  onboardingActive.value = true;

  // Агрессивно очищаем предыдущие элементы Intro.js
  try {
    const inst = typeof introJs.tour === 'function' ? introJs.tour() : introJs();
    inst.exit();
    const introElements = document.querySelectorAll('.introjs-overlay, .introjs-tooltip, .introjs-helperLayer');
    introElements.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (e) {
    // Предыдущий Intro.js тур не был активен
  }

  try {
  // Шаг 1: Реферальная программа
  const step1 = typeof introJs.tour === 'function' ? introJs.tour() : introJs();
  step1.setOptions({
    exitOnEsc: false,
    exitOnOverlayClick: false,
    showStepNumbers: false,
    showBullets: false,
    showProgress: false,
    scrollToElement: true,
    scrollTo: 'element',
    scrollPadding: 30,
    overlayOpacity: 0.75,
    tooltipPosition: 'auto',
    positionPrecedence: ['bottom', 'top', 'right', 'left'],
    disableInteraction: true,
    hidePrev: true,
    hideNext: false,
    nextLabel: 'Далее →',
    doneLabel: '→',
    showSkipButton: false,
    skipLabel: "Пропустить",
    helperElementPadding: 10,
    highlightClass: 'introjs-highlight',
    steps: [
      {
        element: 'body',
        intro: languageStore.t('tutorial.invitePage.referralProgram.intro'),
        title: languageStore.t('tutorial.invitePage.referralProgram.title'),
        position: 'center',
      }
    ]
  });

  // Подключаем обработчик для перемещения и обработки Skip-кнопки
  let skipObserver = null;
  const attachSkipClassWatcher = () => {
    const tagAndMove = () => {
      document.querySelectorAll('.introjs-skipbutton').forEach((btn) => {
        // Класс для стилизации
        btn.classList.add('hn-skip');
        // Переносим кнопку внутрь панели кнопок текущего тултипа
        const tooltip = btn.closest('.introjs-tooltip');
        const buttonsBar = tooltip ? tooltip.querySelector('.introjs-tooltipbuttons') : null;
        if (buttonsBar && btn.parentElement !== buttonsBar) {
          try { buttonsBar.insertBefore(btn, buttonsBar.firstChild || null); } catch (_) {}
        }
        // Принудительно перехватываем клик по Skip ПЕРЕД обработкой Intro.js
        if (!btn.dataset.hnBound) {
          btn.addEventListener('click', (e) => {
            // Останавливаем всплытие событий к Intro.js
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Принудительно вызываем exit вместо complete
            setTimeout(() => {
              try { step1.exit(); } catch (_) {}
            }, 0);
            
            return false;
          }, true); // Фаза захвата для приоритета перед Intro.js
          btn.dataset.hnBound = '1';
        }
      });
    };
    // Мгновенно пометить/перенести, если кнопка уже есть
    tagAndMove();
    // Дальше отслеживаем появление/перерисовку
    skipObserver = new MutationObserver(() => tagAndMove());
    skipObserver.observe(document.body, { childList: true, subtree: true });
  };

  step1.onafterchange(() => {
    if (!skipObserver) attachSkipClassWatcher();
  });
  step1.oncomplete(() => {
    // Переходим ко второму шагу
    startStep2();
  });
  step1.onexit(() => {
    // Завершаем весь онбординг и отправляем запрос на сервер
    setInviteOnboardingState(INVITE_ONBOARDING_STATES.COMPLETED);
    localStorage.setItem('TMA-onboarding-main-completed', 'true');
    localStorage.setItem('TMA-onboarding-devices-completed', 'true');
    localStorage.setItem('TMA-onboarding-devices-state', 'completed');
    introStarted.value = false;
    onboardingActive.value = false;
    preventScrollDuringOnboarding();
    if (skipObserver) { skipObserver.disconnect(); skipObserver = null; }
    
    // Отправляем запрос на сервер асинхронно
    completeInstruction().catch(error => {
      console.error('❌ Ошибка при завершении инструкции:', error);
    });
  });
  step1.start();

  function startStep2() {
    // Добавляем z-index к кнопке
    const button = document.querySelector('.friend_block-buttons');
    if (button) {
      button.style.zIndex = '100000';
    }

    // Шаг 2: Кнопка приглашения
    const step2 = typeof introJs.tour === 'function' ? introJs.tour() : introJs();
    step2.setOptions({
      exitOnEsc: false,
      exitOnOverlayClick: false,
      showStepNumbers: false,
      showBullets: false,
      showProgress: false,
      scrollToElement: true,
      scrollTo: 'element',
      scrollPadding: 30,
      overlayOpacity: 0.75,
      tooltipPosition: 'auto',
      positionPrecedence: ['bottom', 'top', 'right', 'left'],
      disableInteraction: true,
      hidePrev: true,
      hideNext: false,
      nextLabel: 'Далее →',
      doneLabel: 'OK!',
      showSkipButton: false,
      skipLabel: "Пропустить",
      helperElementPadding: 10,
      highlightClass: 'introjs-highlight',
      steps: [
        {
          element: '.friend_block-buttons .custom_styles-button',
          intro: languageStore.t('tutorial.invitePage.inviteFriends.intro'),
          title: languageStore.t('tutorial.invitePage.inviteFriends.title'),
          position: 'top',
        }
      ]
    });

    // Подключаем обработчик для Skip-кнопки на шаге 2
    let skipObserver2 = null;
    const attachSkipClassWatcher2 = () => {
      const tagAndMove = () => {
        document.querySelectorAll('.introjs-skipbutton').forEach((btn) => {
          btn.classList.add('hn-skip');
          const tooltip = btn.closest('.introjs-tooltip');
          const buttonsBar = tooltip ? tooltip.querySelector('.introjs-tooltipbuttons') : null;
          if (buttonsBar && btn.parentElement !== buttonsBar) {
            try { buttonsBar.insertBefore(btn, buttonsBar.firstChild || null); } catch (_) {}
          }
          if (!btn.dataset.hnBound2) {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              
              // Принудительно вызываем exit вместо complete
              setTimeout(() => {
                try { step2.exit(); } catch (_) {}
              }, 0);
              
              return false;
            }, true);
            btn.dataset.hnBound2 = '1';
          }
        });
      };
      tagAndMove();
      skipObserver2 = new MutationObserver(() => tagAndMove());
      skipObserver2.observe(document.body, { childList: true, subtree: true });
    };

    step2.onafterchange(() => {
      if (!skipObserver2) attachSkipClassWatcher2();
    });
    step2.oncomplete(() => {
      setInviteOnboardingState(INVITE_ONBOARDING_STATES.COMPLETED);
      introStarted.value = false;
      onboardingActive.value = false;
      preventScrollDuringOnboarding();
      
      // Убираем z-index кнопки
      if (button) {
        button.style.zIndex = '';
      }
      if (skipObserver2) { skipObserver2.disconnect(); skipObserver2 = null; }
      
      // Завершаем инструкцию на сервере асинхронно (не ждем ответа)
      completeInstruction().catch(error => {
        console.error('❌ Ошибка при завершении инструкции:', error);
      });
    });
    step2.onexit(() => {
      // Завершаем весь онбординг и отправляем запрос на сервер
      setInviteOnboardingState(INVITE_ONBOARDING_STATES.COMPLETED);
      localStorage.setItem('TMA-onboarding-main-completed', 'true');
      localStorage.setItem('TMA-onboarding-devices-completed', 'true');
      localStorage.setItem('TMA-onboarding-devices-state', 'completed');
      introStarted.value = false;
      onboardingActive.value = false;
      preventScrollDuringOnboarding();
      
      // Убираем z-index кнопки
      if (button) {
        button.style.zIndex = '';
      }
      if (skipObserver2) { skipObserver2.disconnect(); skipObserver2 = null; }
      
      // Отправляем запрос на сервер асинхронно
      completeInstruction().catch(error => {
        console.error('❌ Ошибка при завершении инструкции:', error);
      });
    });
    step2.start();
  }
  } catch (error) {
    console.error('❌ Ошибка при запуске Intro.js тура:', error);
    // При ошибке сбрасываем состояние
    introStarted.value = false;
    onboardingActive.value = false;
    preventScrollDuringOnboarding();
    
    // Убираем z-index кнопки при ошибке
    const button = document.querySelector('.friend_block-buttons');
    if (button) {
      button.style.zIndex = '';
    }
  }
};

// Восстановление состояния онбординга после перезагрузки
const restoreOnboardingState = () => {
  const currentState = getInviteOnboardingState();
  
  if (currentState === INVITE_ONBOARDING_STATES.STEP_1_INFO || 
      currentState === INVITE_ONBOARDING_STATES.STEP_2_INVITE_BUTTON) {
    setTimeout(async () => {
      // await startInviteOnboarding(); // disabled
    }, 1000);
  }
};

// Тестовая функция для перезапуска онбординга
const testOnboarding = async () => {
  localStorage.removeItem('TMA-onboarding-invite-state');
  // await startInviteOnboarding(); // disabled
};

function resetOnboarding() {
  localStorage.removeItem("TMA-onboarding-invite-state");
  localStorage.removeItem("TMA-onboarding-main-completed");
  localStorage.removeItem("TMA-onboarding-devices-completed");
  localStorage.removeItem("TMA-onboarding-devices-state");
}

const handleUpdateSkeleton = () => {
  skeleton.value = false;
};

const handleRefreshSkeleton = () => {
  skeleton.value = true;
};

// Хуки жизненного цикла
// onMounted(() => {
//   // Проверяем, нужно ли запустить онбординг
//   const mainCompleted = localStorage.getItem('TMA-onboarding-main-completed');
//   const devicesCompleted = localStorage.getItem('TMA-onboarding-devices-completed');
  
//   // Используем новую логику: проверяем authStore.instruction и localStorage
//   if (mainCompleted === 'true' && devicesCompleted === 'true' && shouldStartOnboarding('TMA-onboarding-invite-state')) {
//     setTimeout(async () => {
//       await startInviteOnboarding();
//     }, 1000);
//   } else if (!shouldStartOnboarding('TMA-onboarding-invite-state')) {
//     // Если онбординг не нужен (instruction = true или уже пройден), восстанавливаем состояние
//     restoreOnboardingState();
//   }
// });

// onUnmounted(() => {
//   preventScrollDuringOnboarding();
// });


</script>

<template>
  <main class="invite_main">
    <MainTitle :msg="languageStore.t('invitePage.title')" />
    <h4 v-html="languageStore.t('invitePage.subtitle')" class="invite_main-subtitle animate-base">
      
    </h4>
    <FriendList 
      @update-skeleton="handleUpdateSkeleton" 
      @refresh-skeleton="handleRefreshSkeleton" 
    />

    <div v-if="skeleton" :class="{ skeleton }"></div>
    <div v-if="skeleton" :class="{ skeleton }"></div>
    <div v-if="skeleton" :class="{ skeleton }"></div>
    <div v-if="skeleton" :class="{ skeleton }"></div>
    <div v-if="skeleton" :class="{ skeleton }"></div>
    <div v-if="skeleton" :class="{ skeleton }"></div>
    <div v-if="skeleton" :class="{ skeleton }"></div>

    <!-- Тестовая кнопка для онбординга -->
    <!-- <button 
      @click="testOnboarding" 
      style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: #816BFA; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;"
    >
      🎯Тур
    </button>
    <button 
    @click="resetOnboarding" 
    style="position: fixed; top: 10px; right: 70px; z-index: 9999; background: #816BFA; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;"
  >
    🎯Сброс
  </button> -->
  </main>
</template>



<style scoped>
.skeleton {
  width: 100%;
  height: 6.5rem;
  margin-bottom: 1rem;
  border-radius: 1.7rem;
}
.invite_main {
  h1 {
    text-align: center;
    margin: 0 auto 1rem auto;
  }
  .invite_main-subtitle {
    color: white;
    margin-bottom: 2rem;
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
    text-align: center;
    background: linear-gradient(90deg, #816bfa, #4b4bdef0);
    line-height: 1.4;
    border-radius: 14px;
    padding: 10px 0;
  }
  .load {
    h4 {
      margin-bottom: 1rem;
      color: var(--color-white);
      font-size: var(--size-12);
      line-height: var(--height-16);
      font-weight: var(--regular);
      text-transform: uppercase;
    }
    div {
      padding: 3rem;
      box-shadow: 0px 2px 2px 0px #131d29;
      border-radius: 4px;
      background: var(--color-dark-grey);
    }
  }
}

/* Стили для Intro.js онбординга */
:global(.introjs-overlay) {
  position: fixed !important;
  inset: 0 !important;
  background: black !important;
  opacity: 0.85 !important;
  z-index: 99998 !important;
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

</style>
