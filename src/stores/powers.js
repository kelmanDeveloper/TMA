import { defineStore } from 'pinia';
import axios from 'axios';
import { updateTimestamp } from '@/utils/localStorageHelper';

export const usePowersStore = defineStore('powers', {
  state: () => ({
    powers: JSON.parse(localStorage.getItem('allPowers')) || null
  }),
  actions: {
    async getPowers(token) {
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get('/device/getAllComputePowers', { headers });

        if (response.data.success) {
          this.powers = response.data.allPowers;
          updateTimestamp("powersUpdatedTimestamp", response.data.allPowers.updatedTimestamp);
          localStorage.setItem('allPowers', JSON.stringify(response.data.allPowers));
        }

        return response.data.success;
      } catch (error) {
        this.error = error.response ? error.response.data : error.message;
        throw this.error;
      }
    }
  }
});
