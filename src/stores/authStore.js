import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        state: () => ({
            userData: JSON.parse(localStorage.getItem('userModel')) || null,
            accessToken: localStorage.getItem('accessToken') || null,
            refreshToken: localStorage.getItem('accessToken') || null,
            instruction: true
        }),
    }),
    actions: {
        async authenticateUser() {
            let userName = null
            if (window.Telegram.WebApp.initDataUnsafe.user.username) {
                userName = window.Telegram.WebApp.initDataUnsafe.user.username
            }

            let refferal = null;
            if (window.Telegram.WebApp.initDataUnsafe.start_param) {
                refferal = Number(window.Telegram.WebApp.initDataUnsafe.start_param.split('start=')[1])
            }
            const data = {
                telegramId: window.Telegram.WebApp.initDataUnsafe.user.id,
                hash: window.Telegram.WebApp.initDataUnsafe.hash,
                initData: window.Telegram.WebApp.initData,
                name: window.Telegram.WebApp.initDataUnsafe.user.first_name && window.Telegram.WebApp.initDataUnsafe.user.last_name
                    ? `${window.Telegram.WebApp.initDataUnsafe.user.first_name} ${window.Telegram.WebApp.initDataUnsafe.user.last_name}`
                    : window.Telegram.WebApp.initDataUnsafe.user.first_name || window.Telegram.WebApp.initDataUnsafe.user.last_name || window.Telegram.WebApp.initDataUnsafe.user.username,
                userName: userName,
                referral: refferal
            }
            try {
                const response = await axios.post('/auth', data)
                if (response.data.success) {
                    // this.instruction = response.data.instruction
                    this.userData = response.data.userModel
                    this.accessToken = response.data.accessToken
                    this.refreshToken = response.data.refreshToken
                    localStorage.setItem('accessToken', response.data.accessToken)
                    localStorage.setItem('refreshToken', response.data.refreshToken)
                    localStorage.setItem('userModel', JSON.stringify(response.data.userModel))
                }
                return response.data.success
            } catch (error) {
                console.log(error);
                throw this.error
            }
        }
    }
})


