import { defineStore } from 'pinia';
import axios from 'axios';
import { useAlertStore } from "@/stores/Alert";

export const usePrivacyStore = defineStore('Privacy', {

    state: () => ({
        userData: null,  // Здесь будет храниться информация о пользователе после успешного запроса
        error: null
    }),
    actions: {
        async getPrivacy(tg) {
            let isAlerted = false
            const alertStore = useAlertStore()

            const data = {
                id: tg.initDataUnsafe.user.id,
            }
            try {
                const response = await axios.post('/users/getPrivacy', data);
                this.userData = response.data;
                return this.userData
            } catch (error) {
                console.log(error);
                
                this.error = error;  // Сохраняем ошибку

                // if (isAlerted === false) {
                //     alertStore.addAlert(error.message, "error", 5000);
                //     isAlerted = true
                // }

                // setTimeout(() => {
                //     if (isAlerted === true) {
                //         isAlerted = false
                //     }
                // }, 5000);

                throw this.error
            }
        },
    },
});
