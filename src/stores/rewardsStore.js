import { defineStore } from 'pinia';
import axios from 'axios';
import { updateTimestamp } from '@/utils/localStorageHelper';

export const useRewardsStore = defineStore('rewards', {
  state: () => ({
    rewards: JSON.parse(localStorage.getItem('rewards')) || null
  }),
  actions: {
    async getRewards(token) {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get('/rewards', { headers });

        if (response.data.success) {
          this.rewards = response.data.rewards;
          updateTimestamp("rewardsUpdatedTimestamp", new Date(response.data.rewards.updatedTime).getTime() / 1000);
          localStorage.setItem('rewards', JSON.stringify(response.data.rewards));
        }
        return response.data.success;
      } catch (error) {
        this.error = error.response ? error.response.data : error.message;
        throw this.error;
      }
    }
  }
}); 