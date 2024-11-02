import GameCmp from '../../components/GameCmp.vue'
import FailedToLoadCmp from '../../components/errorPages/FailedToLoadCmp.vue'
import TMALoginFailed from '@/components/errorPages/TMALoginFailed.vue'
import IntroCmp from '../../components/intro/IntroCmp.vue'
import FailedToCreateAccCmp from '@/components/errorPages/FailedToCreateAccCmp.vue'

export class CavyFight {
  _displayedComponent
  _viewChangeCallback
  _jwt_token
  _tickCount = 0
  _tapCount
  _lastSyncTapCount

  backendUrl = 'http://localhost:3000'

  static instance

  constructor() {}

  changeView = (cmp) => {
    this._displayedComponent = cmp
    if (this._viewChangeCallback) this._viewChangeCallback()
  }

  appInit = async () => {
    CavyFight.instance = this

    let tg = window.Telegram.WebApp

    tg.expand() // развернет при открытии
    tg.disableVerticalSwipes()

    if (this.getInitData() == '') {
      this.changeView(FailedToLoadCmp)
      return
    }

    let user = tg.initDataUnsafe.user

    await this.loginTMA().then(async (res) => {
      if (res.status == 500) {
        this.changeView(TMALoginFailed)
        return
      }
      if (res.status == 200) {
        await res.json().then((data) => {
          this._jwt_token = data.token
        })
      }
    })

    if (!this._jwt_token) return

    console.log('logged in using TMA auth')

    this.getProfile(user.id).then(async (res) => {
      if (res.status == 401) {
        this.changeView(IntroCmp)
        return
      }

      if (res.status == 404) {
        this.changeView(IntroCmp)
        return
      }

      if (res.status == 500) {
        this.changeView(TMALoginFailed)
        return
      }

      this.changeView(GameCmp)
    })

    await this.initTapCount()

    this.resolveInitQueue()

    setInterval(this.tick, 1000)
  }

  getId = () => {
    const tg = window.Telegram.WebApp
    const user = tg.initDataUnsafe.user

    return user.id
  }

  initTapCount = async () => {
    let data

    await this.getProfile(this.getId()).then(async (res) => {
      await res.json().then((json) => (data = json))
    })

    this._tapCount = data.profile.coins
  }

  getTapCount = () => {
    return this._tapCount
  }

  static getInstance = () => {
    return CavyFight.instance
  }

  getView = () => {
    return this._displayedComponent
  }

  onViewChange = (callback) => {
    this._viewChangeCallback = callback
  }

  getInitData = () => {
    return window.Telegram.WebApp.initData
  }

  getProfile = (id) => {
    return fetch(this.backendUrl + '/profile/' + id, {
      method: 'GET',
      headers: {
        Authorization: `jwt ${this._jwt_token}`
      }
    })
  }

  getAccountData = async () => {
    let data

    await this.getProfile(this.getId()).then(async (res) => {
      await res.json().then((json) => (data = json))
    })

    return data.profile
  }

  loginTMA = () => {
    return fetch(this.backendUrl + '/auth/', {
      method: 'GET',
      headers: {
        Authorization: `tma ${this.getInitData()}`
      }
    })
  }

  createNewAccount = async () => {
    await this.loginTMA().then(async (res) => {
      if (res.status == 500) {
        this.changeView(TMALoginFailed)
        return
      }
      if (res.status == 200) {
        await res.json().then((data) => {
          this._jwt_token = data.token
        })
      }
    })

    if (!this._jwt_token) return

    console.log('logged in using TMA auth')

    fetch('http://localhost:3000/new_profile', {
      method: 'POST',
      headers: {
        Authorization: `jwt ${this._jwt_token}`,
        initData: this.getInitData()
      }
    }).then((res) => {
      if (res.status == 200) {
        const cavyFight = CavyFight.getInstance()
        cavyFight.changeView(GameCmp)
        return
      }
      if (res.status == 403) {
        const cavyFight = CavyFight.getInstance()
        cavyFight.changeView(TMALoginFailed)
        return
      }
      const cavyFight = CavyFight.getInstance()
      cavyFight.changeView(FailedToCreateAccCmp)
    })
  }

  saveJWT = () => {}

  getJWT = () => {}

  tap = () => {
    this._tapCount++
  }

  _initQueue = []

  addToInitQueue = (callback) => {
    this._initQueue.push(callback)
  }

  resolveInitQueue = () => {
    this._initQueue.forEach((callback) => callback())
  }

  syncData = () => {
    this._lastSyncTapCount = this._tapCount
    fetch('http://localhost:3000/sync_data', {
      method: 'POST',
      headers: {
        Authorization: `jwt ${this._jwt_token}`
      },
      body: JSON.stringify({ coins: this._tapCount })
    })
  }

  tick = () => {
    console.log('send taps')
    if (this._tapCount != this._lastSyncTapCount) this.syncData()

    this._tickCount++
  }
}
