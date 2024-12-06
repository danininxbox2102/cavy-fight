interface Response {
  success: boolean
  data: null | {}
  response: {
    status: number
  }
}

export class HTTPHelper {
  private static backendUrl = 'https://starlightmc.site:3000'

  /**
   * @endpoint - aaaa
   *
   **/
  public static async apiAuthGet(endpoint: string, headers: {}) {
    const res = await fetch(this.backendUrl + endpoint, {
      method: 'GET',
      headers: headers
    })

    const data = res.json()

    if (!res.ok) {
      return { success: false, data: data, response: { status: res.status } }
    }

    return { success: true, data: data, response: { status: res.status } }
  }
}
