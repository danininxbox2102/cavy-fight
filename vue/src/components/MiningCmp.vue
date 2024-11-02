<script setup>
import { ref } from 'vue'

const count = ref(0)

import { CavyFight } from '../assets/js/CavyFight'

const cavyFight = CavyFight.getInstance()

const tap = () => {
  cavyFight.tap()
  count.value = cavyFight.getTapCount()
}

cavyFight.addToInitQueue(() => {
  count.value = cavyFight.getTapCount()
})
</script>

<template>
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
</template>

<style>
.mining-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 60%;
  background: #1a1e29;
  border-radius: 46px 46px 0 0;
  padding: 50px 0 50px 0;
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
  background: url(/src/assets/images/cavy.jpg);
  height: 480px;
  border-radius: 67px;
  aspect-ratio: 1 / 1.9;
  background-position: center;
  background-size: cover;
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
