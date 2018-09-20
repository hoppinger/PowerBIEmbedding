import * as Models from './generated_models'
import * as Immutable from 'immutable'
import 'whatwg-fetch'

export async function ping() : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/keep_alive/ping`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}
export async function ping_as_Admin() : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/keep_alive/ping_as_Admin`, { method: 'get', credentials: 'include', headers: headers})
  if (!res.ok) throw Error(res.statusText)
  return
}
