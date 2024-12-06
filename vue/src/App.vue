<script setup lang="ts">
import { ref } from 'vue'
import { CavyFight } from './assets/js/CavyFight'
import { EventRegistry } from '@/assets/js/events/EventRegistry'
import CriticalErrorWindowCmp from '@/components/errors/CriticalErrorWindowCmp.vue'
import { CavyErrorWindow } from '@/assets/js/visual/CavyError'

const cavyFight = new CavyFight()

const displayedComponent = ref()

const showError = ref(false)
const error = ref<CavyErrorWindow>()

window.addEventListener(EventRegistry.APP_ERROR_EVENT, () => {
  console.log('new error')
  error.value = cavyFight.getDisplayedError()
  showError.value = true
})

cavyFight.appInit()

window.addEventListener(EventRegistry.APP_VIEW_CHANGE_EVENT, () => {
  displayedComponent.value = cavyFight.getView()
})
</script>

<template>
  <CriticalErrorWindowCmp
    v-if="showError"
    v-bind:title="error?.getError().getTitle()"
    v-bind:textHTML="error?.getError().getText()"
    v-bind:buttonText="error?.getButtons()[0].getText()"
    v-bind:button-callback="error?.getButtons()[0].getCallback()"
    v-bind:button-color="error?.getButtons()[0].getColor()"
  ></CriticalErrorWindowCmp>
  <component :is="displayedComponent" />
</template>

<style scoped></style>
