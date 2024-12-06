import { CavyFight } from '@/assets/js/CavyFight'
import { EventRegistry } from '@/assets/js/events/EventRegistry'

export abstract class AbstractQuest {
  protected readonly title: string
  protected readonly description: string
  protected isCompleted: boolean
  protected readonly iconUrl: string
  protected icon: HTMLImageElement
  protected readonly id: string
  protected progress: number
  protected readonly maxProgress: number
  protected readonly autoTake: boolean
  protected readonly eventListener = new AbortController()

  constructor(
    title: string,
    description: string,
    iconUrl: string,
    id: string,
    maxProgress: number,
    autoTake: boolean
  ) {
    this.title = title
    this.description = description
    this.isCompleted = false
    this.iconUrl = iconUrl
    this.id = id
    this.maxProgress = maxProgress
    this.progress = 0
    this.autoTake = autoTake
  }

  public getId(): string {
    return this.id
  }

  public getDescription(): string {
    return this.description
  }

  public getTitle(): string {
    return this.title
  }

  public getIconUrl(): string {
    return this.iconUrl
  }

  public getIcon(): HTMLImageElement {
    return this.icon
  }

  public complete() {
    this.isCompleted = true
    CavyFight.getInstance().getQuestManager().completeQuest(this)
  }

  public getProgress(): number {
    return this.progress
  }

  public setProgress(val: number) {
    this.progress = val
  }

  public getMaxProgress(): number {
    return this.maxProgress
  }

  public isAutoTake(): boolean {
    return this.autoTake
  }

  public promoteUpdate() {
    window.dispatchEvent(
      new CustomEvent(EventRegistry.GAME_QUEST_UPDATED_EVENT, {
        detail: { quest: this }
      })
    )
  }

  public abstract init(): void

  public abstract onStart(): void

  public abstract check(): void

  public abstract onComplete(): void
}
