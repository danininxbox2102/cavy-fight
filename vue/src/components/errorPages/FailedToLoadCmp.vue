<script setup></script>

<template>
  <div class="main-container">
    <div class="body-container">
      <div class="text-container">
        <h1 class="text1">Что-то пошло не так!</h1>
        <h1 class="text2">ошибка получения данных из Telegram WebApp API</h1>
      </div>
      <div class="image"></div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.body-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.text-container {
  display: flex;
  flex-direction: column;
}

.text1 {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  font-size: 30px;
  font-weight: bold;
  width: fit-content;
}

.text2 {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: white;
  font-size: 12px;
  font-weight: normal;
  width: fit-content;
}

.image {
  background: url(/src/assets/images/noConnection.png);
  height: 340px;
  aspect-ratio: 1;
  background-size: cover;
}
</style>
