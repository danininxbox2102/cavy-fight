<script setup lang="ts">
const data = defineProps(['rank', 'points', 'pointsRequired'])
</script>

<template>
  <div class="rank-body">
    <div class="text-cont">
      <h1 class="rank">{{ data.rank }}</h1>
      <div class="rank-progress-wrap">
        <h2 class="rank-progress">{{ data.points }}</h2>
        <h2 class="rank-goal">/{{ data.pointsRequired }}</h2>
      </div>
    </div>
    <div class="progressbar-body">
      <div class="progressbar-progress"></div>
    </div>
  </div>
</template>

<style scoped>
.rank-body {
  width: fit-content;
  display: flex;
  flex-direction: column;
}

.text-cont {
  display: flex;
  flex-direction: column;
}

.rank-progress-wrap {
  display: flex;
  align-items: center;
}

.rank {
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 20px;
  color: white;
  margin: 0;
}

.rank-progress {
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 10px;
  color: white;
  margin: 2px 0;
}

.rank-goal {
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 10px;
  color: #4e4e4e;
  margin: 2px 0;
}

.progressbar-body {
  position: relative;
  width: 45vw;
  height: 12px;
  border-radius: 4px;
  background: #1a1e29;
}

.progressbar-progress {
  position: absolute;
  width: 53%;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #0014ff, #ff2cdf);
}
</style>
