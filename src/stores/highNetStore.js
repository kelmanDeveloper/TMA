import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TonClient } from '@ton/ton';
import { Address, beginCell } from '@ton/core';
import { useWalletStore } from './walletStore';
import axios from 'axios';

// Адрес контракта TMA
const TMA_CONTRACT_ADDRESS = 'kQANWsFLI0kbF_FJ1eMhLYsmw0p2vSjuRjnWSt8tTV7vXc7_';
export const useTMAStore = defineStore('TMA', () => {
    const walletStore = useWalletStore();

    const getTonConnectUI = () => {
        console.log('[TMAStore] getTonConnectUI: Поиск инстанса TonConnectUI...');
        let ui = null;
        if (walletStore.tonConnectUI && typeof walletStore.tonConnectUI.value !== 'undefined') {
            console.log('[TMAStore] getTonConnectUI: Попытка получить из walletStore.tonConnectUI.value');
            ui = walletStore.tonConnectUI.value;
        } else if (walletStore.tonConnectUI) {
            console.log('[TMAStore] getTonConnectUI: Попытка получить из walletStore.tonConnectUI (не ref)');
            ui = walletStore.tonConnectUI;
        } else if (window.tonConnectUI) {
            console.log('[TMAStore] getTonConnectUI: Попытка получить из window.tonConnectUI');
            ui = window.tonConnectUI;
        }

        if (ui && typeof ui.sendTransaction === 'function') {
            console.log('[TMAStore] getTonConnectUI: Инстанс TonConnectUI найден и валиден:', ui);
            return ui;
        } else {
            console.warn('[TMAStore] getTonConnectUI: Инстанс TonConnectUI НЕ найден или НЕ валиден. ui:', ui);
            return null;
        }
    };

    // Состояния
    const isLoading = ref(false);
    const error = ref(null);
    const contractBalance = ref(BigInt(0)); // Баланс в nanoтокенах, доступный для клейма
    const walletHtBalance = ref('0'); // Баланс HT токенов в кошельке
    const isWalletHtLoading = ref(false); // Состояние загрузки баланса HT токенов из кошелька

    const tonClient = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'
    });

    // Форматированный баланс для отображения
    const formattedBalance = computed(() => {
        return (Number(contractBalance.value) / 1e9).toFixed(8).replace(/\.?0+$/, ''); // Делим на 10^9 для отображения
    });

    // Форматированный баланс HT токенов из кошелька
    const formattedWalletHtBalance = computed(() => {
        return walletHtBalance.value;
    });

    // Доступен ли claim
    const canClaim = computed(() => {
        return contractBalance.value > BigInt(0);
    });

    // Загрузка баланса из контракта
    const loadContractBalance = async () => {
        if (!walletStore.address) {
            contractBalance.value = BigInt(0);
            return;
        }

        try {
            isLoading.value = true;
            error.value = null;

            const contractAddress = Address.parse(TMA_CONTRACT_ADDRESS);
            const userAddr = Address.parse(walletStore.address);

            // Получаем баланс для клейма
            const { stack } = await tonClient.runMethod(
                contractAddress,
                'get_user_claim_balance', // Используем новый get-метод
                [{ type: 'slice', cell: beginCell().storeAddress(userAddr).endCell() }]
            );

            const balance = stack.readBigNumber();
            contractBalance.value = balance;

            console.log('TMA баланс для клейма загружен:', {
                balance: formattedBalance.value,
                canClaim: canClaim.value,
                rawBalance: balance.toString()
            });

        } catch (err) {
            console.error('Ошибка загрузки баланса TMA:', err);
            error.value = err.message || 'Ошибка загрузки баланса';
            contractBalance.value = BigInt(0);
        } finally {
            isLoading.value = false;
        }
    };

    // Получение баланса HT токенов из кошелька
    const loadWalletHtBalance = async () => {
        if (!walletStore.address) {
            walletHtBalance.value = '0';
            return;
        }

        try {
            isWalletHtLoading.value = true;
            console.log(`[TMAStore] Запрашиваем джетоны для кошелька: ${walletStore.address}`);
            const response = await axios.get(`https://tonapi.io/v2/accounts/${walletStore.address}/jettons`);
            
            // Ищем HT токены (TMA)
            const htToken = response.data.balances.find(token => 
                token.jetton.name === 'TMA' && token.jetton.symbol === 'HT'
            );

            if (htToken) {
                // Конвертируем баланс из нанотокенов в обычные токены
                const balance = (Number(htToken.balance) / Math.pow(10, htToken.jetton.decimals)).toString();
                walletHtBalance.value = balance;
                console.log('[TMAStore] Баланс HT токенов в кошельке:', balance);
            } else {
                walletHtBalance.value = '0';
                console.log('[TMAStore] HT токены не найдены в кошельке');
            }
        } catch (error) {
            console.error('[TMAStore] Ошибка при получении баланса HT токенов:', error);
            walletHtBalance.value = '0';
        } finally {
            isWalletHtLoading.value = false;
        }
    };

    // Claim токенов
    const claimTokens = async () => {
        console.log('[TMAStore] claimTokens: Начало операции клейма.');
        const tonConnectUI = getTonConnectUI();

        if (!tonConnectUI) {
            console.error('[TMAStore] claimTokens: TonConnect UI не найден или не инициализирован.');
            error.value = 'TonConnect UI не найден. Попробуйте перезагрузить страницу или переподключить кошелек.';
            throw new Error('TonConnect UI не найден. Попробуйте перезагрузить страницу или переподключить кошелек.');
        }

        console.log('[TMAStore] claimTokens: Инстанс TonConnectUI для использования:', tonConnectUI);
        console.log('[TMAStore] claimTokens: tonConnectUI.connected:', tonConnectUI.connected);

        if (typeof tonConnectUI.connected === 'undefined') {
            console.error('[TMAStore] claimTokens: Свойство .connected отсутствует у экземпляра TonConnectUI.');
            error.value = 'Ошибка TonConnect: свойство .connected отсутствует. Попробуйте перезагрузить.';
            throw new Error('Ошибка TonConnect: свойство .connected отсутствует. Попробуйте перезагрузить.');
        }

        if (!tonConnectUI.connected) {
            console.error('[TMAStore] claimTokens: Кошелек не подключен через TonConnect (tonConnectUI.connected === false).');
            error.value = 'Кошелек не подключен через TonConnect. Пожалуйста, подключите кошелек.';
            throw new Error('Кошелек не подключен через TonConnect. Пожалуйста, подключите кошелек.');
        }
        
        if (!canClaim.value) {
            console.warn('[TMAStore] claimTokens: Нет токенов для получения (canClaim.value === false).');
            error.value = 'Нет токенов для получения';
            throw new Error('Нет токенов для получения');
        }
        
        try {
            isLoading.value = true;
            error.value = null;
            
            // Формируем транзакцию
            const payload = beginCell()
                .storeUint(100, 32) // Opcode 100 для claim_tokens
                .storeUint(0, 64) // Query ID
                .endCell();
            
            // Альтернативный вариант с адресом получателя (раскомментируйте для теста):
            // const payload = beginCell()
            //     .storeUint(100, 32) // Opcode 100 для claim_tokens
            //     .storeUint(0, 64) // Query ID
            //     .storeAddress(Address.parse(walletStore.address)) // Адрес получателя
            //     .endCell();
            
       
            const transaction = {
                validUntil: Date.now() + 5 * 60 * 1000, // 5 минут
                messages: [{
                    address: TMA_CONTRACT_ADDRESS,
                    amount: '200000000', // 0.2 TON для газа (из контракта)
                    payload: payload.toBoc().toString('base64')
                }]
            };
            
            console.log('[TMAStore] Полная транзакция:', transaction);
            
            // Отправляем транзакцию через TonConnect
            const result = await tonConnectUI.sendTransaction(transaction);
            
            console.log('Claim транзакция отправлена:', result);
            
            // Обновляем баланс через 5 секунд
            // setTimeout(() => {
            //     loadContractBalance();
            // }, 8000);
            
            return result;
            
        } catch (err) {
            console.error('Ошибка при claim:', err);
            error.value = err.message || 'Ошибка при получении токенов';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        // Состояния
        isLoading,
        error,
        contractBalance,
        walletHtBalance,
        isWalletHtLoading,

        // Вычисляемые
        formattedBalance,
        formattedWalletHtBalance,
        canClaim,

        // Методы
        loadContractBalance,
        loadWalletHtBalance,
        claimTokens
    };
}); 