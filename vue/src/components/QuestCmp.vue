<script setup lang="ts">
import { CavyFight } from '@/assets/js/CavyFight'
import { EventRegistry } from '@/assets/js/events/EventRegistry'
import { AbstractQuest } from '@/assets/js/quests/AbstractQuest'
import { QuestManager } from '@/assets/js/quests/QuestManager'
import { ref } from 'vue'

const cavyFight = CavyFight.getInstance()

const questIsActive = ref()
const title = ref()
const description = ref()

const progress = ref()
const goal = ref()
const hide = ref(false)

let allowUpdate = true

const updateQuest = () => {
  if (!allowUpdate) return

  const questManager: QuestManager = cavyFight.getQuestManager()
  const quest: AbstractQuest | null = questManager.getActiveQuest()

  if (!quest) {
    questIsActive.value = false
    return
  }

  questIsActive.value = true
  progress.value = quest.getProgress()
  goal.value = '/' + quest.getMaxProgress()
  hide.value = false
  title.value = quest.getTitle()
  description.value = quest.getDescription()
}

window.addEventListener(EventRegistry.GAME_QUEST_COMPLETED_EVENT, () => {
  description.value = '✅ Выполнен'
  progress.value = ''
  goal.value = ''
  allowUpdate = false

  setTimeout(() => {
    console.log('hide')

    hide.value = true
    setTimeout(() => {
      console.log('show')
      allowUpdate = true
      hide.value = false
      updateQuest()
    }, 1000)
  }, 2000)
})

window.addEventListener(EventRegistry.GAME_QUEST_UPDATED_EVENT, () => {
  console.log('[QuestCMP] quest update')
  updateQuest()
})

updateQuest()
</script>

<template>
  <div class="quest-wrapper">
    <div :class="!questIsActive ? 'no-quest tr100' : 'no-quest tr0'">
      <h1 class="no-quest-txt">нет активного задания</h1>
    </div>
    <div :class="hide ? 'quest-body right-999' : 'quest-body right0'" v-if="questIsActive">
      <div class="text-cont">
        <h1 class="quest">{{ title }}</h1>
        <div class="quest-progress-wrap">
          <h2 class="quest-progress">{{ progress }}</h2>
          <h2 class="quest-goal">{{ goal }}</h2>
          <h2 class="quest-desc">
            {{ description }}
          </h2>
        </div>
      </div>
      <div class="progressbar-body">
        <div class="progressbar-progress"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quest-wrapper {
  overflow: hidden;
  position: relative;
  width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
}

.tr100 {
  opacity: 100;
}

.tr0 {
  opacity: 0;
}

.no-quest {
  transition: all ease 2s;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-quest-txt {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 12px;
  color: #4e4e4e;
  margin: 0;
}

.right-999 {
  right: -999px;
}

.right0 {
  right: 0;
}

.quest-body {
  transition: all ease 2s;
  max-width: 192px;
  bottom: 0;

  position: absolute;
  width: fit-content;
  display: flex;
  flex-direction: column;
}

.text-cont {
  max-width: 192px;
  display: flex;
  flex-direction: column;
  height: -webkit-fill-available;
  justify-content: center;
}

.quest-progress-wrap {
  display: flex;
  align-items: center;
}

.quest {
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 20px;
  color: white;
  margin: 0;
}

.quest-progress {
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 10px;
  color: white;
  margin: 2px 0;
}

.quest-goal {
  font-family: 'SF PRO TEXT', sans-serif;
  font-size: 10px;
  color: #4e4e4e;
  margin: 2px 2px 2px 0;
}

.quest-desc {
  max-width: 149px;
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
  background: linear-gradient(90deg, #ffe33f, #f22920);
}
</style>
