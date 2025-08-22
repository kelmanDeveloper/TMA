import { defineStore } from 'pinia';
import axios from 'axios';

export const useWithdrawalStore = defineStore('withdrawal', {
  state: () => ({
    history: [],
    isLoading: false,
    error: ''
  }),
  actions: {
    async getHistory() {
      this.isLoading = true;
      this.error = '';
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('/users/withdrawal-history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        this.history = res.data.withdrawals || [];
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || 'Error';
      } finally {
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    }
  }
}); 