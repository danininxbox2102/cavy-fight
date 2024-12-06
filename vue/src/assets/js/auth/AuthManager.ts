import Cookies from 'js-cookie'
import { HTTPHelper } from '@/assets/js/auth/HTTPHelper'
import { CavyError } from '@/assets/js/visual/CavyError'
import { CavyFight } from '@/assets/js/CavyFight'
import { AccessToken, RefreshToken } from '@/assets/js/auth/JsonToken'
import { Ref } from 'vue'
import Logger, { ILogger } from 'js-logger'

export class AuthManager {
  // Singleton

  private static _instance: AuthManager
  private readonly tma: string
  private accessToken: AccessToken
  private refreshToken: RefreshToken
  private logger: ILogger

  public static get getInstance() {
    return this._instance
  }

  constructor(TMAString: string) {
    this.tma = TMAString
    this.logger = Logger.get('AuthManagerOLD')
  }

  // Пошло поехало
  init() {
    this.logger.info('init auth manager')

    this.loadTokens()

    console.log('accessToken: ', this.accessToken.toString())
    console.log('refreshToken: ', this.refreshToken.toString())
  }

  // загружаем и проверяем токены
  loadTokens() {
    const accessToken = this.getSavedAccessToken()
    const refreshToken = this.getSavedRefreshToken()

    if (accessToken === null || refreshToken === null) {
      console.log('tokens not found')
      this.loginTMA()
      return
    }

    console.log('tokens found')

    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  // Проверка просрочен ли токен (ну и нулл ли он понятное дело)
  checkToken(token: { token: string; exp: number }) {
    const now = Date.now()

    const res = { valid: false, timeLeft: 0 }
    if (token !== null) {
      res.timeLeft = token.exp - now
      if (res.timeLeft > 0) res.valid = true
    }

    return res
  }

  // Сохраняем токены в куки
  saveTokens(aTokenString: string, rTokenString: string): void {
    this.accessToken = new AccessToken(aTokenString, Date.now() + 15 * 60 * 1000)

    Cookies.set('access_token', JSON.stringify(this.accessToken), {
      expires: 1,
      path: '/'
    })

    this.refreshToken = new RefreshToken(rTokenString, Date.now() + 7 * 24 * 60 * 60 * 1000)

    Cookies.set('refresh_token', JSON.stringify(this.refreshToken), {
      expires: 7,
      path: '/'
    })
  }

  private getSavedAccessToken(): AccessToken | null {
    if (this.accessToken) return this.accessToken
    const token = Cookies.get('access_token')
    if (!token) return null
    const obj = JSON.parse(token)
    return (this.refreshToken = new AccessToken(obj.token, obj.expires))
  }

  private getSavedRefreshToken(): RefreshToken | null {
    if (this.refreshToken) return this.refreshToken
    const token = Cookies.get('refresh_token')
    if (!token) return null
    const obj = JSON.parse(token)
    return (this.refreshToken = new RefreshToken(obj.token, obj.exp))
  }

  private handleError(message: string): void {
    CavyFight.getInstance().fatalError(new CavyError(9, 'Ошибка аутентификации', message))
    throw new Error(message)
  }

  private async loginTMA() {
    const result = await HTTPHelper.apiAuthGet('/auth/tma/', { Authorization: `tma ${this.tma}` })
    if (!result.success) {
      this.handleError('[' + result.response.status + ']' + result.data)
      return
    }
    //@ts-ignore
    const refreshToken = result.data.refreshToken
    //@ts-ignore
    const accessToken = result.data.accessToken

    this.saveTokens(accessToken, refreshToken)
  }
}
