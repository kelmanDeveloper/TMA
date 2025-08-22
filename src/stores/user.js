import { defineStore } from 'pinia'
import axios from 'axios'
import { updateTimestamp } from '@/utils/localStorageHelper';

export const useGetUserStore = defineStore('user', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('userModel')) || null
  }),
  actions: {
    async getUser(token) {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      try {
        const response = await axios.get('/users/get', { headers })
        if (response.data.success) {
          this.userData = response.data.userModel
          this.accessToken = response.data.accessToken
          this.refreshToken = response.data.refreshToken
          updateTimestamp("getUserUpdatedTimestamp", response.data.updateTimestamp);
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('refreshToken', response.data.refreshToken)
          localStorage.setItem('userModel', JSON.stringify(response.data.userModel))
        }
        return response.data.success
      } catch (error) {
        this.error = error.response ? error.response.data : error.message
        throw this.error
      }
    }
  }
})