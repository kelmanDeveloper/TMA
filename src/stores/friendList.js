import { defineStore } from 'pinia';
import axios from 'axios';
import { updateTimestamp } from '@/utils/localStorageHelper';


export const useFriendList = defineStore('friendList', {
    state: () => ({
        friendListData: null,
        friendCount: JSON.parse(localStorage.getItem('friendCount')) || null,
        updateTime: Number(localStorage.getItem('friendListUpdateTime')) || null,
        allPagesLoaded: JSON.parse(localStorage.getItem('allPagesLoaded')) || false
    }),
    actions: {
        async getFriendsList(token, page) {
            const headers = { Authorization: `Bearer ${token}` };
            const data = { listCount: page };
            console.log('[FriendList Store] Запрашиваем друзей, страница:', page);
            try {
                const response = await axios.post('/users/friends/friendList', data, { headers });
                console.log('[FriendList Store] Ответ от сервера:', response.data);
                if (response.data.success) {
                    if (page === 1) {
                        // Очистка и запись первой страницы
                        this.friendListData = response.data.friends;
                        this.updateTime = response.data.updatedTimestamp;
                        // Если первая страница содержит менее 10 элементов, вероятно это все данные
                        this.allPagesLoaded = response.data.friends.length < 10;
                    } else if (response.data.friends.length > 0) {
                        // Добавляем следующие страницы в конец массива
                        this.friendListData = [...(this.friendListData || []), ...response.data.friends];
                        this.allPagesLoaded = response.data.friends.length < 10;
                    } else {
                        // Если пришла пустая страница, то все страницы загружены
                        this.allPagesLoaded = true;
                    }
                    localStorage.setItem('friendListData', JSON.stringify(this.friendListData));
                    localStorage.setItem('allPagesLoaded', JSON.stringify(this.allPagesLoaded));
                    localStorage.setItem('friendListUpdateTime', this.updateTime);
                    updateTimestamp("friendListUpdatedTimestamp", response.data.updatedTimestamp);
                }
                return response.data.success;
            } catch (error) {
                console.error('[FriendList Store] Ошибка при загрузке друзей:', error);
                this.error = error.response ? error.response.data : error.message;
                throw this.error;
            }
        },


        async getFriendsCount(token) {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            try {
                const response = await axios.get('/users/friends/friendCount', { headers })
                
                if (response.data.success) {
                    this.friendCount = response.data.friendsCount
                    this.updateTime = response.data.updateTimestamp
                    localStorage.setItem('friendCount', JSON.stringify(response.data.friendsCount))
                    updateTimestamp("friendListUpdatedTimestamp", response.data.updatedTimestamp);
                }
                return response.data.success
            } catch (error) {
                this.error = error.response ? error.response.data : error.message
                throw this.error
            }
        },

        // Метод для загрузки кэшированных данных
        loadCachedData() {
            const cachedData = localStorage.getItem('friendListData');
            if (cachedData) {
                this.friendListData = JSON.parse(cachedData);
                return true;
            }
            return false;
        }
    },
});
