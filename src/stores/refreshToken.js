import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

export const useRefreshStore = defineStore('refreshToken', {
    state: () => ({
        friendList: null,
        friendCount: null,
        userBalance: null,
        deviceList: null,
        removeDevice: null,
        bindDevice: null,
        powerList: null,
        leagueList: null,
        LeaderList: null,
    }),
    actions: {
        async refreshToken(refreshToken) { // Передаем router как аргумент
            // const alertStore = useAlertStore()
            const data = {
                refreshToken: refreshToken
            }
            try {
                const response = await axios.post('/users/refresh', data);
                console.log(response);
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                return response.data;
            } catch (error) {
                if (error.response.data.errorCode === 1) {
                    router.push('/');
                }
                console.log(error);
                this.error = error.response ? error.response.data : error.message;
                throw this.error;
            }
        },
    },
})


