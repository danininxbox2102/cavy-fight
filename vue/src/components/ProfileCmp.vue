<script setup lang="ts">
import RankCmp from './RankCmp.vue'
import QuestCmp from './QuestCmp.vue'
import Loader1Cmp from './misc/Loader1Cmp.vue'
import Loader5Cmp from './misc/Loader5Cmp.vue'
import { ref } from 'vue'

const name = ref()
const team = ref()
const profit = ref()
const profitTxt = ref()

const isAccountLoaded = ref(false)
const isAccPictureLoaded = ref(false)
const isRankLoaded = ref(false)
const isQuestLoaded = ref(false)

window.addEventListener(EventRegistry.APP_INIT_EVENT, async () => {
  isRankLoaded.value = true
  isQuestLoaded.value = true
})

import { CavyFight } from '@/assets/js/CavyFight'
import { EventRegistry } from '@/assets/js/events/EventRegistry'
import { QuestManager } from '@/assets/js/quests/QuestManager'

const cavyFight = CavyFight.getInstance()

window.addEventListener(EventRegistry.APP_INIT_EVENT, async () => {
  let account = await cavyFight.getAccountData()

  if (!account) {
    isAccountLoaded.value = true
    name.value = 'Ошибка загрузки аккаунта'
    return
  }

  isAccountLoaded.value = true
  name.value = account.first_name
  team.value = 'huiteam'
  profit.value = '228K'
})
</script>

<template>
  <div class="profile-container">
    <div class="profile-info">
      <div class="profile-picture">
        <Loader1Cmp v-if="!isAccPictureLoaded"></Loader1Cmp>
      </div>
      <div class="names-wrapper">
        <div class="profile-name">{{ name }} <Loader1Cmp v-if="!isAccountLoaded"></Loader1Cmp></div>
        <div class="profile-team">{{ team }}</div>
      </div>
      <div class="profit-wrapper">
        <div class="profit">{{ profit }}</div>
        <div class="profit-img-wrapper">
          <div class="profit-img"></div>
        </div>
        <div class="profitTxt" v-if="isAccountLoaded">Прибыль в час</div>
      </div>
    </div>
    <div class="profile-bottom">
      <div class="rank-loader" v-if="!(isRankLoaded && isQuestLoaded)">
        <Loader5Cmp></Loader5Cmp>
      </div>
      <RankCmp v-else rank="Новичек" points="4000" pointsRequired="10000" />
      <QuestCmp v-if="isRankLoaded && isQuestLoaded"></QuestCmp>
    </div>
  </div>
</template>

<style scoped>
.profile-bottom {
  display: flex;
}

.profit-img-wrapper {
  position: relative;
  height: 28px;
  width: 28px;
}

.profit-img {
  background-image: url(src/assets/images/profit.png);
  height: 28px;
  width: 28px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  position: absolute;
  bottom: 6px;
  left: 2px;
}

.profitTxt {
  color: #4e4e4e;
  font-size: 10px;
  grid-area: txt;
}

.names-wrapper {
  display: flex;
  flex-direction: column;
  margin: 12px 0 0 12px;
}

.profit-wrapper {
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr;
  gap: 0px 0px;
  grid-template-areas:
    '. .'
    'txt txt';
  margin: 12px 0 0 12px;
}

.profile-container {
  padding: 10px 10px;
}

.rank-loader {
  height: 62px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-picture {
  width: 87px;
  height: 87px;
  border-radius: 18px;
  box-shadow: inset 0px 0px 0px 3px #1a1e29;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  color: white;
}

.profile-team {
  color: #4e4e4e;
  font-size: 18px;
}

.profile-info {
  display: flex;
  align-items: flex-start;
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 21px;
  font-weight: bold;
  color: white;
  justify-content: flex-start;
}

.profile-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
