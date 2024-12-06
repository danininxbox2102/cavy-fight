import { AbstractQuest } from '@/assets/js/quests/AbstractQuest'
import { EventRegistry } from '@/assets/js/events/EventRegistry'

export class Make10TapsQuest extends AbstractQuest {
  constructor(title: string, description: string, icon: string, id: string) {
    super(title, description, icon, id, 10, true)
  }

  check() {
    let progress = this.getProgress()
    progress++

    this.setProgress(progress)

    this.promoteUpdate()

    if (progress >= 10) {
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

  onComplete(): void {}

  onStart(): void {}
}
