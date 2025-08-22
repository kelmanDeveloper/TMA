import { defineStore } from "pinia";
import { TonClient, Address } from "@ton/ton";
import axios from "axios";

// Константы для настройки запросов
const MAX_RETRIES = 2; // Количество попыток
const INITIAL_RETRY_DELAY = 2000; // Начальная задержка 2 секунды
const TONCENTER_ENDPOINT = 'https://toncenter.com/api/v2/jsonRPC';
const RATE_LIMIT_DELAY = 5000; // 5 секунд задержки при получении 429

export const useTokenStore = defineStore("tokenStore", {
  state: () => ({
    htPriceInUSDT: null,
    priceChange24h: null, // <--- добавлено
    loading: false,
    error: null,
    isApiAvailable: true,
  }),

  actions: {
    // Функция для задержки
    async delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async fetchHTPriceFromGecko() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get(
          "https://api.geckoterminal.com/api/v2/networks/ton/pools/EQDRVn0PRCeLggW7Msw5qAO6b3LQdFl_8f_G9BIpiigdWKWZ"
        );
        const data = res.data.data.attributes;
        
        this.htPriceInUSDT = Number(data.base_token_price_usd);
        this.priceChange24h = Number(data.price_change_percentage.h24);
        this.isApiAvailable = true;
      } catch (error) {
        this.error = error.message || error.toString();
        this.isApiAvailable = false;
      } finally {
        this.loading = false;
      }
    },

    async fetchHTPrice() {
      if (this.loading) {
        return this.htPriceInUSDT;
      }

      this.loading = true;
      this.error = null;

      try {
        const client = new TonClient({
          endpoint: TONCENTER_ENDPOINT,
          apiKey: process.env.VUE_APP_TONCENTER_API_KEY
        });

        const poolAddress = Address.parse('EQDRVn0PRCeLggW7Msw5qAO6b3LQdFl_8f_G9BIpiigdWKWZ');
        
        // Получаем состояние контракта с задержкой между попытками
        let contractState = null;
        let retryCount = 0;
        
        while (retryCount < MAX_RETRIES) {
          try {
            // Добавляем задержку перед каждой попыткой
            if (retryCount > 0) {
              await this.delay(INITIAL_RETRY_DELAY * Math.pow(2, retryCount));
            }
            
            contractState = await client.getContractState(poolAddress);
            break;
          } catch (error) {
            console.log(`Попытка ${retryCount + 1}/${MAX_RETRIES} получить состояние контракта:`, error.message);
            
            if (error.message.includes('429')) {
              console.log(`Получена ошибка 429, ждем ${RATE_LIMIT_DELAY}мс перед следующей попыткой`);
              await this.delay(RATE_LIMIT_DELAY);
              retryCount++;
              continue;
            }
            
            throw error;
          }
        }
        
        if (!contractState) {
          throw new Error('Не удалось получить состояние контракта после всех попыток');
        }
        
        if (contractState.state !== 'active') {
          throw new Error('Контракт пула неактивен');
        }

        // Пробуем получить данные с задержками
        let result = null;
        const possibleMethods = ['get_reserves', 'get_pool_data', 'get_pool_info', 'reserves'];
        
        for (const method of possibleMethods) {
          retryCount = 0;
          while (retryCount < MAX_RETRIES) {
            try {
              // Добавляем задержку перед каждой попыткой
              if (retryCount > 0) {
                await this.delay(INITIAL_RETRY_DELAY * Math.pow(2, retryCount));
              }
              
              console.log(`Пробуем метод: ${method} (попытка ${retryCount + 1}/${MAX_RETRIES})`);
              result = await client.runMethod(poolAddress, method);
              
              if (result.stack && result.stack.items && result.stack.items.length >= 2) {
                console.log(`Метод ${method} вернул данные`);
                break;
              }
              
              throw new Error('Неверный формат данных');
            } catch (methodError) {
              console.log(`Метод ${method} не сработал:`, methodError.message);
              
              if (methodError.message.includes('429')) {
                console.log(`Получена ошибка 429, ждем ${RATE_LIMIT_DELAY}мс перед следующей попыткой`);
                await this.delay(RATE_LIMIT_DELAY);
                retryCount++;
                continue;
              }
              
              break;
            }
          }
          
          if (result && result.stack && result.stack.items && result.stack.items.length >= 2) {
            break;
          }
        }
        
        if (!result || !result.stack || !result.stack.items || result.stack.items.length < 2) {
          throw new Error('Не удалось получить данные из контракта пула');
        }

        // Обработка результата
        const tupleReader = result.stack;
        console.log(tupleReader);
        
        let reserve0, reserve1;
        
        try {
          if (tupleReader.items[0] && typeof tupleReader.items[0].readBigNumber === 'function') {
            reserve0 = tupleReader.items[0].readBigNumber();
            reserve1 = tupleReader.items[1].readBigNumber();
          } else if (tupleReader.readBigNumber) {
            reserve0 = tupleReader.readBigNumber();
            reserve1 = tupleReader.readBigNumber();
          } else if (tupleReader.items[0] && tupleReader.items[0].value) {
            reserve0 = BigInt(tupleReader.items[0].value);
            reserve1 = BigInt(tupleReader.items[1].value);
          } else {
            throw new Error('Не удалось найти способ чтения BigNumber');
          }
        } catch (readError) {
          console.error('Ошибка чтения данных:', readError);
          throw new Error('Не удалось извлечь данные резервов');
        }

        if (reserve0 <= 0 || reserve1 <= 0) {
          throw new Error('Резервы пула пусты');
        }

        const reserve0Number = Number(reserve0) / 1e9;
        const reserve1Number = Number(reserve1) / 1e6;
        
        this.htPriceInUSDT = reserve1Number / reserve0Number;
        this.isApiAvailable = true;

        console.log('Calculated price:', this.htPriceInUSDT);
        return this.htPriceInUSDT;

      } catch (error) {
        this.error = error.message || error.toString();
        console.error('Ошибка при получении цены токена:', error);
        
        if (error.message.includes('Network Error') || error.message.includes('CORS')) {
          this.isApiAvailable = false;
          console.warn('API TON недоступен');
        }
        
        return null;
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    formattedPrice: (state) => state.htPriceInUSDT ? state.htPriceInUSDT.toFixed(6) : '—',
  }
});
