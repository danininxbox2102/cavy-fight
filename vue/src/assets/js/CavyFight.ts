import GameCmp from '../../components/GameCmp.vue'
import FailedToLoadCmp from '../../components/errorPages/FailedToLoadCmp.vue'
import TMALoginFailed from '@/components/errorPages/TMALoginFailed.vue'
import IntroCmp from '../../components/intro/IntroCmp.vue'
import FailedToCreateAccCmp from '@/components/errorPages/FailedToCreateAccCmp.vue'
import * as assert from "node:assert";

export class CavyFight {
    private displayedComponent
    private viewChangeCallback
    private jwt_token: string
    private tickCount: number = 0
    private tapCount: number = 0
    private lastSyncTapCount: number = 0
    private isDataReady: boolean = false;

    private backendUrl:string = 'https://starlightmc.site:3000'

    private static instance:CavyFight
    public static getInstance = () => {
        return CavyFight.instance
    }

    constructor() {
    }

    changeView = (cmp): void => {
        this.displayedComponent = cmp
        if (this.viewChangeCallback) this.viewChangeCallback()
    }

    appInit = async (): void => {
        CavyFight.instance = this

        let tg = window.Telegram.WebApp

        tg.expand() // развернет при открытии
        tg.disableVerticalSwipes()

        if (this.getInitData() === '') {
            this.changeView(FailedToLoadCmp)
            console.log("getInitData is null")
            return
        }

        let user: WebAppUser = tg.initDataUnsafe.user

        await this.loginTMA();

        if (!this.jwt_token) return
        console.log('logged in using TMA auth')

        this.requestProfile(user.id).then(async (res) => {
            if (res.status === 401) {
                this.changeView(IntroCmp)
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
        })

        await this.initTapCount()

        this.resolveInitQueue()

        setInterval(this.tick, 1000)
    }

    getId = (): number => {
        const tg: WebApp = window.Telegram.WebApp
        const user: WebAppUser = tg.initDataUnsafe.user

        return user.id
    }

    initTapCount = async (): void => {

        await this.requestProfile(this.getId()).then(async (res) => {
            if (res.status === 200) {
                await res.json().then((json) => {
                    this.tapCount = json.profile.coins
                    this.lastSyncTapCount = json.profile.coins
                })
            } else if (res.status === 404) {
                console.error("Failed to init tap count. Profile is not found")
            } else {
                console.error("Failed to init tap count. Something went wrong")
            }
        })

        this.isDataReady = true;

    }

    getTapCount = ():number => {
        return this.tapCount
    }

    getView = () => {
        return this.displayedComponent
    }

    /**
     * @deprecated The method should not be used
     */
    onViewChange = (callback) => {
        console.log('set callback')
        this.viewChangeCallback = callback
    }

    getInitData = ():string => {
        return window.Telegram.WebApp.initData
    }

    requestProfile = (id) => {
        return fetch(this.backendUrl + '/profile/' + id, {
            method: 'GET',
            headers: {
                Authorization: `jwt ${this.jwt_token}`
            }
        })
    }

    getAccountData = async () => {
        let data

        await this.requestProfile(this.getId()).then(async (res) => {
            await res.json().then((json) => (data = json))
        })

        return data.profile
    }

    loginTMA = async () => {
        await fetch(this.backendUrl + '/auth/', {
            method: 'GET',
            headers: {
                Authorization: `tma ${this.getInitData()}`
            }
        }).then(async (res) => {
            if (res.status === 500) {
                this.changeView(TMALoginFailed)
                return
            }
            if (res.status === 200) {
                await res.json().then((data) => {
                    this.jwt_token = data.token
                })
            }
        })
    }

    createNewAccount = async ():Promise<void> => {
        await this.loginTMA();

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

    tap = ():void => {
        this.tapCount++
    }


    private initQueue = []

    /**
     * @deprecated The method should not be used
     */
    addToInitQueue = (callback) => {
        this.initQueue.push(callback)
    }

    /**
     * @deprecated The method should not be used
     */
    resolveInitQueue = () => {
        this.initQueue.forEach((callback) => callback())
    }

    syncData = () => {
        this.lastSyncTapCount = this.tapCount
        fetch(this.backendUrl + '/sync_data', {
            method: 'POST',
            headers: {
                Authorization: `jwt ${this.jwt_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({coins: this.tapCount})
        }).then(res => {
            if (res.status !== 200) {
                console.error("failed to sync data with error code: " + res.status)
            }
        })
    }

    tick = () => {
        if (!this.isDataReady) return
        if (this.tapCount !== this.lastSyncTapCount) {
            console.log('syncing taps... ( '+this.lastSyncTapCount+' => '+this.tapCount+' )');
            this.syncData()
        }

        this.tickCount++
    }
}
