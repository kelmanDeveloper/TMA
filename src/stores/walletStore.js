import { defineStore } from 'pinia';
import { shallowRef, watchEffect, onUnmounted } from 'vue';
import { Address, toNano } from '@ton/core';
import { TonConnectUI } from '@tonconnect/ui';
import axios from 'axios';
import { useBalanceStore } from '@/stores/balance';
import {
  airdropAddress,
  codeHex,
  dictBase64,
  entries,
} from '@/shared/constants/constants';
import { generateLimitOrderPayload } from '@/shared/helpers/helpers';

export const useWalletStore = defineStore('wallet', () => {
  const tonConnectUI = shallowRef(null);
  const isConnected = shallowRef(false);
  const address = shallowRef(null);
  const walletError = shallowRef(null);
  const isInitialized = shallowRef(false);
  const isBackendSynced = shallowRef(false);
  const balanceStore = useBalanceStore();

  let unsubscribe = null;

  const { address: contractAddress, stateInitBase64, msgBody } = generateLimitOrderPayload({
    airdropAddress: Address.parse(airdropAddress),
    indexFutureOwner: 5n,
    dictHash: dictBase64,
    code: codeHex,
  });

  watchEffect(() => {
    const backendWalletAddress = balanceStore.balanceModel?.wallet;
    if (backendWalletAddress && typeof backendWalletAddress === 'string') {
      isBackendSynced.value = true;
    } else {
      isBackendSynced.value = false;
    }
  });

  async function bindWallet(walletToBind) {
    if (!walletToBind) {
      console.log('❌ Привязка кошелька: адрес для привязки не предоставлен.');
      return false;
    }
    console.log(`[WalletStore] bindWallet called for: ${walletToBind}`);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log('❌ Привязка кошелька: нет accessToken');
        return false;
      }

      console.log('🔄 Привязка кошелька к бэкенду:', walletToBind);
      const response = await axios.post('/users/wallet',
        { wallet: walletToBind },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        await balanceStore.getBalance(token);
        console.log('✅ Кошелек успешно привязан к бэкенду:', walletToBind);
        isBackendSynced.value = true;
        return true;
      }
      console.log('❌ Ошибка при привязке кошелька к бэкенду (success: false)');
      return false;
    } catch (error) {
      console.error('❌ Ошибка при привязке кошелька:', error);
      return false;
    }
  }

  async function unbindWallet() {
    console.log('[WalletStore] unbindWallet called');
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log('❌ Отвязка кошелька: нет accessToken');
        return false;
      }

      console.log('🔄 Отвязка кошелька от бэкенда...');
      const response = await axios.delete('/users/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        await balanceStore.getBalance(token);
        console.log('✅ Кошелек успешно отвязан от бэкенда');
        isBackendSynced.value = false;
        return true;
      }
      console.log('❌ Ошибка при отвязке кошелька от бэкенда (success: false)');
      return false;
    } catch (error) {
      console.error('❌ Ошибка при отвязке кошелька:', error);
      return false;
    }
  }

  async function handleStatusChange(walletInfo) {
    console.log('[WalletStore] handleStatusChange event:', walletInfo);
    const newIsConnected = Boolean(walletInfo?.account?.address);
    let actualAddress = null;

    if (newIsConnected && walletInfo.account.address) {
      try {
        actualAddress = Address.parse(walletInfo.account.address).toString({ bounceable: false });
      } catch (e) {
        console.error('Ошибка парсинга адреса из handleStatusChange:', e);
        actualAddress = walletInfo.account.address;
      }
    }
    
    console.log(`[WalletStore] Status updated by TonConnect: isConnected=${newIsConnected}, address=${actualAddress}`);

    isConnected.value = newIsConnected;
    address.value = actualAddress;
    walletError.value = null;

    const token = localStorage.getItem("accessToken");

    if (newIsConnected && actualAddress && token) {
      console.log('[WalletStore] Кошелек подключен через TonConnect. Проверяем/обновляем привязку на бэкенде.');
      await balanceStore.getBalance(token);
      const serverWallet = balanceStore.balanceModel?.wallet;

      if (serverWallet !== actualAddress) {
        console.log(`[WalletStore] Адрес на бэкенде (${serverWallet}) отличается от подключенного (${actualAddress}).`);
        if (serverWallet) {
            console.log(`[WalletStore] Отвязываем старый кошелек ${serverWallet} с бэкенда.`);
            await unbindWallet();
        }
        console.log(`[WalletStore] Привязываем новый кошелек ${actualAddress} к бэкенду.`);
        await bindWallet(actualAddress);
      } else {
        console.log('[WalletStore] Адрес на бэкенде совпадает с подключенным. Синхронизация ОК.');
        isBackendSynced.value = true;
      }
    } else if (!newIsConnected && token) {
      console.log('[WalletStore] Кошелек отключен от TonConnect. Проверяем, нужно ли отвязать на бэкенде.');
      await balanceStore.getBalance(token); 
      const serverWallet = balanceStore.balanceModel?.wallet;
      if (serverWallet) {
        console.log(`[WalletStore] Кошелек (${serverWallet}) все еще привязан на бэкенде после disconnect TonConnect. Отвязываем.`);
        await unbindWallet();
      } else {
         console.log('[WalletStore] Кошелек не был привязан на бэкенде или уже отвязан.');
      }
      isBackendSynced.value = false; 
    } else {
       isBackendSynced.value = false;
    }
  }

  function initTonConnect() {
    console.log('[WalletStore] initTonConnect called. isInitialized.value:', isInitialized.value);
    if (isInitialized.value && tonConnectUI.value) {
      console.log('[WalletStore] TonConnect UI уже инициализирован. Проверяем состояние...');
      if (tonConnectUI.value.connected && tonConnectUI.value.wallet) {
         console.log('[WalletStore] ...уже подключен. Обновляем статус.');
         handleStatusChange(tonConnectUI.value.wallet);
      } else {
         console.log('[WalletStore] ...не подключен.');
         isConnected.value = false;
         address.value = null;
      }
      return tonConnectUI.value;
    }
    if (typeof window === 'undefined') {
        console.warn('[WalletStore] Попытка инициализации TonConnect UI в среде без window. Пропускаем.');
        return null;
    }

    try {
      console.log('[WalletStore] Попытка создания нового TonConnectUI');
      const ui = new TonConnectUI({
        manifestUrl: `${window.location.origin}/manifest.json`,
      });

      if (unsubscribe) {
        console.log('[WalletStore] Отписка от предыдущего onStatusChange.');
        unsubscribe();
      }

      unsubscribe = ui.onStatusChange(async (walletInfo) => {
        await handleStatusChange(walletInfo);
      });

      tonConnectUI.value = ui;
      window.tonConnectUI = ui; 
      isInitialized.value = true;
      console.log('✅ TonConnect UI инициализирован.');
      
      if (ui.connected && ui.wallet) {
        console.log('[WalletStore] TonConnect UI был подключен сразу после создания. Обновляем статус.');
        handleStatusChange(ui.wallet); 
      } else {
        console.log('[WalletStore] TonConnect UI инициализирован, но не подключен (или wallet info отсутствует).');
        if (!isConnected.value) {
            address.value = null;
        }
      }
      return ui;
    } catch (error) {
      console.error('❌ Ошибка инициализации TonConnect:', error);
      walletError.value = 'Ошибка инициализации кошелька';
      isInitialized.value = false;
      isConnected.value = false; 
      address.value = null;
      return null;
    }
  }

  async function connectWallet() {
    console.log('[WalletStore] connectWallet called');
    let currentTonConnectUI = tonConnectUI.value;
    if (!currentTonConnectUI) {
      console.warn('Попытка подключения до инициализации TonConnectUI. Инициализируем...');
      currentTonConnectUI = initTonConnect();
      if (!currentTonConnectUI) {
         walletError.value = 'Не удалось инициализировать TonConnect для подключения.';
         return;
      }
    }
    try {
      walletError.value = null;
      console.log('🔄 Открытие модального окна подключения TonConnect...');
      if (currentTonConnectUI.connected) {
        console.log('[WalletStore] Кошелек уже подключен. Обновляем статус на всякий случай.');
        await handleStatusChange(currentTonConnectUI.wallet);
      } else {
        await currentTonConnectUI.openModal(); 
      }
    } catch (error) {
      console.error('❌ Ошибка при вызове connectWallet (openModal):', error);
      if (error.message?.includes('Wallet was not connected')) {
        console.log('[WalletStore] Пользователь закрыл модальное окно подключения.');
        return;
      }
      if (error.message?.includes('scheme does not have a registered handler')) {
        walletError.value = 'Для подключения кошелька необходимо установить TON кошелек. Пожалуйста, установите TON кошелек и попробуйте снова.';
      } else {
        walletError.value = 'Ошибка при подключении кошелька. Пожалуйста, попробуйте снова.';
      }
    }
  }

  async function disconnectWallet() {
    console.log('[WalletStore] disconnectWallet called');
    if (tonConnectUI.value?.connected) {
      try {
        console.log('🔄 Отключение кошелька через TonConnect UI...');
        await tonConnectUI.value.disconnect();
      } catch (error) {
        console.error('❌ Ошибка при отключении кошелька:', error);
        walletError.value = 'Ошибка при отключении кошелька.';
        isConnected.value = false;
        address.value = null;
        const token = localStorage.getItem("accessToken");
        if (token) await unbindWallet();
      }
    } else {
      console.log('[WalletStore] Кошелек уже отключен или TonConnect UI не инициализирован. Синхронизируем состояние.');
      isConnected.value = false;
      address.value = null;
      const token = localStorage.getItem("accessToken");
      if (token) {
          await balanceStore.getBalance(token);
          if (balanceStore.balanceModel?.wallet) {
            await unbindWallet();
          }
      }
      isBackendSynced.value = false;
    }
  }
  
  async function initApp() {
    console.log('[WalletStore] initApp called');
    if (!isInitialized.value) {
      initTonConnect();
    } else if (tonConnectUI.value?.connected && tonConnectUI.value?.wallet) {
      console.log('[WalletStore] initApp: TonConnectUI уже инициализирован и подключен, обновляем статус.');
      await handleStatusChange(tonConnectUI.value.wallet);
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('[WalletStore] initApp: Найден accessToken, загружаем баланс пользователя.');
      try {
        await balanceStore.getBalance(token);
      } catch (error) {
        console.error('[WalletStore] initApp: Ошибка при загрузке баланса:', error);
      }
    } else {
      console.log('[WalletStore] initApp: accessToken не найден.');
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      console.log('[WalletStore] Приложение стало видимым.');
      if (isInitialized.value && tonConnectUI.value?.connected && tonConnectUI.value?.wallet) {
        console.log('[WalletStore] Обновляем статус подключения при возвращении в приложение.');
        handleStatusChange(tonConnectUI.value.wallet);
      }
      const token = localStorage.getItem('accessToken');
      if (token) {
        balanceStore.getBalance(token);
      }
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange);

  onUnmounted(() => {
    if (unsubscribe) {
      console.log('[WalletStore] Отписка от onStatusChange при размонтировании.');
      unsubscribe();
    }
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    console.log('[WalletStore] WalletStore размонтирован.');
  });

  function isAddressInEntries() {
    if (!address.value) return false;
    const userAddress = Address.parse(address.value).toString();
    return entries.some((entry) => Address.parse(entry).toString() === userAddress);
  }

  function getEntry() {
    if (!address.value) return null;
    const userAddress = Address.parse(address.value).toString();
    return entries.find((entry) => Address.parse(entry).toString() === userAddress) || null;
  }

  async function claim() {
    if (!tonConnectUI.value?.connected) {
      throw new Error('Кошелек не подключен');
    }
    if (!isAddressInEntries()) {
      throw new Error('Адрес не найден в списке');
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          address: contractAddress.toString(),
          amount: toNano('0.05').toString(),
          stateInit: stateInitBase64,
          payload: msgBody,
        },
      ],
    };

    try {
      const result = await tonConnectUI.value.sendTransaction(transaction);
      console.log('Транзакция отправлена:', result);
      return result;
    } catch (error) {
      console.error('Ошибка при отправке транзакции:', error);
      throw error;
    }
  }

  return {
    tonConnectUI,
    isConnected,
    address,
    walletError,
    isInitialized,
    isBackendSynced,
    initApp,
    connectWallet,
    disconnectWallet,
    bindWallet,
    unbindWallet,
    isAddressInEntries,
    getEntry,
    claim,
  };
}); 