<script setup>
import MainTitle from "@/components/base/MainTitle.vue";
import { ref, nextTick, onMounted } from "vue";
import { useLanguageStore } from "@/stores/languageStore";
import LeaderCup from "@/components/rating/LeaderCup.vue";
import LeaderList from "@/components/rating/LeaderList.vue";
import { useCurtainStore } from "@/stores/curtain";
import { useRatingStore } from "@/stores/ratingStore";
import { useBalanceStore } from "@/stores/balance";

const curtainStore = useCurtainStore();
const ratingStore = useRatingStore();
const languageStore = useLanguageStore();
const balanceStore = useBalanceStore();

const leaderboard = ref([]);
const user = ref({});
const loading = ref(true);
const currentLeague = ref(null);
const toMainLeague = ref(null);
let currentRequest = null;

const handleReturnToLeague = (leagueId) => {
  toMainLeague.value = null;
  nextTick(() => {
    toMainLeague.value = leagueId;
  });
};

const handleLeagueUpdate = (leagueId) => {
  if (leagueId) {
    currentLeague.value = leagueId;
    loading.value = true;
    getLeaderList(leagueId);
  } else {
    loading.value = true;
    getLeaderList(currentLeague.value);
  }
};

const getLeaderList = async (leagueId) => {
 
  if (currentRequest) {
    currentRequest.abort = true;
  }
  
  const request = { abort: false };
  currentRequest = request;

  leaderboard.value = [];
  loading.value = true;

  try {
    const result = await ratingStore.getLeaderList(
      localStorage.getItem("accessToken"),
      leagueId
    );

    if (request.abort) {
      return;
    }

    if (result && result.leaderboard) {
      leaderboard.value = result.leaderboard;
    }
  } catch (error) {
    if (!request.abort) {
      console.error("Ошибка при получении списка лидеров:", error);
    }
  } finally {
    if (!request.abort) {
      loading.value = false;
    }
  }
};

function toggleCurtain() {
  curtainStore.setCustomProp("rating");
  curtainStore.toggleCurtain();
}

onMounted(async () => {
  await nextTick();
  if (balanceStore.balanceModel) {
    currentLeague.value = balanceStore.balanceModel.leagueId;
    getLeaderList(currentLeague.value);
  }
});
</script>



<template>
  <main class="rating_main">
    <div class="rating-title">
      <MainTitle :msg="languageStore.t('ratingPage.title')" />
      <svg
        @click="toggleCurtain"
        width="17"
        height="18"
        viewBox="0 0 17 18"
        fill="none"
      >
        <path
          d="M8.24898 0.42804H8.7198C9.89021 0.463235 11.0553 0.729524 12.1148 1.23156C13.9473 2.08853 15.4504 3.62318 16.2692 5.47292C16.7208 6.48064 16.9598 7.57734 17 8.67935V9.14618C16.9605 10.4308 16.6431 11.7105 16.0424 12.8487C15.4381 14.0161 14.5553 15.0377 13.4911 15.8094C12.5388 16.5027 11.4408 16.9954 10.2883 17.2394C9.77268 17.3537 9.24541 17.4058 8.71848 17.428H8.28152C6.89695 17.3879 5.52201 17.015 4.31707 16.33C2.85182 15.5009 1.64189 14.2292 0.890508 12.7222C0.339004 11.6245 0.0425 10.4052 0 9.17872V8.67902C0.0305469 7.9024 0.151738 7.12743 0.386152 6.38534C0.985801 4.44462 2.31725 2.74827 4.04613 1.68544C5.30453 0.9055 6.77078 0.476848 8.24898 0.42804ZM7.7868 1.64958C6.74953 1.75185 5.73451 2.07691 4.83471 2.60284C3.51023 3.3695 2.43645 4.56183 1.81687 5.96134C1.3683 6.96175 1.15514 8.06609 1.19166 9.16146C1.22586 10.3319 1.54992 11.493 2.12766 12.5117C2.58553 13.3241 3.20111 14.0476 3.92859 14.631C4.97018 15.4701 6.24584 16.0152 7.57297 16.1813C9.12754 16.3831 10.7455 16.069 12.1055 15.2878C13.1504 14.6948 14.0456 13.8401 14.6857 12.8231C15.4567 11.6109 15.8525 10.1652 15.809 8.72915C15.7718 7.0607 15.131 5.41614 14.037 4.15708C13.2471 3.23736 12.2244 2.51851 11.0905 2.08919C10.0433 1.6881 8.90209 1.54234 7.7868 1.64958Z"
          fill="#fff"
        />
        <path
          d="M8.37801 4.89155C8.66721 4.85602 8.97401 4.95032 9.18086 5.15883C9.36282 5.3368 9.45379 5.61139 9.38141 5.85975C9.28878 6.19444 8.96903 6.43284 8.63135 6.47467C8.27309 6.52581 7.88329 6.3651 7.69204 6.05233C7.56753 5.85544 7.54694 5.59579 7.64954 5.38528C7.78069 5.10471 8.0752 4.92475 8.37801 4.89155Z"
          fill="#fff"
        />
        <path
          d="M8.147 7.5531C8.45047 7.48735 8.78217 7.49765 9.06639 7.63179C9.23407 7.70948 9.38647 7.86919 9.37319 8.06608C9.37319 9.47058 9.37319 10.8747 9.37286 12.2792C9.37983 12.4572 9.24038 12.597 9.0986 12.6823C8.75993 12.8789 8.32198 12.8902 7.97003 12.7222C7.80235 12.6391 7.63368 12.4858 7.63932 12.2839C7.63932 10.8658 7.63733 9.44767 7.64032 8.02956C7.6453 7.76194 7.91424 7.60489 8.147 7.5531Z"
          fill="#fff"
        />
      </svg>
    </div>

    <LeaderCup
      @update-league="handleLeagueUpdate"
      :lang="languageStore"
      :mainLeague="toMainLeague"
    />

    <LeaderList
      :leaderboard="leaderboard"
      :loading="loading"
      :lang="languageStore"
      @return-to-league="handleReturnToLeague"
    />
  </main>
</template>



<style scoped>
.rating-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3.6rem;
  h1 {
    margin: 0;
  }
}
</style>
