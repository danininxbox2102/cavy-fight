import GameCmp from '../../components/GameCmp.vue'
import FailedToLoadCmp from '../../components/errorPages/FailedToLoadCmp.vue'
import TMALoginTimeout from '@/components/errorPages/TMALoginTimeout.vue'
import IntroCmp from '../../components/intro/IntroCmp.vue'
import FailedToCreateAccCmp from '@/components/errorPages/FailedToCreateAccCmp.vue'
import { AnimatedEffect, Scene, SpriteFrame, SpriteFrames } from '@/assets/js/cvfx'
import { EventRegistry } from '@/assets/js/events/EventRegistry'
import Cookies from 'js-cookie'
import TMALoginFailed from '@/components/errorPages/TMALoginFailed.vue'
import { Types } from 'telegraf'
import { QuestManager } from '@/assets/js/quests/QuestManager'
import { AuthManagerOLD } from '@/assets/js/auth/AuthManagerOLD'
import { CavyError, CavyErrorButton, CavyErrorWindow } from '@/assets/js/visual/CavyError'
import { CavyUtils, Vector2D } from '@/assets/js/CavyUtils'
import { AuthManager } from '@/assets/js/auth/AuthManager'

export class CavyFight {
  private displayedComponent: object
  private viewChangeCallback: Function
  private jwt_token: string = ''
  private tickCount: number = 0
  private tapCount: number = 0
  private lastSyncTapCount: number = 0
  private isDataReady: boolean = false
  private scene: Scene
  private questManager: QuestManager
  private backendUrl: string = 'https://starlightmc.site:3000'
  private appIsPaused: boolean

  private static instance: CavyFight
  public static getInstance = () => {
    return CavyFight.instance
  }
  private displayedError: CavyErrorWindow

  constructor() {}

  changeView(cmp: object) {
    this.displayedComponent = cmp
    window.dispatchEvent(new Event(EventRegistry.APP_VIEW_CHANGE_EVENT))
  }

  async appInit() {
    CavyFight.instance = this

    // @ts-ignore
    window.CavyFight = CavyFight.instance

    let tg = window.Telegram.WebApp

    tg.expand() // развернет при открытии
    tg.disableVerticalSwipes()

    if (this.getInitData() === '') {
      this.changeView(FailedToLoadCmp)
      console.log('getInitData is null')
      return
    }
    //
    // let aboba = localStorage.getItem('aboba')
    // if (aboba) {
    //   console.log('aboba exists ' + aboba)
    // } else {
    //   console.log('aboba not found! ')
    //   localStorage.setItem('aboba', 'bebra')
    // }

    let user: WebAppUser | undefined = tg.initDataUnsafe.user
    if (user == null) return

    const authManager = new AuthManager(this.getInitData())
    authManager.init()

    return

    const savedToken = this.getJWT('access_token')

    if (!savedToken) {
      await this.loginTMA()
      if (!this.jwt_token) return
      console.log('logged in using TMA auth')
    } else this.jwt_token = savedToken

    const res = await this.loadUserProfile()

    if (typeof res === typeof Error) {
      this.changeView(TMALoginFailed)
      return
    }

    if (res.status === 401) {
      console.log('saved refresh token is invalid or expired')
      await this.loginTMA()
      const res2 = await this.loadUserProfile()
      if (res2.status === 401) {
        this.changeView(TMALoginFailed)
        return
      }

      return
    }

    if (res.status === 404) {
      this.changeView(IntroCmp)
      return
    }

    if (res.status === 500) {
      this.changeView(TMALoginFailed)
      return
    }

    this.changeView(GameCmp)

    await this.initTapCount()

    window.dispatchEvent(new Event(EventRegistry.APP_INIT_EVENT))

    this.questManager = new QuestManager()
    this.questManager.initQuests()

    this.loadEffectsData()
    setInterval(this.tick, 1000)
  }

  //

  displayError(error: CavyErrorWindow) {
    this.suspendApp()
    this.displayedError = error
    window.dispatchEvent(new Event(EventRegistry.APP_ERROR_EVENT))
  }

  //

  fatalError(error: CavyError) {
    let errorWindow = new CavyErrorWindow(error)

    let callback = () => {
      window.Telegram.WebApp.close()
    }

    let button1 = new CavyErrorButton('Выйти', '#fff', callback)
    errorWindow.addButton(button1)

    this.displayError(errorWindow)
  }

  getDisplayedError() {
    return this.displayedError
  }

  public suspendApp() {
    this.appIsPaused = true
  }

  public resumeApp() {
    this.appIsPaused = false
  }

  getQuestManager(): QuestManager {
    return this.questManager
  }

  getJWT(type: string): string | undefined {
    return Cookies.get(type)
  }

  saveJWT(type: string, token: string) {
    Cookies.set(type, token)
  }

  getUserId(): number {
    const tg: WebApp = window.Telegram.WebApp
    const user: WebAppUser | undefined = tg.initDataUnsafe.user
    if (user == null) return 0
    return user.id
  }

  async initTapCount() {
    await this.requestProfile(this.getUserId()).then(async (res) => {
      if (res.status === 200) {
        await res.json().then((json) => {
          this.tapCount = json.profile.coins
          this.lastSyncTapCount = json.profile.coins
        })
      } else if (res.status === 404) {
        console.error('Failed to init tap count. Profile is not found')
      } else {
        console.error('Failed to init tap count. Something went wrong')
      }
    })

    this.isDataReady = true
  }

  async loadUserProfile(): Promise<Response> {
    return await this.requestProfile(this.getUserId())
  }

  getTapCount(): number {
    return this.tapCount
  }

  getView() {
    return this.displayedComponent
  }

  getInitData(): string {
    return window.Telegram.WebApp.initData
  }

  requestProfile(id: number): Promise<Response> {
    return fetch(this.backendUrl + '/profile/' + id, {
      method: 'GET',
      headers: {
        Authorization: `jwt ${this.jwt_token}`
      }
    })
  }

  async getAccountData() {
    let data: { profile: any } | undefined

    await this.requestProfile(this.getUserId()).then(async (res) => {
      await res.json().then((json) => (data = json))
    })

    if (!data) return null

    return data.profile
  }

  async loginTMA() {
    await fetch(this.backendUrl + '/auth/token/', {
      method: 'GET',
      headers: {
        Authorization: `tma ${this.getInitData()}`
      }
    }).then(async (res) => {
      if (res.status === 500) {
        this.changeView(TMALoginFailed)
        return
      }

      if (res.status === 404) {
        await res.json().then((data) => {
          this.changeView(IntroCmp)
          return
        })
      }

      if (res.status === 401) {
        await res.json().then((data) => {
          if (data.error === 'ERR_EXPIRED') {
            this.changeView(TMALoginTimeout)
            return
          }
          return
        })
      }

      if (res.status === 200) {
        await res.json().then((data) => {
          this.jwt_token = data.accessToken
          this.saveJWT('access_token', data.accessToken)
          this.saveJWT('refreshToken', data.refreshToken)
        })
      }
    })
  }

  async createNewAccount(): Promise<void> {
    await this.loginTMA()

    if (!this.jwt_token) return
    console.log('logged in using TMA auth')

    fetch(this.backendUrl + '/new_profile', {
      method: 'POST',
      headers: {
        Authorization: `jwt ${this.jwt_token}`,
        initData: this.getInitData()
      }
    }).then((res) => {
      if (res.status === 200) {
        const cavyFight = CavyFight.getInstance()
        cavyFight.changeView(GameCmp)
        return
      }
      if (res.status === 403) {
        const cavyFight = CavyFight.getInstance()
        cavyFight.changeView(TMALoginFailed)
        return
      }
      const cavyFight = CavyFight.getInstance()
      cavyFight.changeView(FailedToCreateAccCmp)
    })
  }

  tap(event: PointerEvent): void {
    this.tapCount++
    this.spawnTapEffects(event)
    console.log('tap')
    window.dispatchEvent(new Event(EventRegistry.GAME_TAP_EVENT))
  }

  syncData() {
    this.lastSyncTapCount = this.tapCount
    fetch(this.backendUrl + '/sync_data', {
      method: 'POST',
      headers: {
        Authorization: `jwt ${this.jwt_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coins: this.tapCount })
    }).then((res) => {
      if (res.status !== 200) {
        console.error('failed to sync data with error code: ' + res.status)
      }
    })
  }

  // VFX

  private coinTexture: HTMLImageElement

  getScene() {
    return this.scene
  }

  loadEffectsData() {
    this.coinTexture = new Image()
    this.coinTexture.src = './src/assets/images/animated/coin.png'
  }

  spawnTapEffects(event: PointerEvent) {
    const pos: Vector2D = CavyUtils.getMousePosition(this.getScene().getCanvas(), event)

    const spriteFrames = new SpriteFrames(this.coinTexture, 44, 40, 10)
    const effectWidth = 32
    const effectHeight = 32
    const animatedEffect = new AnimatedEffect(
      pos.getX() - effectWidth / 2,
      pos.getY() - effectHeight / 1.5,
      0.3,
      effectWidth,
      effectHeight,
      this.scene,
      spriteFrames,
      2
    )
    animatedEffect.setSpeedVector(new Vector2D(0, -5))

    this.scene.addObject(animatedEffect)
  }

  setupEffectScene(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    this.scene = new Scene(canvas)

    setInterval(this.effectTick.bind(this), 1000 / 60)
  }

  effectTick() {
    if (!this.scene) return
    if (this.appIsPaused) return
    let canvas = this.scene.getCanvas()
    if (!canvas) return

    let ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.scene.getObjects().forEach((obj) => {
      obj.update()
      ctx.globalAlpha = obj.getAlpha()
      if (obj instanceof AnimatedEffect) {
        let frame: SpriteFrame = obj.getFrame()
        ctx.drawImage(
          frame.getImage(),
          frame.getXOffset(),
          frame.getYOffset(),
          frame.getFrameWidth(),
          frame.getFrameHeight(),
          obj.getX(),
          obj.getY(),
          obj.getWidth(),
          obj.getHeight()
        )
        return
      }
    })
  }

  tick = () => {
    if (this.appIsPaused) return
    if (!this.isDataReady) return
    if (this.tapCount !== this.lastSyncTapCount) {
      console.log('syncing taps... ( ' + this.lastSyncTapCount + ' => ' + this.tapCount + ' )')
      this.syncData()
    }

    this.tickCount++
  }

  showIntro() {
    this.changeView(IntroCmp)
  }
}
