// import router from '@/router'
// import { createApp, defineComponent, h } from 'vue'



// export const TempComponent = defineComponent({
//     render() {
//         return h('div', { class: 'temp-component' }, [
//             h('div', { class: 'profit-title' }, 'Проверка стиля')
//         ]);
//     }
// });


// export function checkImagesLoaded(images) {
//     return new Promise((resolve) => {
//         let loadedCount = 0;
//         const totalImages = images.length;

//         images.forEach((img) => {
//             if (img.complete) {
//                 loadedCount++;
//             } else {
//                 img.addEventListener('load', () => {
//                     loadedCount++;
//                     if (loadedCount === totalImages) {
//                         resolve();
//                     }
//                 });
//             }
//         });

//         if (loadedCount === totalImages) {
//             resolve();
//         }
//     });
// }

// export function checkFontsLoaded(fonts) {
//     return Promise.all(
//         fonts.map((font) => {
//             return document.fonts.load(`1em ${font}`);
//         })
//     );
// }





// function withTimeout(promise, timeoutMs, fallback) {
//     return new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => {
//             fallback(); // Выполняем fallback (принудительный переход)
//             reject(new Error('Operation timed out'));
//         }, timeoutMs);

//         promise
//             .then((result) => {
//                 clearTimeout(timeout);
//                 resolve(result);
//             })
//             .catch((error) => {
//                 clearTimeout(timeout);
//                 reject(error);
//             });
//     });
// }

export async function preloadComponents() {
      await Promise.all([
        import('@/views/DevicesPage.vue'),
        import('@/views/InvitePage.vue'),
        import('@/views/SettingsPage.vue'),
        import('@/views/MainPage.vue'),
        import('@/views/RatingPage.vue'),
      ]);
  }
  

// export async function preloadImagesAndNavigate(to) {
//     const container = document.createElement('div');
//     container.style.display = 'none';
//     document.body.appendChild(container);

//     try {
//         // Создайте временный компонент для загрузки
//         const app = createApp({
//             render: () => h(TempComponent)
//         });
//         app.mount(container);

//         // Загрузка с таймаутом
//         await withTimeout(
//             (async () => {
//                 const images = container.querySelectorAll('img');
//                 await checkImagesLoaded(images);

//                 const fonts = ['WixMadeforDisplay']; // Ваши шрифты
//                 await checkFontsLoaded(fonts);
//             })(),
//             10000, // 10 секунд
//             () => {
//                 console.warn('Forced navigation due to timeout');
//                 router.push(to); // Принудительный переход
//             }
//         );

//         console.log('Resources loaded successfully');
//     } catch (error) {
//         console.error('Error during preload:', error);
//     } finally {
//         document.body.removeChild(container);
//         router.push(to); // Выполните переход на маршрут в любом случае
//     }
// }
