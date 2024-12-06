<script setup lang="ts">
import { CavyFight } from '@/assets/js/CavyFight.ts'

const play = () => {
  CavyFight.getInstance().createNewAccount()
}
</script>

<template>
  <div class="main-container">
    <div class="body-container">
      <div class="logo"></div>
      <div class="footer">
        <div class="text-container">
          <p class="text">Готовы начать свой путь</p>
          <p class="text">в мире крипто инвестиций?</p>
        </div>
        <button class="play-button" @click="play">Начать играть</button>
      </div>
      <div class="gradient"></div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  height: 100%;
  background-size: auto 120%;
  background: url('@/assets/images/cavyPoster.png') center;
}

.gradient {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 400px;
  background: linear-gradient(#0000, #bf3d67);
  z-index: 1;
}

.text-container {
  margin: 0 0 16px 0;
}

.text {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  font-size: 21px;
  font-weight: bold;
  text-align: center;
  margin: 0 0 0 0;
}

.logo {
  background: url('../../assets/images/logoText.png');
  height: 245px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.play-button {
  width: 346px;
  height: 70px;
  background: #f5a261;
  border: 2px solid #db8b4c;
  border-radius: 20px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  font-size: 21px;
  font-weight: bold;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.body-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 95%;
}
</style>
