export class Vector2D {
  private x: number = 0
  private y: number = 0

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

  /**
   * Set x for 2d vector.
   * @param x - Number to set
   */
  setX(x: number) {
    this.x = x
    return this
  }

  /**
   * Set y for 2d vector.
   * @param y - Number to set
   */
  setY(y: number) {
    this.y = y
    return this
  }

  clone() {
    return new Vector2D(this.x, this.y)
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')'
  }

  toJSON() {
    return { x: this.x, y: this.y }
  }

  add(x: number, y: number) {
    this.x += x
    this.y += y
    return this
  }

  addVec(vector: Vector2D) {
    this.x += vector.getX()
    this.y += vector.getY()
    return this
  }

  subtract() {
    this.x -= this.x
    this.y -= this.y
    return this
  }

  subtractVec(vector: Vector2D) {
    this.x -= vector.getX()
    this.y -= vector.getY()
    return this
  }

  reverse() {
    this.x -= this.x
    this.y -= this.y
    return this
  }

  rotate(rads: number) {
    const cos = Math.cos(rads)
    const sin = Math.sin(rads)

    const ox = this.getX()
    const oy = this.getY()

    this.x = ox * cos - oy * sin
    this.y = ox * sin + oy * cos

    return this
  }
}

export class CavyUtils {
  static getMousePosition(canvas: HTMLCanvasElement, event: PointerEvent) {
    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top
    return new Vector2D(x, y)
  }

  static mapToRange(x: number, range: number): number {
    // Используем модуль для получения остатка от деления
    return ((x - 1) % range) + 1
  }

  static msToTime(duration: number): string {
    const milliseconds = Math.floor((duration % 1000) / 100)
    const seconds = Math.floor((duration / 1000) % 60)
    const minutes = Math.floor((duration / (1000 * 60)) % 60)
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

    const formattedHours = hours < 10 ? '0' + hours : String(hours)
    const formattedMinutes = minutes < 10 ? '0' + minutes : String(minutes)
    const formattedSeconds = seconds < 10 ? '0' + seconds : String(seconds)
    const formattedMilliseconds = milliseconds < 10 ? '0' + milliseconds : String(milliseconds)

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`
  }
}
