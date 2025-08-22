<script setup>
import { useLanguageStore } from "@/stores/languageStore";
import MainButton from "@/components/base/MainButton.vue";
import { defineProps } from "vue";
import { useWalletStore } from "@/stores/walletStore";
import { useCurtainStore } from "@/stores/curtain";

const props = defineProps({
  address: { type: String, required: true },
});

const languageStore = useLanguageStore();
const walletStore = useWalletStore();
const curtainStore = useCurtainStore();

function handleDisconnect() {
  walletStore.disconnectWallet();
  curtainStore.toggleCurtain();
}
</script>

<template>
  <div class="curtain_wallet">
    <div class="curtain_wallet-content">
      <div class="curtain_wallet-address">
        <svg
          width="20"
          height="21"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <rect
            y="0.564087"
            width="18"
            height="18"
            fill="url(#pattern0_3127_9387)"
          />
          <defs>
            <pattern
              id="pattern0_3127_9387"
              patternContentUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <use xlink:href="#image0_3127_9387" transform="scale(0.01)" />
            </pattern>
            <image
              id="image0_3127_9387"
              width="100"
              height="100"
              preserveAspectRatio="none"
              xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEuElEQVR4nO2dXahVRRTHd/ahliJUhiHpk5D1EBG+hPlSoKQWBFEYlaT1UBAEgoEI0YeEEBW9FPdmQvWQRZREPYR9UfhBDxr2QXGNEkpvfqTV9SPzF8Nd1XY6Z5+z713n7LX3rB+ctzNr1pn/npk1s+fMyjLHcRzHcRzHUQU4C5gLrAAGgU+A74BDwPfAW8Ct4Xu6NTv/AswA7gReBvbRHe8B5/9nxRkzwCTgBmA9sBM4zdgYGLsXiQNcCTwkT/Yf6PAXMKfq31YLgIuA24AXgb0lG/oI8C6wFlgIXA5cDFwN7Iq+u6bq32oS4FxgAfA4sEOe3m45BWwDHgXmA+cU1HNPVPbN/v5SwwBzgAeAt4GjJXvBD2EOkIjpwhJ1hl6S56ssVYBpwC3A88CekgL8DrwDPBiGoHEOhXkOZKkAnA1cA6wG3gdOlBThS+BJiagmKvk0OapjJGsywGzgXuB1WYyV4SdgI7AMuKSHC8c8p7MmERZX8gSHJ/nzUs0Px6TnrJae1JfVc+xE1pA1wT/D0PGSIgwBL8hkPLUi/+stCDABWAy8CgyXFGC/lLsbuDQzQG0FCeO49IQyEdGfMnQ9IsPQhMwYtRNENuueKxEVfQ08K73ogsw41EUQYIpMzp32ig4Cm4CVwKysZlAHQYB5wLcdIqKXgGvD+qJqfxsNcD9wsmCLYlVY4VbtZxIAd7V5n/CLTOiTqvYxGYAbZac0ZqCqNULqG30/R0KERd59soG3Wd5DjJAev0nkuFkCl+n9ECS8vInZLZO3cyahTZ7q6TwqWxhOOQ4A1/dCjKtKOuKcuROxXFuQEMYWsVeGtCDctCzN+XWeLJIPtRFlkWaF4QBZO8JO7BS1ymqOvGEM571ifg1bTFqVfNxGjMdUKmggtA6CNmgZ/6aFcT990QEZPfKEkzGzs/EC/BgZHrHyrsIyYbHc4ozYKg3DYVskjx+p7BLg4ajttmgYPRwZXThuo4kAXBG13ZCG0fh9h060kM5B7zzHNYzGmH/LZ4m48dQNAuepeJoI9EEQcwcRkhZExcuEwAWxhQtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFckB4B3Ax8JJcShM+HwNIuyvlurzZyCK4dT3Qo64L0oGd0YklBeRdEExmmOvFBQXkXRBP5/0cnjhaUd0EqEORIQXkXRBOJpjrR9gCcC6IMcFMXgiwuKO89RBtgXYEYhf8CcEF6RAhtQzQlc0r4bCnqGbly3kMs4YIYwwUxhgtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFcEGO4IAkIEt/T61kvq0wII5c55uk6qVbqANOjthvWMPpFZHS+ircJwGhqvzy7NIxuiIw+reJtAjCaliPPYC+OwYTrmmaqeNxggFktbvpeomF4oqSyzvOpVmq6Bt+TtTVqsyG1m5SAO/g/nwGXqVTQvJ6xtUV73a4dvr3RopIwfD0DXBcS+maJwmgy4wUyZ7RKSPCa+nIh3CQniYCdcmwP+RtVxYjGxldKOpQym3p+JaIMX8vGkDA4JfaEOaOvuxohYpDzroOyeCybRLJJDEsbDEib+L2UjuM4juM4juNkdeFvsjzhqvkGS8gAAAAASUVORK5CYII="
            />
          </defs>
        </svg>

        <span class="address">{{ props.address }}</span>
        <span class="status active">{{
          languageStore.t("baseComponents.airdrop.active")
        }}</span>
        <svg
          width="18"
          height="17"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="7.52588"
            cy="7.5"
            r="6.875"
            stroke="white"
            stroke-width="1.25"
          />
          <path
            d="M4.02588 7.31092L6.76874 10L11.1687 5"
            stroke="white"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="curtain_wallet-btn">
      <slot>
        <MainButton
          class="custom-btn"
          :msg="languageStore.t('baseComponents.airdrop.disconnect')"
          @click="handleDisconnect"
        />
      </slot>
    </div>
  </div>
</template>

<style scoped>
.curtain_wallet {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6rem 2rem 3rem;
  min-width: 320px;
}
.custom-btn {
  background: #2b2b36;
  padding: 16px;
  border-radius: 14px;
}
.curtain_wallet-title {
  color: #fff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 2.2rem;
  text-align: center;
}
.curtain_wallet-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
.curtain_wallet-address {
  width: 100%;
  border-radius: 1.4rem;
  display: flex;
  background: linear-gradient(90deg, #7a35db, #1e1e26);
  padding: 1.2rem;
  color: white;
  align-items: center;
}
.curtain_wallet-address .address {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  margin-right: auto;
  margin-left: 0.7rem;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.curtain_wallet-address .status.active {
  color: #b5a4ff;
  font-size: 1rem;
  font-weight: 500;
  margin-right: 0.7rem;
}
.curtain_wallet-btn {
  width: 100%;
}
</style> 