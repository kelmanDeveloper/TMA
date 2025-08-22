<template>
  <section class="comics">
    <div>
      <!-- Карусель с анимацией появления элементов -->
      <Carousel
        class="animate-scale"
        ref="carouselRef"
        :itemsToShow="1"
        :wrapAround="false"
        :mouseDrag="false"
        :touchDrag="false"
      >
        <!-- Перебираем группы и рендерим их в каждом слайде -->
        <Slide v-for="(group, index) in groupedSlides" :key="index">
          <div class="carousel__group">
            <div v-for="item in group" :key="item" class="carousel__item">
              <img :src="item" alt="img" />
            </div>
          </div>
        </Slide>
      </Carousel>
    </div>

    <div class="navigation animate-scale">
      <!-- Кастомная пагинация -->
      <div class="custom-pagination">
        <span
          v-for="index in 3"
          :key="index"
          :class="[
            'pagination-dot',
            { active: currentSlideGroup === index - 1 },
          ]"
        ></span>
      </div>

      <button v-if="!isLastSlide" @click="next">Вперед</button>
      <button v-else @click="goToNextPage">Начать</button>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";
import { useRouter } from "vue-router";

const slides = [
  "/img/comics/1.webp",
  "/img/comics/2.webp",
  "/img/comics/3.webp",
  "/img/comics/4.webp",
  "/img/comics/5.webp",
  "/img/comics/6.webp",
  "/img/comics/7.webp",
  "/img/comics/8.webp",
  "/img/comics/9.webp",
  "/img/comics/10.webp",
  "/img/comics/11.webp",
  "/img/comics/12.webp",
  "/img/comics/13.webp",
  "/img/comics/14.webp",
  "/img/comics/15.webp",
  "/img/comics/16.webp",
  "/img/comics/17.webp",
  "/img/comics/18.webp",
];

// Функция для разбиения массива на группы по 6 элементов
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const groupedSlides = ref(chunkArray(slides, 6));
const currentSlide = ref(0);
const currentSlideGroup = ref(0);
const isLastSlide = ref(false);
const carouselRef = ref();
const router = useRouter();

// Метод для перехода к следующему слайду
const next = () => {
  if (currentSlide.value < groupedSlides.value.length - 1) {
    carouselRef.value.slideTo(currentSlide.value + 1);
    currentSlide.value += 1;
    updatePagination();
  }
};

// Метод для обновления текущей группы слайдов (пагинация)
const updatePagination = () => {
  currentSlideGroup.value = Math.floor(
    currentSlide.value / (groupedSlides.value.length / 3)
  );
};

// Проверяем, является ли текущий слайд последним
watch(currentSlide, (newSlide) => {
  isLastSlide.value = newSlide === groupedSlides.value.length - 1;
  updatePagination();
});

// Метод для перехода на следующую страницу
const goToNextPage = () => {
  router.push("/main");
  document.querySelector('.comics').style.display = "none"
};
</script>

<style scoped>
.comics {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
  background: #000;
  height: 100dvh;
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Анимация появления издалека */
.animate-scale {
  animation: scaleUp 1s ease-in-out forwards;
  transform-origin: center;
}

@keyframes scaleUp {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.carousel__group {
  height: 80dvh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.carousel__item {
  background: var(--color-chorr);
  padding: 6px;
  width: 90%;
  margin: 0 auto;
  border-radius: 10px;
  transition: transform 0.3s;
}

button {
  background: var(--color-chorr);
  border-radius: 4px;
  transition: 0.1s;
  padding: 10px;
}

button:hover {
  opacity: 0.9;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 18px;
}

.pagination-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #555;
  transition: background-color 0.3s;
}

.pagination-dot.active {
  background-color: #fff;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 5%;
  padding-top: 12px;
  font-size: 20px;
}

img {
  width: 100%;
  border-radius: 4px;
}
</style>
