export default {
  db: null,

  // Инициализация базы данных
  async initDB() {
    if (!this.db) {
      const request = indexedDB.open("imageCacheDB", 1);

      return new Promise((resolve, reject) => {
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          db.createObjectStore("images", { keyPath: "url" });
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve();
        };

        request.onerror = () => {
          reject("Ошибка инициализации IndexedDB");
        };
      });
    }
  },

  // Сохранение изображения в кэш
  async saveImage(url, imageBlob) {
    await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");

      const request = store.put({ url, imageBlob });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject("Ошибка сохранения изображения в IndexedDB");
      };
    });
  },

  // Получение изображения из кэша
  async getImage(url) {
    await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");

      const request = store.get(url);

      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve(result.imageBlob);
        } else {
          reject("Изображение не найдено в кэше");
        }
      };

      request.onerror = () => {
        reject("Ошибка получения изображения из IndexedDB");
      };
    });
  },

  // Предзагрузка изображений
  async preloadImages(imageUrls) {
    for (const url of imageUrls) {
      try {
        const imageBlob = await this.getImage(url);
      } catch {
        // Если изображения нет в кэше, загружаем его и сохраняем
        try {
          const response = await fetch(url);
          const imageBlob = await response.blob();
          await this.saveImage(url, imageBlob);
        } catch (error) {
          console.error(`Ошибка при загрузке изображения ${url}:`, error);
        }
      }
    }
  }
};
