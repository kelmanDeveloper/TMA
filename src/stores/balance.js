import { defineStore } from 'pinia'
import axios from 'axios'
import { updateTimestamp } from '@/utils/localStorageHelper';

export const useBalanceStore = defineStore('balance', {
  state: () => ({
    balanceModel: JSON.parse(localStorage.getItem('balance')) || null,
    isLoading: false,
    error: null
  }),
  actions: {
    async getBalance(token) {
      this.isLoading = true;

      const headers = {
        Authorization: `Bearer ${token}`
      }
      try {
        const response = await axios.get('/users/balance', { headers })
        if (response.data.success) {
          this.balanceModel = response.data.balanceModel
          // console.log(this.balanceModel);
          updateTimestamp("balanceUpdatedTimestamp", response.data.balanceModel.updatedTimestamp);

          localStorage.setItem('balance', JSON.stringify(response.data.balanceModel))
        }
        return response.data.success
      } catch (error) {
        this.error = error.response ? error.response.data : error.message
        throw this.error
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },

    async requestWithdraw(token, amount) {
      try {
        const response = await axios.post(
          "/users/withdraw",
          { amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Успешно отправили заявку на вывод
          setTimeout(() => {
            this.getBalance(token);
          }, 5000);
        }

        return response.data;
      } catch (error) {
        console.error("Ошибка при запросе вывода:", error);
        this.error = error.message;
        throw error;
      }
    }
  }
})