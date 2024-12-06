export class CavyErrorButton {
  private readonly text: string
  private readonly color: string
  private readonly callback: Function

  constructor(text: string, color: string, callback: Function) {
    this.text = text
    this.color = color
    this.callback = callback
  }

  getText() {
    return this.text
  }

  getColor() {
    return this.color
  }

  getCallback() {
    return this.callback
  }
}

export class CavyErrorWindow {
  private readonly error: CavyError
  private buttons: Array<CavyErrorButton> = []

  constructor(error: CavyError) {
    this.error = error
  }

  addButton(button: CavyErrorButton) {
    this.buttons.push(button)
  }

  getButtons() {
    return this.buttons
  }

  getError() {
    return this.error
  }
}

export class CavyError {
  private readonly level: number
  private readonly title: string
  private readonly text: string

  constructor(level: number, title: string, text: string) {
    this.level = level
    this.title = title
    this.text = text
  }

  getLevel() {
    return this.level
  }

  getTitle() {
    return this.title
  }

  getText() {
    return this.text
  }

  toString() {
    if (this.level <= 0) {
      return '[warn] ' + this.title + ' | ' + this.text
    }
    if (this.level <= 8) {
      return '[error] ' + this.title + ' | ' + this.text
    }
    if (this.level >= 9) {
      return '[fatal] ' + this.title + ' | ' + this.text
    }
  }
}
