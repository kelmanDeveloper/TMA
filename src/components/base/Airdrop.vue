<template>
    <div class="container">
      <div class="wallet-container" v-if="walletStore.isConnected" @click="openWalletCurtain">
        <div class="wallet-status">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect x="0.129883" width="18" height="18" fill="url(#pattern0_3121_8818)"/>
            <defs>
            <pattern id="pattern0_3121_8818" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_3121_8818" transform="scale(0.01)"/>
            </pattern>
            <image id="image0_3121_8818" width="100" height="100" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEuElEQVR4nO2dXahVRRTHd/ahliJUhiHpk5D1EBG+hPlSoKQWBFEYlaT1UBAEgoEI0YeEEBW9FPdmQvWQRZREPYR9UfhBDxr2QXGNEkpvfqTV9SPzF8Nd1XY6Z5+z713n7LX3rB+ctzNr1pn/npk1s+fMyjLHcRzHcRzHUQU4C5gLrAAGgU+A74BDwPfAW8Ct4Xu6NTv/AswA7gReBvbRHe8B5/9nxRkzwCTgBmA9sBM4zdgYGLsXiQNcCTwkT/Yf6PAXMKfq31YLgIuA24AXgb0lG/oI8C6wFlgIXA5cDFwN7Iq+u6bq32oS4FxgAfA4sEOe3m45BWwDHgXmA+cU1HNPVPbN/v5SwwBzgAeAt4GjJXvBD2EOkIjpwhJ1hl6S56ssVYBpwC3A88CekgL8DrwDPBiGoHEOhXkOZKkAnA1cA6wG3gdOlBThS+BJiagmKvk0OapjJGsywGzgXuB1WYyV4SdgI7AMuKSHC8c8p7MmERZX8gSHJ/nzUs0Px6TnrJae1JfVc+xE1pA1wT/D0PGSIgwBL8hkPLUi/+stCDABWAy8CgyXFGC/lLsbuDQzQG0FCeO49IQyEdGfMnQ9IsPQhMwYtRNENuueKxEVfQ08K73ogsw41EUQYIpMzp32ig4Cm4CVwKysZlAHQYB5wLcdIqKXgGvD+qJqfxsNcD9wsmCLYlVY4VbtZxIAd7V5n/CLTOiTqvYxGYAbZac0ZqCqNULqG30/R0KERd59soG3Wd5DjJAev0nkuFkCl+n9ECS8vInZLZO3cyahTZ7q6TwqWxhOOQ4A1/dCjKtKOuKcuROxXFuQEMYWsVeGtCDctCzN+XWeLJIPtRFlkWaF4QBZO8JO7BS1ymqOvGEM571ifg1bTFqVfNxGjMdUKmggtA6CNmgZ/6aFcT990QEZPfKEkzGzs/EC/BgZHrHyrsIyYbHc4ozYKg3DYVskjx+p7BLg4ajttmgYPRwZXThuo4kAXBG13ZCG0fh9h060kM5B7zzHNYzGmH/LZ4m48dQNAuepeJoI9EEQcwcRkhZExcuEwAWxhQtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFckB4B3Ax8JJcShM+HwNIuyvlurzZyCK4dT3Qo64L0oGd0YklBeRdEExmmOvFBQXkXRBP5/0cnjhaUd0EqEORIQXkXRBOJpjrR9gCcC6IMcFMXgiwuKO89RBtgXYEYhf8CcEF6RAhtQzQlc0r4bCnqGbly3kMs4YIYwwUxhgtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFcEGO4IAkIEt/T61kvq0wII5c55uk6qVbqANOjthvWMPpFZHS+ircJwGhqvzy7NIxuiIw+reJtAjCaliPPYC+OwYTrmmaqeNxggFktbvpeomF4oqSyzvOpVmq6Bt+TtTVqsyG1m5SAO/g/nwGXqVTQvJ6xtUV73a4dvr3RopIwfD0DXBcS+maJwmgy4wUyZ7RKSPCa+nIh3CQniYCdcmwP+RtVxYjGxldKOpQym3p+JaIMX8vGkDA4JfaEOaOvuxohYpDzroOyeCybRLJJDEsbDEib+L2UjuM4juM4juNkdeFvsjzhqvkGS8gAAAAASUVORK5CYII="/>
            </defs>
            </svg>
            
  
          <div>{{ walletStore.address }}</div>
          <svg
            fill="#fff"
            height="12px"
            width="12px"
            version="1.1"
            viewBox="0 0 330 330"
          >
            <path
              d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213  C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  C255,161.018,253.42,157.202,250.606,154.389z"
            />
          </svg>
        </div>
      </div>
      <button v-if="!walletStore.isConnected" class="connect-button" @click="walletStore.connectWallet">
        {{ languageStore.t("baseComponents.airdrop.connectWallet") }}
      </button>
      <!-- <button v-else class="disconnect-button" @click="walletStore.disconnectWallet">
        {{ languageStore.t("baseComponents.airdrop.disconnect") }}
      </button> -->
      <p v-if="walletStore.walletError" class="error-text">{{ walletStore.walletError }}</p>
      <!-- <button
        :class="['action-button', buttonClass]"
        @click="walletStore.isAddressInEntries() ? walletStore.claim : undefined"
        :disabled="!walletStore.isConnected"
      >
        {{ buttonText }}
      </button> -->
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from "vue";
  import { useLanguageStore } from "@/stores/languageStore";
  import { useCurtainStore } from "@/stores/curtain";
  import { useWalletStore } from "@/stores/walletStore";
  
  const languageStore = useLanguageStore();
  const curtainStore = useCurtainStore();
  const walletStore = useWalletStore();
  
  onMounted(() => {
    if (!customElements.get('tc-root')) {
      walletStore.initTonConnect();
    }
  });
  
  function openWalletCurtain() {
    curtainStore.setCustomProp('wallet');
    curtainStore.toggleCurtain();
  }
  
  const buttonClass = computed(() =>
    !walletStore.isConnected ? "gray" : walletStore.isAddressInEntries() ? "green" : "red"
  );
  
  const buttonText = computed(() => {
    if (walletStore.isAddressInEntries()) {
      const entry = walletStore.getEntry();
      return `${languageStore.t("baseComponents.airdrop.claimed")} ${entry?.amount} Jettons`;
    }
    return !walletStore.isConnected
      ? languageStore.t("baseComponents.airdrop.connectWallet")
      : languageStore.t("baseComponents.airdrop.notClaimed");
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .connect-button {
    border-radius: 1.4rem;
    display: flex;
    background: linear-gradient(90deg, #7a35db, #1e1e26);
    padding: 1.2rem;
    color: white;
    align-items: center;
    width: 100%;
    justify-content: center;
  }
  
  .disconnect-button {
    background-color: #ef4444;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }
  
  .wallet-container{
    width: 100%;
  }

  .text {
    text-align: center;
    font-size: 14px;
    color: #e5e7eb;
  }
  
  .action-button {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: white;
  }
  
  .action-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .gray {
    background-color: #6b7280;
  }
  
  .green {
    background-color: #10b981;
  }
  
  .red {
    background-color: #ef4444;
  }
  
  .error-text {
    color: #ef4444;
    font-size: 14px;
    text-align: center;
    margin: 10px 0;
  }
  
  .address-text {
    color: #e5e7eb;
    font-size: 14px;
    text-align: center;
    margin: 10px 0;
  }
  
  .wallet-status {
    border-radius: 1.4rem;
    display: flex;
    background: linear-gradient(90deg, #7a35db, #1e1e26);
    padding: 1.2rem;
    align-items: center;
  }
  
  .wallet-status div {
    font-size: 1rem;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #949494;
  }
  
  .wallet-status svg:first-child {
    margin-right: 1rem;
  }
  
  .wallet-status svg:nth-child(3) {
    margin-left: auto;
    transform: rotate(90deg);
  }
  
  .withdrawal-wallet-btn {
    background: #7a35db;
    padding: 12px 26px;
    border-radius: 20px;
    height: 4.2rem;
    font-size: 14px;
    color: white;
  }
  </style> 