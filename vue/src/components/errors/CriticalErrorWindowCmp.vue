<script setup lang="ts">
import { ref } from 'vue'

const data = defineProps(['title', 'text', 'textHTML', 'buttonText', 'buttonCallback'])
</script>
<template>
  <div class="background">
    <div class="error-body">
      <div class="text-container">
        <div class="title">
          {{ data.title }}
        </div>
        <div v-if="textHTML" class="text" v-html="textHTML"></div>
        <div v-else class="text">
          {{ data.text }}
        </div>
      </div>
      <hr class="line" />
      <div class="button" @click="buttonCallback()">
        {{ data.buttonText }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  z-index: 999;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.36);
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-body {
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  border-radius: 26px;
  background: rgba(0, 0, 0, 0.6);
}

.text-container {
  user-select: text;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.title {
  text-align: center;
  font-family: 'SF Pro Text', Verdana, sans-serif;
  font-size: 22px;
  width: 256px;
  max-width: 256px;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
}

.text {
  word-break: break-all;
  text-align: center;
  font-family: 'SF Pro Text', Verdana, sans-serif;
  font-size: 15px;
  width: 256px;
  max-width: 256px;
  color: white;
}

.line {
  width: 100%;
  height: 1px;
  background: white;
  margin: 0;
}

.button {
  cursor: pointer;
  font-family: 'SF Pro Text', Verdana, sans-serif;
  font-weight: 400;
  font-size: 22px;
  color: rgba(255, 36, 36, 0.75);
  white-space: pre-line;
  width: 100%;
  height: 3rem;
  text-align: center;
  padding-top: 1rem;
}
</style>
