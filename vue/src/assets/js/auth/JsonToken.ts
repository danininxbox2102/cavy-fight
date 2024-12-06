import { CavyUtils } from '@/assets/js/CavyUtils'

export class JsonToken {
  private readonly type: string
  private readonly token: string
  private readonly expires: number

  constructor(type: string, token: string, expires: number) {
    this.type = type
    this.token = token
    this.expires = expires
  }

  getType(): string {
    return this.type
  }

  getToken(): string {
    return this.token
  }

  getExpires(): number {
    return this.expires
  }

  toString(): string {
    console.log('this.token: ' + this.token)
    console.log('this.expires: ' + this.expires)

    const shortToken = '...' + this.token.split('').slice(-5).join()
    const expFormatted = CavyUtils.msToTime(this.expires)
    return `${shortToken} [${expFormatted}]`
  }
}

export class AccessToken extends JsonToken {
  constructor(token: string, expires: number) {
    super('access', token, expires)
  }
}

export class RefreshToken extends JsonToken {
  constructor(token: string, expires: number) {
    super('refresh', token, expires)
  }
}
