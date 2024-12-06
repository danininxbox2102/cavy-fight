import { AbstractQuest } from '@/assets/js/quests/AbstractQuest'
import { MakeATapQuest } from '@/assets/js/quests/prologue/MakeATapQuest'
import { Make10TapsQuest } from '@/assets/js/quests/prologue/Mine10TapsQuest'

export class QuestRegistry {
  public static entries: AbstractQuest[] = []
  public static MAKE_A_TAP: AbstractQuest = this.register(
    new MakeATapQuest('Тапаем', 'Кликните 1 раз', 'none', 'make_a_tap')
  )
  public static MAKE_10_TAPS: AbstractQuest = this.register(
    new Make10TapsQuest('Тапаем 10 раз', 'Кликните 10 раз', 'none', 'make_10_taps')
  )

  public static register(quest: AbstractQuest): AbstractQuest {
    this.entries.push(quest)
    return quest
  }
}
