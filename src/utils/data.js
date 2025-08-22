import { useAuthStore } from "@/stores/authStore";
import { useBalanceStore } from "@/stores/balance";
// import { useGetUserStore } from "@/stores/user";
import { usePowersStore } from "@/stores/powers";
import { useRatingStore } from "@/stores/ratingStore";
import { useFriendList } from "@/stores/friendList";
import { useDeviceList } from "@/stores/deviceList";
import { useRefreshStore } from "@/stores/refreshToken"
import { useRewardsStore } from "@/stores/rewardsStore";
import { useEndInstructionStore } from "@/stores/EndInstruction";

import router from "@/router"
import { extractDeviceId } from "@/shared/helpers/deviceId";


// Флаг для предотвращения множественного выполнения авторизации
let authInProgress = false;
let deviceBindAttempted = false;

export async function getData(currentRoute) {


    if (currentRoute === "/" && !authInProgress) {
        authInProgress = true;
        try {
            await getAuth(router.currentRoute.value.path);
            
            // Проверяем deviceId только один раз
            if (!deviceBindAttempted) {
                deviceBindAttempted = true;
                const startParam = window?.Telegram?.WebApp?.initDataUnsafe?.start_param;
                if (startParam) {
                    const deviceId = extractDeviceId(String(startParam));
                    if (deviceId) {
                        console.log('🔗 Auto-binding device:', deviceId);
                        try { await bindDevices(deviceId); } catch (_) {}
                    }
                }
            }
        } finally {
            authInProgress = false;
        }
    }


    if (currentRoute === "/rating") {
        await getRating()
    }
    if (currentRoute === "/wallet") {
        getBalanceModel()
    }
    if (currentRoute === "/main") {
        try {
            await Promise.all([
                getBalanceModel(),
                getRating(),
                getFriendsCount(),
                getPowers(),
                getRewardsInternal()
            ]);
        } catch (error) {
            console.error('Error loading main page data:', error);
            // Здесь можно добавить обработку ошибок, например, показать уведомление пользователю
        }
    }
}


async function refreshToken(callback) {
    const refreshStore = useRefreshStore();
    try {
        const result = await refreshStore.refreshToken(localStorage.getItem("refreshToken"));
        if (callback) {
            await callback(); // повторяем исходную функцию
        }
    } catch (err) {
        console.error("Не удалось обновить токен:", err);
        // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
        if (router.currentRoute.value.path !== "/") {
            router.push("/");
        }
        // Показываем BaseModal после перенаправления
        setTimeout(() => {
            if (window.showBaseModal) {
                window.showBaseModal(false);
            }
        }, 100);
    }

}


export async function getAuth() {
    const authStore = useAuthStore();
    try {
        const result = await authStore.authenticateUser();

        if (result && location.pathname === '/') {
            // Проверяем, смотрел ли пользователь онбординг
            // const onboardingWatched = localStorage.getItem('onboardingWatched');
            // if (onboardingWatched) {
            // Если смотрел — редиректим сразу
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push('/main');
            // }
            // Если не смотрел — остаёмся на LoadPage.vue, онбординг покажется там
        }
    } catch (error) {
        // Обработка ошибок авторизации
        if (error && error.errorCode && error.errorCode) {
            try {
                await refreshToken(() => getRating());
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                // Показываем BaseModal после перенаправления
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
            }
        } else {
            // Для других ошибок авторизации
            if (router.currentRoute.value.path !== "/") {
                router.push("/");
            }
            // Показываем BaseModal после перенаправления
            setTimeout(() => {
                if (window.showBaseModal) {
                    window.showBaseModal(false);
                }
            }, 100);
        }
    }
}


async function getRating() {
    const ratingStore = useRatingStore();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const currentTime = Date.now();

    const storedUpdateTime = JSON.parse(localStorage.getItem("updateTimestamps")) || { leaguesListUpdatedTimestamp: 0 };
    const leagues = JSON.parse(localStorage.getItem('leagues')) || null;

    const isDataOutdated = !storedUpdateTime.leaguesListUpdatedTimestamp * 1000 || (currentTime - storedUpdateTime.leaguesListUpdatedTimestamp * 1000) > TWENTY_FOUR_HOURS;

    if (!leagues || isDataOutdated) {
        try {
            return await ratingStore.getLeagues(
                localStorage.getItem("accessToken")
            )
        } catch (error) {
            if (error && error.errorCode && error.errorCode === 1) {
                try {
                    await refreshToken(() => getRating());
                } catch (refreshError) {
                    // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                    if (router.currentRoute.value.path !== "/") {
                        router.push("/");
                    }
                    setTimeout(() => {
                        if (window.showBaseModal) {
                            window.showBaseModal(false);
                        }
                    }, 100);
                }
            }
            throw error;
        }
    }
    return true;
}



async function getBalanceModel() {
    const balanceStore = useBalanceStore();
    const THREE_MINUTES = 3 * 60 * 1000;
    const currentTime = Date.now();

    const storedUpdateTime = JSON.parse(localStorage.getItem("updateTimestamps")) || { balanceUpdatedTimestamp: 0 };
    const balanceData = JSON.parse(localStorage.getItem('balance')) || null;

    const isDataOutdated = !storedUpdateTime.balanceUpdatedTimestamp * 1000 || (currentTime - storedUpdateTime.balanceUpdatedTimestamp * 1000) > THREE_MINUTES;

    if (!balanceData || isDataOutdated) {
        try {
            return await balanceStore.getBalance(
                localStorage.getItem("accessToken")
            );
        } catch (error) {
            if (error && error.errorCode && error.errorCode === 1) {
                try {
                    await refreshToken(() => getBalanceModel());
                } catch (refreshError) {
                    // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                    if (router.currentRoute.value.path !== "/") {
                        router.push("/");
                    }
                    setTimeout(() => {
                        if (window.showBaseModal) {
                            window.showBaseModal(false);
                        }
                    }, 100);
                }
            }
            throw error;
        }
    }
    return true;
}


async function getPowers() {
    const powersStore = usePowersStore();
    const THREE_MINUTES = 3 * 60 * 1000;
    const currentTime = Date.now();

    const storedUpdateTime = JSON.parse(localStorage.getItem("updateTimestamps")) || { powersUpdatedTimestamp: 0 };
    const powers = JSON.parse(localStorage.getItem('allPowers')) || null;

    const isDataOutdated = !storedUpdateTime.powersUpdatedTimestamp * 1000 || (currentTime - storedUpdateTime.powersUpdatedTimestamp * 1000) > THREE_MINUTES;

    if (!powers || isDataOutdated) {
        try {
            return await powersStore.getPowers(
                localStorage.getItem("accessToken")
            )
        } catch (error) {
            if (error && error.errorCode && error.errorCode === 1) {
                try {
                    await refreshToken(() => getPowers());
                } catch (refreshError) {
                    // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                    if (router.currentRoute.value.path !== "/") {
                        router.push("/");
                    }
                    setTimeout(() => {
                        if (window.showBaseModal) {
                            window.showBaseModal(false);
                        }
                    }, 100);
                }
            }
            throw error;
        }
    }
    return true;
}


export async function getFriendsCount() {
    const friendList = useFriendList();
    const THREE_MINUTES = 3 * 60 * 1000;
    const currentTime = Date.now();

    const storedUpdateTime = JSON.parse(localStorage.getItem("updateTimestamps")) || { friendListUpdatedTimestamp: 0 };
    const friendCount = JSON.parse(localStorage.getItem('friendCount')) || null;

    const isDataOutdated = !storedUpdateTime.friendListUpdatedTimestamp * 1000 || (currentTime - storedUpdateTime.friendListUpdatedTimestamp * 1000) > THREE_MINUTES;

    if (!friendCount || isDataOutdated) {
        try {
            return await friendList.getFriendsCount(
                localStorage.getItem("accessToken")
            )
        } catch (error) {
            if (error && error.errorCode && error.errorCode === 1) {
                try {
                    await refreshToken(() => getFriendsCount());
                } catch (refreshError) {
                    // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                    if (router.currentRoute.value.path !== "/") {
                        router.push("/");
                    }
                    setTimeout(() => {
                        if (window.showBaseModal) {
                            window.showBaseModal(false);
                        }
                    }, 100);
                }
            }
            throw error;
        }
    }
    return true;
}


export async function getFriendList(page) {
    const friendList = useFriendList();
    try {
        console.log(`Запрашиваем друзей, страница: ${page}`);
        await friendList.getFriendsList(localStorage.getItem("accessToken"), page);
    } catch (error) {
        if (error && error.errorCode && error.errorCode === 1) {
            try {
                await refreshToken(() => getFriendList(page));
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
            }
        }
    }
}



export async function getDeviceList(page) {
    const deviceList = useDeviceList()
    try {
        const result = await deviceList.getDeviceList(
            localStorage.getItem("accessToken"), page
        )
    } catch (error) {
        if (error && error.errorCode && error.errorCode === 1) {
            try {
                await refreshToken(() => getDeviceList(page))
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
            }
        }
    }
}


export async function bindDevices(deviceID) {
    const deviceList = useDeviceList()
    try {
        const result = await deviceList.bindDevice(deviceID, localStorage.getItem("accessToken"))
        return result;
    } catch (error) {
        if (error && error.errorCode && error.errorCode === 1) {
            try {
                return await refreshToken(() => bindDevices(deviceID))
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
            }
        }
        throw error;
    }
}

export async function deleteDevice(deviceID) {
    const deviceList = useDeviceList()
    try {
        await deviceList.removeDevice(deviceID, localStorage.getItem("accessToken"));
    } catch (error) {
        if (error && error.errorCode && error.errorCode === 1) {
            try {
                await refreshToken(() => deleteDevice(deviceID))
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
            }
        }
    }
}

export async function bindSSH(ip, login, password, port) {
    const deviceList = useDeviceList()
    try {
        const result = await deviceList.createFromSSH(
            localStorage.getItem("accessToken"),
            ip,
            login,
            password,
            port
        );
        return result;
    } catch (error) {
        if (error && error.errorCode && error.errorCode === 1) {
            try {
                return await refreshToken(() => bindSSH(ip, login, password, port))
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
            }
        }
        throw error;
    }
}

async function getRewardsInternal() {
    const rewardsStore = useRewardsStore();
    const THREE_MINUTES = 20 * 60 * 1000;
    const currentTime = Date.now();

    const storedUpdateTime = JSON.parse(localStorage.getItem("updateTimestamps")) || { rewardsUpdatedTimestamp: 0 };
    const rewards = JSON.parse(localStorage.getItem('rewards')) || null;

    const isDataOutdated = !storedUpdateTime.rewardsUpdatedTimestamp * 1000 || (currentTime - storedUpdateTime.rewardsUpdatedTimestamp * 1000) > THREE_MINUTES;

    if (!rewards || isDataOutdated) {
        try {
            return await rewardsStore.getRewards(
                localStorage.getItem("accessToken")
            )
        } catch (error) {
            if (error && error.errorCode && error.errorCode === 1) {
                try {
                    await refreshToken(() => getRewardsInternal());
                } catch (refreshError) {
                    // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                    if (router.currentRoute.value.path !== "/") {
                        router.push("/");
                    }
                    setTimeout(() => {
                        if (window.showBaseModal) {
                            window.showBaseModal(false);
                        }
                    }, 100);
                }
            }
            throw error;
        }
    }
    return true;
}

export async function getRewards() {
    return await getRewardsInternal();
}

// Функция для завершения инструкции
export async function completeInstruction() {
    const endInstructionStore = useEndInstructionStore();
    const authStore = useAuthStore();

    try {
        await endInstructionStore.endInstruction(localStorage.getItem("accessToken"));
        // После успешного завершения инструкции обновляем состояние в authStore
        authStore.instruction = true;
        console.log(authStore.instruction);
        return true;
    } catch (error) {
        if (error && error.errorCode && error.errorCode === 1) {
            try {
                await refreshToken(() => completeInstruction());
                return true;
            } catch (refreshError) {
                // Если refreshToken не сработал - перенаправляем на "/" и показываем BaseModal
                if (router.currentRoute.value.path !== "/") {
                    router.push("/");
                }
                setTimeout(() => {
                    if (window.showBaseModal) {
                        window.showBaseModal(false);
                    }
                }, 100);
                return false;
            }
        }
        console.error('Ошибка при завершении инструкции:', error);
        return false;
    }
}

// Функция для проверки, нужно ли запускать онбординг
export function shouldStartOnboarding(localStorageKey) {
    const authStore = useAuthStore();
    const onboardingCompleted = localStorage.getItem(localStorageKey);

    // Запускаем онбординг только если:
    // 1. instruction === false (пользователь еще не прошел инструкцию)
    // 2. И онбординг еще не пройден в localStorage
    return authStore.instruction === false && !onboardingCompleted;
}