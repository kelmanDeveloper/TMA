import { defineStore } from 'pinia'
import axios from 'axios'

export const useEndInstructionStore = defineStore('endInstruction', {
  actions: {
    async endInstruction(token) {

      const headers = {
        Authorization: `Bearer ${token}`
      }
      try {
        await axios.get('/users/instruction', { headers })
      } catch (error) {
        throw this.error
      }
    }
  }
})