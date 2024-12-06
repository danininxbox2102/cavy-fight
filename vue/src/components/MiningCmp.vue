<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

import { CavyFight } from '@/assets/js/CavyFight'
import { EventRegistry } from '@/assets/js/events/EventRegistry'
import MenuCmp from '@/components/MenuCmp.vue'

const cavyFight = CavyFight.getInstance()

const tap = (event: PointerEvent) => {
  cavyFight.tap(event)
  count.value = cavyFight.getTapCount()
}

window.addEventListener(EventRegistry.APP_INIT_EVENT, () => {
  count.value = cavyFight.getTapCount()
})
</script>

<template>
  <div class="mining-wrapper">
    <div @click="tap" class="mining-body">
      <div class="bal-cont">
        <div class="coin-img"></div>
        <div class="ballance">{{ count }}</div>
      </div>
      <div class="cavy-cont">
        <div class="circle"></div>
        <div class="cavy"></div>
      </div>
    </div>
    <MenuCmp />
  </div>
</template>

<style>
.mining-wrapper {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.mining-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 55vh;
  width: 100%;
  background: #1a1e29;
  border-radius: 46px 46px 0 0;
  padding: 50px 0 25px 0;
}

.bal-cont {
  top: 38px;
  z-index: 2;
  display: flex;
  align-items: center;
  position: absolute;
}

.ballance {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 33px;
  font-weight: bold;
  color: white;
}

.cavy-cont {
  display: flex;
  justify-content: center;
  position: relative;
}

.coin-img {
  margin: 0px 8px 0 0;
  width: 33px;
  height: 33px;
  background: url('../assets/images/coin.png');
  background-size: cover;
}

.cavy {
  bottom: 0;
  height: 480px;
  aspect-ratio: 1 / 1.9;
  background: url('../assets/images/cavy0.png') no-repeat center;
  background-size: 75%;
  position: absolute;
}

.circle {
  width: 365px;
  height: 365px;
  border-radius: 365px;
  background: #01c38e;
  -webkit-box-shadow: inset 0px 0px 0px 32px #13d9a3;
  -moz-box-shadow: inset 0px 0px 0px 32px #13d9a3;
  box-shadow: inset 0px 0px 0px 32px #13d9a3;
}
</style>
