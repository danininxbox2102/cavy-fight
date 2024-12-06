<script setup lang="ts">
import ProfileCmp from './ProfileCmp.vue'
import MiningCmp from './MiningCmp.vue'
import MenuCmp from './MenuCmp.vue'

import { CavyFight } from '@/assets/js/CavyFight'
import { ref } from 'vue'
import { EventRegistry } from '@/assets/js/events/EventRegistry'

const cavyFight = CavyFight.getInstance()

const canvas = ref()

window.addEventListener(EventRegistry.APP_INIT_EVENT, () => {
  cavyFight.setupEffectScene(canvas.value)
})
</script>

<template>
  <div class="main-container">
    <canvas ref="canvas" class="effectsViewport"></canvas>
    <ProfileCmp username="Новичек" />
    <MiningCmp />
  </div>
</template>

<style scoped>
.effectsViewport {
  z-index: 999;
  width: 100%;
  height: 100vh;
  position: absolute;
  pointer-events: none;
}

.main-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
