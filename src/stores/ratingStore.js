import { defineStore } from 'pinia';
import axios from 'axios';
import { updateTimestamp } from '@/utils/localStorageHelper';


export const useRatingStore = defineStore('leaderBoard', {
    state: () => ({
        leaguesList: JSON.parse(localStorage.getItem('leagues')) || null,
        currentLeague: null,
    }),
    actions: {
        async getLeagues(token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            try {
                const response = await axios.get('/leagues/leagueList', { headers });
                if (response.data.success) {
                    this.leaguesList = response.data.userLeagues;
                    
                    if (!this.currentLeague && this.leaguesList.length > 0) {
                        this.currentLeague = this.leaguesList[0].leagueId;
                    }
                    
                    updateTimestamp("leaguesListUpdatedTimestamp", response.data.updatedTimestamp);
                    localStorage.setItem('leagues', JSON.stringify(response.data.userLeagues));
                }
                return response.data.success
            } catch (error) {
                this.error = error.response ? error.response.data : error.message;
                throw this.error
            }
        },

        async getLeaderList(token, currentLeague) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
        
            const data = {
                leagueId: currentLeague,
            };
        
            try {
                const response = await axios.post('/leagues/leaderboardList', data, { headers });
                
                return response.data;
            } catch (error) {
                throw this.error;
            }
        },        
        setCurrentLeague(currentLeague) {
            this.currentLeague = currentLeague;
        },
    },
});
