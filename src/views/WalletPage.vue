<template>
  <main class="wallet-page">
    <MainTitle :msg="languageStore.t('walletPage.title')" />
    <WalletBalance />
    <Airdrop></Airdrop>
    <WithdrawalHistory />
  </main>
</template>

<script setup>
import { useLanguageStore } from "@/stores/languageStore";
import { useWalletStore } from "@/stores/walletStore";
import { useTMAStore } from "@/stores/TMAStore";
import { onMounted } from "vue";
import MainTitle from "@/components/base/MainTitle.vue";
import Airdrop from "@/components/base/Airdrop.vue";
import WalletBalance from "@/components/wallet/WalletBalance.vue";
import WithdrawalHistory from "@/components/wallet/WithdrawalHistory.vue";

const languageStore = useLanguageStore();
const walletStore = useWalletStore();
const TMAStore = useTMAStore();

onMounted(async () => {
  // Проверяем, подключен ли кошелек через TonConnect
  if (walletStore.isConnected && walletStore.address) {
    console.log('[WalletPage] Кошелек подключен, загружаем баланс HT токенов');
    // Загружаем баланс HT токенов из кошелька
    await TMAStore.loadWalletHtBalance();
  } else {
    console.log('[WalletPage] Кошелек не подключен');
  }
});
</script>

<style scoped>
.wallet-page {
  margin: 0 auto;
  padding: 20px 33px;
}

.wallet-info {
  background: rgb(255 255 255 / 4%);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.wallet-balance {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  font-size: 16px;
  color: #fff;
  span:nth-child(2) > span {
    color: #603c94;
  }
}

.wallet-actions {
  margin-top: 20px;
}

.connect-btn,
.disconnect-btn {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connect-btn {
  background: #0088cc;
  color: white;
}

.disconnect-btn {
  background: #cc0000;
  color: white;
}

.connect-btn:hover,
.disconnect-btn:hover {
  opacity: 0.9;
}
</style> 