import Cookies from 'js-cookie'
import { CavyFight } from '@/assets/js/CavyFight'
import { CavyError } from '@/assets/js/visual/CavyError'
import { CavyUtils } from '@/assets/js/CavyUtils'
import Logger, { ILogger } from 'js-logger'

interface AccountData {
  _id: number
  account_created_at: number
  level: number
  xp_points: number
  coins: number
  first_name: string
  last_name: string
  username: string
  seenIntro: boolean
}

interface TokenRefreshResult {
  success: boolean
  data: {
    token: string
  }
}

export class AuthManagerOLD {
  private accessToken: { token: string; exp: number } | null
  private refreshToken: { token: string; exp: number } | null
  private fileToken: { token: string; exp: number }
  private readonly tmaInitData: string
  private readonly app: CavyFight
  private readonly logger: ILogger

  private config = {
    accessTokenLifetime: 15 * 60 * 1000,
    refreshTokenLifetime: 15 * 60 * 1000,
    backendUrl: 'https://starlightmc.site:3000'
  }

  constructor(tmaInitData: string, appInstance: CavyFight) {
    this.tmaInitData = tmaInitData
    this.app = appInstance
    this.logger = Logger.get('AuthManagerOLD')
  }

  public async init() {
    this.logger.info('init auth manager')

    await this.loadTokens()
  }

  /*

   
   HTTP Helpers


  */

  private async apiPost(endpoint: string, body: object): Promise<Response | CavyError> {
    const send = async (endpoint: string, body: object) => {
      return await fetch(this.config.backendUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    }

    try {
      await send(endpoint, body)
    } catch (error) {
      this.logger.error(`Error in POST request to ${endpoint}`, error)
      return new CavyError(9, 'API Error', String(error))
    }

    return new CavyError(9, 'API Error', 'Something went wrong')
  }

  private async apiAuthGet(endpoint: string, body: object): Promise<any> {
    const send = async (endpoint: string, body: object) => {
      const response = await fetch(this.config.backendUrl + endpoint, {
        method: 'GET',
        headers: {
          Authorization: `jwt ${this.getAccessToken()?.token}`
        }
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    }

    try {
      await send(endpoint, body)
    } catch (error) {
      this.logger.error(`Error in POST request to ${endpoint}`, error)
      return new CavyError(9, 'API Error', String(error))
    }
  }

  /*


    Logging


  */

  private handleError(message: string): void {
    this.app.fatalError(new CavyError(9, 'Ошибка аутентификации', message))
    throw new Error(message)
  }

  /*


    Tokens


  */

  private checkTokens(): {
    access: { valid: boolean; timeLeft: number }
    refresh: { valid: boolean; timeLeft: number }
  } {
    const now = Date.now()
    const res = { access: { valid: false, timeLeft: 0 }, refresh: { valid: false, timeLeft: 0 } }

    const aToken = this.getAccessToken()
    const rToken = this.getRefreshToken()

    if (aToken !== null) {
      res.access.timeLeft = aToken.exp - now
      if (res.access.timeLeft > 0) res.access.valid = true
    }

    if (rToken !== null) {
      res.refresh.timeLeft = rToken.exp - now
      if (res.refresh.timeLeft > 0) res.refresh.valid = true
    }

    return res
  }

  private async loadTokens(): Promise<void> {
    this.logger.info('Loading tokens...')
    let attempt = 0
    const maxAttempts = 10 // Например, 3 попытки

    while (attempt < maxAttempts) {
      attempt++
      this.logger.info('Attempt ' + attempt)
      const checked = this.checkTokens()
      this.logger.info(
        `Tokens checked.
         access valid: ${checked.access.valid} (time left: ${CavyUtils.msToTime(checked.access.timeLeft)})
         refresh valid: ${checked.refresh.valid} (time left: ${CavyUtils.msToTime(checked.refresh.timeLeft)})
         `
      )

      if (!checked.refresh.valid) {
        this.logger.warn('Refresh token invalid! Attempting TMA login...')
        const result = await this.loginTMA()
        if (result instanceof CavyError) {
          return this.app.fatalError(result)
        }
        this.logger.info('Logged in using TMA auth.')
        this.saveTokens(result.data.accessToken, result.data.refreshToken)
        continue // Переход к следующей итерации
      }

      if (!checked.access.valid) {
        this.logger.warn('Access token invalid! Attempting refresh...')
        const refreshResult = await this.refreshAccessToken()
        if (refreshResult instanceof CavyError) {
          return this.app.fatalError(refreshResult)
        }

        if (refreshResult.success) {
          this.saveAccessToken(refreshResult.data.token)
          continue // Переход к следующей итерации
        } else {
          // Refresh failed, fallback to TMA login
          this.logger.warn('Token refresh failed. Attempting TMA login...')
          const loginResult = await this.loginTMA()
          if (loginResult instanceof CavyError) {
            return this.app.fatalError(loginResult)
          }
          this.logger.info('Logged in using TMA auth.')
          this.saveTokens(loginResult.data.accessToken, loginResult.data.refreshToken)
          continue // Переход к следующей итерации
        }
      }

      // Both tokens are valid, exit the loop
      this.logger.info('Tokens loaded successfully.')
      break
    }

    if (attempt >= maxAttempts) {
      console.error('attempts count exceeded!')
      this.handleError('token load attempts exceeded!')
    }
  }

  //
  //
  //

  private getAccessToken(): { token: string; exp: number } | null {
    if (this.accessToken) return this.accessToken
    const token = Cookies.get('access_token')
    if (!token) return null
    return (this.accessToken = JSON.parse(token))
  }

  private getRefreshToken(): { token: string; exp: number } | null {
    if (this.refreshToken) return this.refreshToken
    const token = Cookies.get('refresh_token')
    if (!token) return null
    return (this.refreshToken = JSON.parse(token))
  }

  //

  private saveTokens(accessToken: string, refreshToken: string): void {
    this.saveAccessToken(accessToken)
    this.saveRefreshToken(refreshToken)
  }

  private saveAccessToken(token: string) {
    this.accessToken = { token: token, exp: Date.now() + 15 * 60 * 1000 }
    Cookies.set('access_token', JSON.stringify(this.accessToken), {
      expires: 1, // Куки будет существовать 1 день
      path: '/' // Куки доступна для всех путей на домене
    })
  }

  private saveRefreshToken(token: string) {
    this.refreshToken = {
      token: token,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000
    }
    Cookies.set('refresh_token', JSON.stringify(this.refreshToken), {
      expires: 7, // Куки будет существовать 7 дней
      path: '/' // Куки доступна для всех путей на домене
    })
  }

  //
  //
  //

  private async refreshAccessToken(): Promise<CavyError | TokenRefreshResult> {
    // const res2 = await fetch(this.config.backendUrl + '/auth/token/refresh', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ refreshToken: this.getRefreshToken()?.token })
    // })

    const res = await this.apiPost('/auth/token/refresh', {
      refreshToken: this.getRefreshToken()?.token
    })

    if (res instanceof CavyError) {
      return res
    }

    const resData = await res.json()

    switch (res.status) {
      case 400:
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Возникла ошибка обновления токена. (400) Попробуйте зайти в приложение позже'
        )
      case 401:
        return { success: false, data: resData }
      case 404:
        return new CavyError(9, 'Ошибка аутентификации', 'Пользователь не найден')
      case 200:
        return { success: true, data: resData }
      default:
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Возникла неизвестная ошибка. Попробуйте зайти в приложение позже'
        )
    }
  }

  /**
   * @deprecated
   * **/
  private async refreshRefreshToken(): Promise<CavyError | TokenRefreshResult> {
    const res = await this.apiPost('/auth/token/refresh/refresh', {
      refreshToken: this.getRefreshToken()?.token
    })

    if (res instanceof CavyError) {
      return res
    }

    const resData = await res.json()

    switch (res.status) {
      case 400:
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Возникла ошибка обновления токена. (400) Попробуйте зайти в приложение позже'
        )
      case 401:
        return { success: false, data: resData }
      case 404:
        return new CavyError(9, 'Ошибка аутентификации', 'Пользователь не найден')
      case 200:
        return { success: true, data: resData }
      default:
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Возникла неизвестная ошибка. Попробуйте зайти в приложение позже'
        )
    }
  }

  //
  //
  //

  public async getAccessTokenSafe(): Promise<null | CavyError> {
    const checked = this.checkTokens()

    if (!checked.refresh.valid)
      return new CavyError(
        9,
        'Refresh токен просрочен',
        'Unable to safely get access token because the refresh token is expired'
      )

    if (checked.refresh.timeLeft < 1000 * 60 * 60 * 24) {
      this.refreshRefreshToken().then((r) => {
        if (r instanceof CavyError) {
        }
      })
    }

    if (checked.access.valid) {
      if (checked.access.timeLeft < 1000 * 60) {
        this.refreshAccessToken().then((r) => {
          if (r instanceof CavyError) {
          }
        })
      }
    }

    let accessToken = this.getAccessToken()
    if (!accessToken) return null

    return null
  }

  /*


    Account


  */

  //
  // private async requestAccount(): Promise<
  //   CavyError | { success: boolean; error: string | undefined; data: AccountData | undefined }
  // > {
  //   const res = await fetch(this.config.backendUrl + '/profile', {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `jwt ${this.getAccessToken()?.token}`
  //     }
  //   })
  //   const resData = await res.json()
  //
  //   switch (res.status) {
  //     case 404:
  //       return new CavyError(
  //         9,
  //         'Ошибка загрузки аккаунта',
  //         'Аккаунт не найден. Свяжитесь с разработчиком'
  //       )
  //     case 401:
  //       return new CavyError(
  //         9,
  //         'Ошибка загрузки аккаунта',
  //         resData.error + '. Свяжитесь с разработчиком'
  //       )
  //     case 403:
  //       this.refreshAccessToken()
  //       return { success: false, error: 'token expired', data: undefined }
  //     case 200:
  //       return { success: true, error: undefined, data: resData.profile }
  //     default:
  //       return new CavyError(
  //         9,
  //         'Ошибка аутентификации',
  //         'Возникла неизвестная ошибка. Попробуйте зайти в приложение позже'
  //       )
  //   }
  // }
  //
  // private async loadAccount() {
  //   const result = await this.requestAccount()
  //   if (result instanceof CavyError) {
  //     return this.app.fatalError(result)
  //   }
  //
  //   if (!result.success && result.error === 'token expired') {
  //     this.logger.warn('Access token Expired! Refreshing...')
  //     await this.refreshAccessToken()
  //     return
  //   }
  //
  //   const accountData = result.data
  //   if (!accountData) {
  //     throw new Error('result.data is undefined')
  //   }
  //
  //   const account: CavyAccount = new CavyAccount(
  //     accountData._id,
  //     accountData.first_name,
  //     accountData.last_name,
  //     accountData.username
  //   )
  //   account.setLevel(accountData.level)
  //   account.setXP(accountData.xp_points)
  //   account.setCoins(accountData.coins)
  //   account.setSeenIntro(accountData.seenIntro)
  //
  //   this.account = account
  // }

  private async loginTMA(): Promise<
    CavyError | { newAcc: boolean; data: { refreshToken: string; accessToken: string } }
  > {
    const res = await fetch(this.config.backendUrl + '/auth/tma', {
      method: 'GET',
      headers: {
        Authorization: `tma ${this.getInitData()}`
      }
    })
    const resData = await res.json()

    switch (res.status) {
      case 500:
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Возникла неизвестная ошибка на стороне сервера. Попробуйте зайти в приложение позже'
        )
      case 401:
        if (resData.error === 'ERR_EXPIRED') {
          return new CavyError(
            9,
            'Ошибка аутентификации',
            'Данные TMA устарели. Презапустите приложеие'
          )
        }
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Не удалось пройти аутентификацию. Попробуйте зайти в приложение позже'
        )
      case 404:
        return new CavyError(9, 'Ошибка аутентификации', 'Пользователь не найден')
      case 201:
        return { newAcc: true, data: resData }
      case 200:
        return { newAcc: false, data: resData }
      default:
        return new CavyError(
          9,
          'Ошибка аутентификации',
          'Возникла неизвестная ошибка. Попробуйте зайти в приложение позже'
        )
    }
  }

  /*


    Others


  */

  public getInitData() {
    return this.tmaInitData
  }
}
