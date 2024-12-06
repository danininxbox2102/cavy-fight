import { AbstractQuest } from '@/assets/js/quests/AbstractQuest'
import * as assert from 'node:assert'
import { QuestRegistry } from '@/assets/js/quests/QuestRegistry'
import { EventRegistry } from '@/assets/js/events/EventRegistry'

export class QuestManager {
  private activeQuests: AbstractQuest[] = []
  private availableQuests: AbstractQuest[] = []
  private completedQuests: AbstractQuest[] = []
  private currentQuest: AbstractQuest | null

  completeQuest(quest: AbstractQuest) {
    const q = this.activeQuests.find((q) => q.getId() === quest.getId())
    if (!q) return
    let i = this.activeQuests.indexOf(quest)
    this.activeQuests.splice(i, 1)
    this.completedQuests.push(q)
    this.currentQuest = null

    quest.onComplete()

    window.dispatchEvent(new Event(EventRegistry.GAME_QUEST_COMPLETED_EVENT))
  }

  startQuest(quest: AbstractQuest, makeMain: boolean) {
    let i = this.availableQuests.indexOf(quest)

    if (i === -1) {
      console.warn(`Failed to start quest ${quest.getId()} is it's not available.`)
      return
    }

    this.availableQuests.splice(i, 1)

    quest.init()
    quest.onStart()
    this.activeQuests.push(quest)
    if (makeMain || !this.currentQuest) {
      this.currentQuest = quest
    }
  }

  checkQuestById(questId: string) {
    const q = this.activeQuests.find((q) => q.getId() === questId)
    if (!q) return
    q.check()
  }

  getActiveQuest(): AbstractQuest | null {
    return this.currentQuest
  }

  makeAvailable(quest: AbstractQuest) {
    this.availableQuests.push(quest)
  }

  initQuests() {
    console.log('[QM] Loading quests')

    if (this.completedQuests.length === 0) {
      console.log('[QM] No completed quests found! Restarting quests')
      const q: AbstractQuest = QuestRegistry.entries[0]
      this.availableQuests.push(q)
      if (q.isAutoTake()) {
        this.startQuest(q, true)
      }
    }
  }
}
