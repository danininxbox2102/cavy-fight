<script setup lang="ts"></script>

<template>
  <div class="menu-body">
    <div class="menu-item">
      <div
        class="menu-item-img"
        style="
          background-image: url('src/assets/images/menu/main/mmainMiningrig.png');
          background-size: contain;
        "
      ></div>
      <h1 class="menu-item-txt">Майнинг ферма</h1>
    </div>
    <div class="menu-item">
      <div
        class="menu-item-img"
        style="
          background-image: url('src/assets/images/menu/main/mmainQuests.png');
          background-size: contain;
        "
      ></div>
      <h1 class="menu-item-txt">Задания</h1>
    </div>
    <div class="menu-item">
      <div
        class="menu-item-img"
        style="
          background-image: url('src/assets/images/menu/main/mmainTeam.png');
          background-size: contain;
        "
      ></div>
      <h1 class="menu-item-txt">Команда</h1>
    </div>
  </div>
</template>

<style scoped>
.menu-body {
  background: #13151a;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 21px;
  width: 90%;
  padding: 10px 15px;
  position: absolute;
  align-items: center;
  bottom: 10px;
}

.menu-item-img {
  width: 100%;
  height: 45px;
  background-position-x: center;
  background-position-y: bottom;
  background-repeat: no-repeat;
}

.menu-item-txt {
  background-size: cover;
  background-position: center;
  font-family: 'SF PRO TEXT', sans-serif;
  color: white;
  font-size: 10px;
}

.menu-item {
  font-family: 'SF PRO TEXT', sans-serif;
  color: white;
  font-size: 10px;
  text-align: center;
  text-wrap-mode: nowrap;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
