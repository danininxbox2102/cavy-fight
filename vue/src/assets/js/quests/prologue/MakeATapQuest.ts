import { AbstractQuest } from '@/assets/js/quests/AbstractQuest'
import { EventRegistry } from '@/assets/js/events/EventRegistry'
import { CavyFight } from '@/assets/js/CavyFight'
import { QuestRegistry } from '@/assets/js/quests/QuestRegistry'

export class MakeATapQuest extends AbstractQuest {
  constructor(title: string, description: string, icon: string, id: string) {
    super(title, description, icon, id, 1, true)
  }

  check() {
    let progress = this.getProgress()
    progress++

    this.promoteUpdate()

    this.setProgress(progress)

    if (progress >= 1) {
      this.complete()
      this.eventListener.abort()
      return
    }
  }

  init() {
    window.addEventListener(EventRegistry.GAME_TAP_EVENT, this.check.bind(this), {
      signal: this.eventListener.signal
    })
  }

  onComplete() {
    let questManager = CavyFight.getInstance().getQuestManager()
    questManager.makeAvailable(QuestRegistry.MAKE_10_TAPS)
    questManager.startQuest(QuestRegistry.MAKE_10_TAPS, true)
  }

  onStart(): void {}
}
