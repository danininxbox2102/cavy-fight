import { b } from 'vite/dist/node/types.d-aGj9QkWt'

export const AccountTypes = {
  accountJSON: {
    _id: Boolean
  }
}

export class CavyAccount {
  private readonly id: number
  private readonly first_name: string
  private readonly last_name: string
  private level: number
  private xp_points: number
  private coins: number
  private readonly username: string
  private seenIntro: boolean

  constructor(id: number, first_name: string, last_name: string, username: string) {
    this.id = id
    this.first_name = first_name
    this.last_name = last_name
    this.username = username
  }

  getId(): number {
    return this.id
  }

  getFirstName(): string {
    return this.first_name
  }

  getLastName(): string {
    return this.last_name
  }

  getLevel(): number {
    return this.level
  }

  getXP(): number {
    return this.xp_points
  }

  getCoins(): number {
    return this.coins
  }

  getUsername(): string {
    return this.username
  }

  getSeenIntro(): boolean {
    return this.seenIntro
  }

  setLevel(level: number) {
    this.level = level
  }

  setXP(xp: number) {
    this.xp_points = xp
  }

  setCoins(coins: number) {
    this.coins = coins
  }

  setSeenIntro(val: boolean) {
    this.seenIntro = val
  }
}
