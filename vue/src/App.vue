<script setup>
import { ref } from 'vue'
import { CavyFight } from './assets/js/CavyFight'

const cavyFight = new CavyFight()

const displayedComponent = ref()

cavyFight.appInit()

cavyFight.onViewChange(() => {
  displayedComponent.value = cavyFight.getView()
})
</script>

<template>
  <component :is="displayedComponent" />
</template>

<style scoped></style>
