import { defineStore } from 'pinia';
import axios from 'axios';
import { updateTimestamp } from '@/utils/localStorageHelper';
import { extractDeviceId } from '@/shared/helpers/deviceId';


export const useDeviceList = defineStore('deviceList', {
    state: () => ({
        deviceList: JSON.parse(localStorage.getItem('deviceList')) || [],
        updateTime: Number(localStorage.getItem('deviceListUpdateTime')) || null,
        allPagesLoaded: JSON.parse(localStorage.getItem('allPagesLoadedDevice')) || false
    }),
    actions: {
        async getDeviceList(token, page) {
            const headers = { Authorization: `Bearer ${token}` }
            const data = { listCount: page }
            try {
                const response = await axios.post('/device/getList', data, { headers });
                if (response.data.success) {
                    if (page === 1) {
                        // Очистка и запись первой страницы
                        this.deviceList = response.data.devices;
                        this.updateTime = response.data.updatedTimestamp;
                        this.allPagesLoaded = false;  // сбрасываем флаг завершения
                    } else if (response.data.devices.length > 0) {
                        // Добавляем следующие страницы в конец массива
                        this.deviceList = [...(this.deviceList || []), ...response.data.devices];
                    } else {
                        // Если пришла пустая страница, то все страницы загружены
                        this.allPagesLoaded = true;
                    }
                    localStorage.setItem('deviceList', JSON.stringify(this.deviceList));
                    localStorage.setItem('allPagesLoadedDevice', JSON.stringify(this.allPagesLoaded));
                    localStorage.setItem('deviceListUpdateTime', this.updateTime);
                    updateTimestamp("deviceListUpdatedTimestamp", response.data.updatedTimestamp)
                }
                return response.data.success
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
                throw this.error
            }
        },
        async removeDevice(deviceId, token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const data = {
                devices: [deviceId],
            };
            try {
                const response = await axios.post('/device/remove', data, { headers });
                if (response.data.success) {
                    const existingList = JSON.parse(localStorage.getItem('deviceList')) || [];

                    // Удаляем устройство по ID
                    const updatedList = existingList.filter(device => device.id !== deviceId);

                    // Сохраняем в localStorage
                    localStorage.setItem('deviceList', JSON.stringify(updatedList));

                    // Обновляем реактивный state
                    this.deviceList = updatedList;
                }
                return response.data.success
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
                throw this.error;
            }
        },
        async activateDevice(deviceId, token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const data = {
                device: deviceId
            };
            try {
                const response = await axios.post('/device/activate', data, { headers });
                return response.data.success
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
                throw this.error;
            }
        },
        async bindDevice(deviceId, token) {
            const cleanId = extractDeviceId(deviceId);
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const data = {
                device: cleanId
            };
            try {
                const response = await axios.post('/device/bind', data, { headers });
                if (response.data.success) {
                    const existingList = JSON.parse(localStorage.getItem('deviceList')) || [];
                    const updatedList = [response.data.device, ...existingList];
                    this.deviceList = updatedList;
                }
                return response.data.success
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
                throw this.error;
            }
        },
        async createFromSSH(token, ip, login, password, port) {

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const data = {
                ip: ip,
                login: login,
                port: port,
                password: password
            };

            try {
                const response = await axios.post('/device/ssh-migrate', data, { headers });

                return response.data;
            } catch (error) {
                this.error = error.status;
                throw this.error;
            }
        }
    },
});
