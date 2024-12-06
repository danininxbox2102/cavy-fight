import { CavyUtils, Vector2D } from '@/assets/js/CavyUtils'

export class Scene {
  private objects: Array<EffectObject> = []
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  addObject(obj: EffectObject) {
    this.objects.push(obj)
  }

  getObjects(): Array<EffectObject> {
    return this.objects
  }

  updateAll() {
    this.objects.forEach((obj) => obj.update())
  }

  getCanvas() {
    return this.canvas
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  removeObject(obj: EffectObject) {
    let index: number = this.objects.indexOf(obj)
    this.objects.splice(index, 1)
  }
}

export class EffectObject {
  private x: number = 0
  private y: number = 0
  private speedVec: Vector2D = new Vector2D(0, 0)
  private friction: number = 0
  private width: number
  private height: number
  private readonly scene: Scene
  private selfDestructDelay: number = 60

  constructor(x: number, y: number, friction: number, width: number, height: number, scene: Scene) {
    this.x = x
    this.y = y
    this.friction = friction
    this.width = width
    this.height = height
    this.scene = scene
  }

  getX() {
    return this.x
  }

  getY() {
    return this.y
  }

  setX(x: number) {
    this.x = x
  }

  setY(y: number) {
    this.y = y
  }

  setFriction(value: number) {
    this.friction = value
  }

  setSpeedVector(vec: Vector2D) {
    this.speedVec = vec
  }

  getFriction() {
    return this.friction
  }

  getSpeedVector() {
    return this.speedVec
  }

  applyFriction() {
    let vec = this.getSpeedVector()
    let vX = vec.getX()
    let vY = vec.getY()
    let vX2 = vX - (vX / 10) * this.getFriction()
    let vY2 = vY - (vY / 10) * this.getFriction()
    vec.setX(vX2)
    vec.setY(vY2)
    this.setSpeedVector(vec)
  }

  getAlpha() {
    let vX = this.getSpeedVector().getX()
    let vY = this.getSpeedVector().getY()

    let a = Math.abs(vX + vY)
    if (a > 1) return 1

    return a
  }

  update() {
    if (this.selfDestructDelay <= 0) return this.destruct()

    let x = this.getX()
    let y = this.getY()

    let vec = this.getSpeedVector()
    let vX = vec.getX()
    let vY = vec.getY()

    if (vX == 0 && vY == 0) {
      this.selfDestructDelay--
    }

    if (vX > -0.1 && vX < 0.1) {
      vX = 0
    }
    if (vY > -0.1 && vY < 0.1) {
      vY = 0
    }

    this.setSpeedVector(new Vector2D(vX, vY))

    if (vX != 0 || vY != 0) {
      this.applyFriction()
    }

    x += this.getSpeedVector().getX()
    y += this.getSpeedVector().getY()

    this.setX(x)
    this.setY(y)
  }

  getWidth() {
    return this.width
  }

  getHeight() {
    return this.height
  }

  destruct() {
    this.scene.removeObject(this)
  }
}

export class SpriteFrame {
  private readonly image: HTMLImageElement
  private readonly xOffset: number
  private readonly yOffset: number
  private readonly frameWidth: number
  private readonly frameHeight: number
  private readonly frameIndex: number

  constructor(
    image: HTMLImageElement,
    xOffset: number,
    yOffset: number,
    frameWidth: number,
    frameHeight: number,
    frameIndex: number
  ) {
    this.image = image
    this.xOffset = xOffset
    this.yOffset = yOffset
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
  }

  getImage(): HTMLImageElement {
    return this.image
  }

  getXOffset(): number {
    return this.xOffset
  }

  getYOffset(): number {
    return this.yOffset
  }

  getFrameWidth(): number {
    return this.frameWidth
  }

  getFrameHeight(): number {
    return this.frameHeight
  }

  getFrameIndex(): number {
    return this.frameIndex
  }
}

export class SpriteFrames {
  private readonly image: HTMLImageElement
  private readonly frameWidth: number
  private readonly frameHeight: number
  private readonly textureWidth: number
  private readonly framesCount: number

  constructor(
    image: HTMLImageElement,
    frameWidth: number,
    frameHeight: number,
    framesCount: number
  ) {
    this.image = image
    this.frameWidth = frameWidth
    this.frameHeight = frameHeight
    this.textureWidth = this.image.width
    this.framesCount = framesCount
  }

  getFrame(index: number): SpriteFrame {
    if (index < 0 || index >= this.framesCount) {
      throw new Error('Frame index out of bounds')
    }

    const xOffset = (index % Math.floor(this.textureWidth / this.frameWidth)) * this.frameWidth
    const yOffset =
      Math.floor(index / Math.floor(this.textureWidth / this.frameWidth)) * this.frameHeight
    return new SpriteFrame(this.image, xOffset, yOffset, this.frameWidth, this.frameHeight, index)
  }

  getFramesCount(): number {
    return this.framesCount
  }
}

export class AnimatedEffect extends EffectObject {
  private frames: SpriteFrames
  private frameRate: number
  private i: number = 0
  private j: number

  constructor(
    x: number,
    y: number,
    friction: number,
    width: number,
    height: number,
    scene: Scene,
    frames: SpriteFrames,
    frameRate: number
  ) {
    super(x, y, friction, width, height, scene)
    this.frames = frames
    this.frameRate = frameRate
    this.j = frameRate
  }

  getFrame() {
    const frameIndex = CavyUtils.mapToRange(this.i, this.frames.getFramesCount() - 1)
    return this.frames.getFrame(frameIndex)
  }

  setFrameRate(value: number) {
    this.frameRate = value
  }

  getFrameRate() {
    return this.frameRate
  }

  update() {
    super.update()
    this.j--
    if (this.j < 0) {
      this.j = this.frameRate
      this.i++
    }
  }
}
