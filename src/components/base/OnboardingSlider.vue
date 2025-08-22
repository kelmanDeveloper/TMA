<template>
  <div class="onboarding-slider" v-if="slides && slides.length">
    <swiper-container
      :slides-per-view="1"
      :space-between="20"
      :centered-slides="true"
      :pagination="{
        enabled: true,
        clickable: true,
        renderBullet: (index, className) => `<span class='${className} custom-bullet'></span>`
      }"
      :effect="'coverflow'"
      :grab-cursor="true"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }"
      :breakpoints="{
        768: {
          slidesPerView: 1.2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 40,
        }
      }"
      @swiperprogress="onProgress"
      @swiperslidechange="onSlideChange"
      ref="swiperRef"
    >
      <swiper-slide v-for="(slide, index) in slides" :key="index">
        <div class="slide-card" :class="[
          `slide-${index + 1}`,
          { 'slide-cta': slide.isCallToAction }
        ]">
          <div class="slide-header">
            <div class="slide-icon">
              <!-- Платформа -->
              <svg v-if="index === 0" height="48" viewBox="0 0 756.57 215.72">
                <path
                  fill="#ce9ffc"
                  d="M67.87,51.15l98.42,56.71-16.4,9.44-23.94-13.79v27.58l-18.21,10.49v-48.56l-21.67-12.49v73.52l-18.2,10.49v-38.86l-21.37-12.32v63.49l-18.21,10.49V28.36l18.2,10.48v53.89l21.38,12.32v-53.9Z"
                />
              </svg>
              <!-- Устройство -->
              <svg v-else-if="index === 1" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="8" width="36" height="24" rx="4" stroke="currentColor" stroke-width="2"/>
                <path d="M20 38H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M24 32V38" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M16 42H32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               
              </svg>
              <!-- Рефералы -->
              <svg v-else-if="index === 2" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M16 28V24C16 20.6863 18.6863 18 22 18H26C29.3137 18 32 20.6863 32 24V28" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="24" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="36" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
                <path d="M8 28V26C8 24.3431 9.34315 23 11 23H13" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M40 28V26C40 24.3431 38.6569 23 37 23H35" 
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <!-- Обзор -->
              <svg v-else-if="index === 3" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="6" width="36" height="34" rx="4" stroke="currentColor" stroke-width="2"/>
                <rect x="26" y="12" width="10" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
                <rect x="12" y="12" width="10" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
                <rect x="12" y="21" width="24" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
                <rect x="12" y="30" width="24" height="4" rx="2" stroke="currentColor" stroke-width="2"/>
              </svg>
              <!-- Старт -->
              <svg v-else-if="index === 4" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2"/>
                <path d="M20 16L32 24L20 32V16Z" fill="currentColor"/>
                <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.5"/>
              </svg>
            </div>
            <div class="slide-number">{{ String(index + 1).padStart(2, '0') }}</div>
          </div>
          
          <div class="slide-content">
            <h3 class="slide-title">{{ slide.title }}</h3>
            <p class="slide-description">{{ slide.description }}</p>
          </div>
          
          <div class="slide-features">
            <div 
              v-for="(feature, idx) in slide.features" 
              :key="idx"
              class="feature-tag"
            >
              {{ feature }}
            </div>
          </div>
          
          <!-- Кнопка "Начать зарабатывать" на последнем слайде -->
          <div v-if="slide.isCallToAction" class="cta-button-container">
            <button class="cta-button" @click="completeOnboarding">
              <span>{{ languageStore.t('onboarding.slides.start.button') }}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10H16M16 10L12 6M16 10L12 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="slide-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
    
    <!-- Кастомная пагинация -->
    <!-- <div class="custom-pagination">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="pagination-item"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
      >
        <div class="pagination-dot">
          <div class="dot-progress" :style="{ width: currentSlide === index ? '100%' : '0%' }"></div>
        </div>
        <span class="pagination-label">{{ slide.shortTitle }}</span>
      </div>
    </div>
     -->
    <!-- Навигационные кнопки -->
    <div class="navigation-controls">
      <button 
        class="nav-btn prev-btn" 
        @click="previousSlide"
        :disabled="currentSlide === 0"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="slide-counter">
        <span class="current">{{ currentSlide + 1 }}</span>
        <span class="separator">/</span>
        <span class="total">{{ slidesLength }}</span>
      </div>
      
      <button 
        class="nav-btn next-btn" 
        @click="nextSlide"
        :disabled="currentSlide === slidesLength - 1"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/languageStore'
import { register } from 'swiper/element/bundle'

register()

const router = useRouter();
const languageStore = useLanguageStore();
const emit = defineEmits(['slideChange', 'complete'])

const currentSlide = ref(0)
const swiperRef = ref(null)

const slides = computed(() => [
  {
    title: languageStore.t('onboarding.slides.platform.title'),
    shortTitle: 'Платформа',
    description: languageStore.t('onboarding.slides.platform.description'),
    features: languageStore.t('onboarding.slides.platform.features')
  },
  {
    title: languageStore.t('onboarding.slides.device.title'),
    shortTitle: 'Устройство',
    description: languageStore.t('onboarding.slides.device.description'),
    features: languageStore.t('onboarding.slides.device.features')
  },
  {
    title: languageStore.t('onboarding.slides.referrals.title'),
    shortTitle: 'Рефералы',
    description: languageStore.t('onboarding.slides.referrals.description'),
    features: languageStore.t('onboarding.slides.referrals.features')
  },
  {
    title: languageStore.t('onboarding.slides.overview.title'),
    shortTitle: 'Обзор',
    description: languageStore.t('onboarding.slides.overview.description'),
    features: languageStore.t('onboarding.slides.overview.features')
  },
  {
    title: languageStore.t('onboarding.slides.start.title'),
    shortTitle: 'Старт',
    description: languageStore.t('onboarding.slides.start.description'),
    features: languageStore.t('onboarding.slides.start.features'),
    isCallToAction: true
  }
]);

const slidesLength = computed(() => slides.value?.length || 0);

const onProgress = (e) => {
  const [swiper, progress] = e.detail
  // Можно добавить дополнительные эффекты на основе прогресса
}

const onSlideChange = (e) => {
  const [swiper] = e.detail
  currentSlide.value = swiper.activeIndex
  emit('slideChange', swiper.activeIndex)
}

const goToSlide = (index) => {
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slideTo(index)
  }
}

const nextSlide = () => {
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slideNext()
  }
}

const previousSlide = () => {
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slidePrev()
  }
}

const completeOnboarding = () => {
  localStorage.setItem('onboardingWatched', 'true');
  router.push('/main');
  emit('complete');
}

const handleSlideNextTransitionEnd = () => {
  if (currentSlide.value === slidesLength.value - 1) {
    localStorage.setItem('onboardingWatched', 'true');
    router.push('/main');
    emit('complete');
  }
}

let startX = null;

const handleTouchStart = (e) => {
  if (e.touches && e.touches.length === 1) {
    startX = e.touches[0].clientX;
  }
};
const handleMouseDown = (e) => {
  startX = e.clientX;
};

const handleCustomSwipe = (e) => {
  if (startX === null) return;
  let endX;
  if (e.changedTouches && e.changedTouches.length === 1) {
    endX = e.changedTouches[0].clientX;
  } else {
    endX = e.clientX;
  }
  // Если пользователь свайпнул влево (вперёд) и на последнем слайде
  if (currentSlide.value === slidesLength.value - 1 && startX - endX > 40) {
    localStorage.setItem('onboardingWatched', 'true');
    router.push('/main');
    emit('complete');
  }
  startX = null;
};

onMounted(() => {
  // Инициализация дополнительных эффектов
  setTimeout(() => {
    if (swiperRef.value) {
      swiperRef.value.addEventListener('swiper-slide-change', onSlideChange)
      swiperRef.value.addEventListener('swiper-progress', onProgress)
      swiperRef.value.addEventListener('slideNextTransitionEnd', handleSlideNextTransitionEnd)
      swiperRef.value.addEventListener('touchstart', handleTouchStart);
      swiperRef.value.addEventListener('mousedown', handleMouseDown);
      swiperRef.value.addEventListener('touchend', handleCustomSwipe);
      swiperRef.value.addEventListener('mouseup', handleCustomSwipe);
    }
  }, 100)
})
</script>

<style scoped>
.onboarding-slider {
  height: 100vh; 
  display: flex;
  flex-direction: column;
  /*background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);*/
  /* position: relative; */
  overflow: hidden;
  padding: 0 20px;
  justify-content: center;
}

.onboarding-slider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(109, 161, 220, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(96, 60, 148, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

swiper-container {
  width: 100%;
  /* padding: 2rem 1rem; */
}

.slide-card {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%, 
    rgba(255, 255, 255, 0.03) 100%);
  border-radius: 2rem;
  padding: 2.5rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.15);
  /*backdrop-filter: blur(25px);*/
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}



.slide-1 {
  background: linear-gradient(135deg, 
    rgba(96, 60, 148, 0.15) 0%, 
    rgba(96, 60, 148, 0.08) 100%);
}

.slide-2 {
  background: linear-gradient(135deg, 
    rgba(206, 159, 252, 0.15) 0%, 
    rgba(206, 159, 252, 0.08) 100%);
}

.slide-3 {
  background: linear-gradient(135deg, 
    rgba(115, 103, 240, 0.15) 0%, 
    rgba(115, 103, 240, 0.08) 100%);
}

.slide-4 {
  background: linear-gradient(135deg, 
    rgba(96, 60, 148, 0.15) 0%, 
    rgba(206, 159, 252, 0.08) 100%);
}

.slide-5 {
  background: linear-gradient(135deg, 
    rgba(115, 103, 240, 0.15) 0%, 
    rgba(96, 60, 148, 0.08) 100%);
}

.slide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.slide-icon {
  color: #CE9FFC;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.slide-card:hover .slide-icon {
  opacity: 1;
  transform: scale(1.05);
}

.slide-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.1);
  font-family: 'Rajdhani', sans-serif;
}

.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.slide-title {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.slide-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 2rem;
}

.slide-features {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-tag {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-tag:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.slide-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, 
    rgba(109, 161, 220, 0.1), 
    rgba(96, 60, 148, 0.1));
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 40px;
  height: 40px;
  bottom: 20%;
  left: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Кастомная пагинация */
.custom-pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1rem;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pagination-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.pagination-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.pagination-item.active {
  background: rgba(96, 60, 148, 0.2);
  border-color: rgba(96, 60, 148, 0.5);
}

.pagination-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.dot-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #CE9FFC, #7367F0);
  border-radius: 50%;
  transition: width 0.5s ease;
}

.pagination-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.pagination-item.active .pagination-label {
  color: white;
}

/* Навигационные кнопки */
.navigation-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
}

.nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-btn:hover:not(:disabled) {
  background: rgba(96, 60, 148, 0.2);
  border-color: rgba(96, 60, 148, 0.5);
  transform: scale(1.05);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slide-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 600;
}

.current {
  color: #CE9FFC;
}

.separator {
  color: rgba(255, 255, 255, 0.5);
}

.total {
  color: rgba(255, 255, 255, 0.8);
}

/* Адаптивность */
@media (max-width: 768px) {
  .slide-card {
    padding: 2rem;
    height: calc(100vh - 200px);
  }
  
  .slide-title {
    font-size: 1.5rem;
  }
  
  .slide-description {
    font-size: 1rem;
  }
  
  .custom-pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .pagination-item {
    padding: 0.5rem 0.75rem;
  }
  
  .pagination-label {
    font-size: 0.8rem;
  }
}

/* Анимация появления */
.onboarding-slider {
  animation: slideIn 0.8s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Скрытие стандартной пагинации Swiper */
swiper-container::part(pagination) {
  display: none;
}

/* Call-to-action слайд */
.slide-cta {
  border: 2px solid rgba(96, 60, 148, 0.6);
  box-shadow: 0 0 30px rgba(96, 60, 148, 0.2);
}

.cta-button-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.cta-button {
  background: linear-gradient(135deg, #CE9FFC, #7367F0);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 20px rgba(96, 60, 148, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 12px 30px rgba(96, 60, 148, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.15);
}

.cta-button:active {
  transform: translateY(-1px);
}

/* Дополнительные стили для адаптивности */
@media (max-width: 768px) {
  .cta-button {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
  }
}
</style>