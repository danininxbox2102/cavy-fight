<script setup>
import RankCmp from './RankCmp.vue'
import { ref } from 'vue'

const name = ref(0)

import { CavyFight } from '../assets/js/CavyFight'

const cavyFight = CavyFight.getInstance()

cavyFight.addToInitQueue(async () => {
  let account = await cavyFight.getAccountData()

  console.log('account: ' + JSON.stringify(account))

  name.value = account.first_name
})

let tg = window.Telegram.WebApp
let data = tg.initDataUnsafe

name.value = data.user.first_name
</script>

<template>
  <div class="profile-container">
    <div class="profile-info">
      <div class="profile-picture"></div>
      <div class="profile-name">{{ name }}</div>
    </div>
    <RankCmp rank="Новичек" points="4000" pointsRequired="10000" />
  </div>
</template>

<style scoped>
.profile-container {
  margin: 0px 0 39px 25px;
}

.profile-picture {
  width: 87px;
  height: 87px;
  border-radius: 18px;
  background: wheat;
}

.profile-name {
  color: white;
  margin: 0 0 0 12px;
}

.profile-info {
  display: flex;
  align-items: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 21px;
  font-weight: bold;
  color: white;
}
</style>
