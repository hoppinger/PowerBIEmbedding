import * as Models from './generated_models'
import * as Immutable from 'immutable'
import * as Moment from 'moment'
import 'whatwg-fetch'
import {
  UrlTemplate, application, get_context, Route, Url, make_url, fallback_url, link_to_route,
  Option, C, Mode, unit, bind, string, number, bool, button, selector, some, none, multi_selector, label, h1, h2, div, form, image, link, file, overlay,
  custom, repeat, all, any, lift_promise, retract, delay,
  simple_menu, mk_menu_entry, mk_submenu_entry, MenuEntry, MenuEntryValue, MenuEntrySubMenu,
  rich_text, paginate, Page, list, editable_list
} from 'monadic_react'
import { LoginData, ResetData, ApiResult, ApiResultWithMessage, RegisterData, ChangeData} from 'monadic_react_lib';
import { SearchQueryItem } from './generated_views/view_utils';

export type ItemWithEditable<T> = {Item:T, Editable:boolean, JustCreated:boolean}

export type RawPage<T> = {
  Items:ItemWithEditable<T>[]
  PageIndex:number
  SearchQuery:string
  NumPages:number
  PageSize:number
  TotalCount:number
  CanCreate:boolean
  CanDelete:boolean
}

export let parse_date = <T>(e:any) : T&{CreatedDate:Moment.Moment} => { return { ...e, CreatedDate: Moment.utc(e.CreatedDate) }}

export let make_page = <T>(res:any, parse_other_args:(e:any) => T) : RawPage<T> => { return {
  Items: res.Items.map((i:any) => { return{ ...i, Item:parse_date(i.Item)} }).map((i:any) => { return{ ...i, Item:parse_other_args(i.Item)} }),
  PageIndex: res.PageIndex,
  SearchQuery:res.SearchQuery,
  NumPages: res.NumPages,
  PageSize: res.PageSize,
  TotalCount: res.TotalCount,
  CanCreate: res.CanCreate,
  CanDelete: res.CanDelete
}}

var _global_project_name: string = null;
export let project_name_set = (project_name: string) => _global_project_name = project_name
export let project_name_get = () => (_global_project_name === null) ? "" : _global_project_name

export async function get_HomePage_HomePage_BIDiagrams(source:Models.HomePage, page_index:number, page_size:number) : Promise<RawPage<Models.BIDiagram>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_BIDiagrams?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.BIDiagram>(json, e => { return {...e, }})
}





export async function get_HomePage_HomePage_BIDiagrams_BIDiagram(source:Models.HomePage, page_index:number, page_size:number, id:number) : Promise<Models.BIDiagram> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_BIDiagrams/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.BIDiagram
}

export async function get_HomePage_HomePage_BIDiagrams_BIDiagram_by_id(source:Models.HomePage, id:number) : Promise<Models.BIDiagram> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/HomePage/${source.Id}/HomePage_BIDiagrams/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.BIDiagram
}




export async function create_HomePage() : Promise<Models.HomePage> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/HomePage/`, { method: 'post', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}

export async function update_HomePage(item:Models.HomePage) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/HomePage/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function update_HomePage_with_pictures(item:Models.HomePage) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/HomePage/WithPictures`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined}), credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_HomePage(source:Models.HomePage) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  let res = await fetch(`/api/v1/HomePage/${source.Id}`, { method: 'delete', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_HomePage(id:number) : Promise<ItemWithEditable<Models.HomePage>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/HomePage/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.HomePage,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_HomePage_with_pictures(id:number) : Promise<ItemWithEditable<Models.HomePage>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/HomePage/${id}/WithPictures`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.HomePage,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_HomePages(page_index:number, page_size:number) : Promise<RawPage<Models.HomePage>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/HomePage?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: headers })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}










  
  
export async function create_Admin() : Promise<Models.Admin> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/Admin/`, { method: 'post', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.Admin
}

export async function update_Admin(item:Models.Admin) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/Admin/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function update_Admin_with_pictures(item:Models.Admin) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/Admin/WithPictures`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined}), credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_Admin(source:Models.Admin) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  let res = await fetch(`/api/v1/Admin/${source.Id}`, { method: 'delete', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_Admin(id:number) : Promise<ItemWithEditable<Models.Admin>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/Admin/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Admin,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Admin_with_pictures(id:number) : Promise<ItemWithEditable<Models.Admin>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/Admin/${id}/WithPictures`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.Admin,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_Admins(page_index:number, page_size:number) : Promise<RawPage<Models.Admin>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/Admin?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: headers })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.Admin>(json, e => { return {...e, }})
}










export async function delete_Admin_sessions() : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/Admin/DeleteSessions`,
    { method: 'post', credentials: 'include',
      headers: headers
    })
  return
}

export async function active_Admin_sessions() : Promise<Array<{Item1: string, Item2: Date}>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/Admin/ActiveSessions`,
    { method: 'post', credentials: 'include',
      headers: headers
    })
  if (!res.ok) return []
  let json = await res.json()
  return json as Array<{Item1: string, Item2: Date}>
}

export async function change_Admin_Email(oldEmail:string, newEmail: string, password: string) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  
  let res = await fetch(`/api/v1/Admin/ChangeEmail`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({OldEmail: oldEmail, NewEmail: newEmail, Password: password}),
      headers: headers})
    if (!res.ok) throw Error(res.statusText)
    return
}

export async function verify_Admin_EmailToken(oldEmail:string, newEmail: string, token: string) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  
  let res = await fetch(`/api/v1/Admin/ChangeEmailConfirm`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({OldEmail:oldEmail, NewEmail: newEmail, Token: token}),
      headers: headers})
    if (!res.ok) throw Error(res.statusText)
    return
}

export async function change_Admin_Username(email: string, username: string, password: string) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  
  let res = await fetch(`/api/v1/Admin/ChangeUsername`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Email: email, Username: username, Password: password}),
      headers: headers})
    if (!res.ok) throw Error(res.statusText)
    return
}

export async function change_Admin_password(username:string, email:string, password:string, new_password:string, new_password_confirmation:string) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  
  let res = await fetch(`/api/v1/Admin/ChangePassword`,
    { method: 'post', credentials: 'include',
      body: JSON.stringify({Username:username, Email:email, Password:password, NewPassword:new_password, NewPasswordConfirmation:new_password_confirmation}),
      headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}
  
  
export async function get_BIDiagram_HomePage_BIDiagrams(source:Models.BIDiagram, page_index:number, page_size:number) : Promise<RawPage<Models.HomePage>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/BIDiagram/${source.Id}/BIDiagram_HomePages?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.HomePage>(json, e => { return {...e, }})
}





export async function get_BIDiagram_HomePage_BIDiagrams_HomePage(source:Models.BIDiagram, page_index:number, page_size:number, id:number) : Promise<Models.HomePage> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/BIDiagram/${source.Id}/BIDiagram_HomePages/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}

export async function get_BIDiagram_HomePage_BIDiagrams_HomePage_by_id(source:Models.BIDiagram, id:number) : Promise<Models.HomePage> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/BIDiagram/${source.Id}/BIDiagram_HomePages/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.HomePage
}




export async function create_BIDiagram() : Promise<Models.BIDiagram> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/BIDiagram/`, { method: 'post', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return {...json, CreatedDate: Moment.utc(json.CreatedDate),  } as Models.BIDiagram
}

export async function update_BIDiagram(item:Models.BIDiagram) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/BIDiagram/`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined, }), credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function update_BIDiagram_with_pictures(item:Models.BIDiagram) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

  let res = await fetch(`/api/v1/BIDiagram/WithPictures`, { method: 'put',
      body: JSON.stringify({...item, CreatedDate:undefined}), credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function delete_BIDiagram(source:Models.BIDiagram) : Promise<void> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')
  headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
  let res = await fetch(`/api/v1/BIDiagram/${source.Id}`, { method: 'delete', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  return
}

export async function get_BIDiagram(id:number) : Promise<ItemWithEditable<Models.BIDiagram>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/BIDiagram/${id}`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.BIDiagram,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_BIDiagram_with_pictures(id:number) : Promise<ItemWithEditable<Models.BIDiagram>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/BIDiagram/${id}/WithPictures`, { method: 'get', credentials: 'include', headers: headers })
  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return { Item: {...json.Item, CreatedDate: Moment.utc(json.Item.CreatedDate),  } as Models.BIDiagram,
           Editable: !!json.Editable, JustCreated:false }
}

export async function get_BIDiagrams(page_index:number, page_size:number) : Promise<RawPage<Models.BIDiagram>> {
  let headers = new Headers()
  headers.append('content-type', 'application/json')

  let res = await fetch(`/api/v1/BIDiagram?page_index=${page_index}&page_size=${page_size}`, { method: 'get', credentials: 'include', headers: headers })

  if (!res.ok) throw Error(res.statusText)
  let json = await res.json()
  return make_page<Models.BIDiagram>(json, e => { return {...e, }})
}










  
  
export async function login_promise(ld: LoginData<string>): Promise<ApiResultWithMessage<any>> {
    try {
        let headers = new Headers()
        headers.append('content-type', 'application/json')
        headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

        let res = await fetch('/api/v1/' + ld.role + '/Login',
            {
                method: 'post', credentials: 'include',
                body: JSON.stringify({ Email: ld.email, Password: ld.password }),
                headers: headers
            })

        if (!res.ok && res.status != 401 && res.status != 403) {
          throw (res.statusText)
        } else if (!res.ok) {
          let json = await res.json() as {message: string}
          throw (json.message !== undefined ? json.message : "login_failed")
        }

        let json = await res.json() as ApiResultWithMessage<any>

        return json.status == "failure" ? {status: "failure", message: json.message} : {status: "success", user: json.user}

    } catch (error) {
        return {status: "failure", message: error.toString()}
    }
}

export async function logout_promise(ld: LoginData<string>) : Promise<void> {
    let headers = new Headers()
    headers.append('content-type', 'application/json')
    headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

    let res = await fetch('/api/v1/' + ld.role + '/Logout',
        {
            method: 'post', credentials: 'include',
            headers: headers
        })

    if (!res.ok) throw Error(res.statusText)
    return
  }

export async function forgot_password_promise(ld: LoginData<string>): Promise<ApiResult> {
    try {
        let headers = new Headers()
        headers.append('content-type', 'application/json')
        headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

        let res = await fetch('/api/v1/' + ld.role + '/ForgotPassword',
            {
                method: 'post', credentials: 'include',
                body: JSON.stringify({ Email: ld.email }),
                headers: headers
            })

        if (!res.ok) throw Error(res.statusText)
        return "success"
    } catch (error) {
        return "failure"
    }
}

export async function reset_password_promise(rd: ResetData<string>): Promise<ApiResult> {
    try {
        let headers = new Headers()
        headers.append('content-type', 'application/json')
        headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)

        let res = await fetch('/api/v1/' + rd.role + '/ResetPassword',
        {
          method: 'post', credentials: 'include',
          body: JSON.stringify({ Email: rd.email, Password: rd.new_password, ConfirmPassword: rd.new_password_confirm, Token: rd.token }),
          headers: headers
        })
      if (!res.ok) throw Error(res.statusText)
        return "success"
    } catch (error) {
      return "failure"
    }
  }

export async function register_promise(rd: RegisterData<string>): Promise<ApiResultWithMessage<any>> {
    try {
      let headers = new Headers()
      headers.append('content-type', 'application/json')
      headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
      
      let res = await fetch('/api/v1/' + rd.role + '/Register',
        { method: 'post', credentials: 'include',
          body: JSON.stringify({Username:rd.username, Email:rd.email, EmailConfirmation:rd.emailConfirmation, Password: rd.password, PasswordConfirmation: rd.passwordConfirmation}),
          headers: headers
        })
      if (!res.ok) throw Error(res.statusText)

      let json = await res.json()
      return {status: "success", user: json}

    } catch (error) {
      return {status: "failure", message: "register_failed"}
    }
}

export async function change_password_promise(cd: ChangeData) : Promise<ApiResult> {
    try {
      let headers = new Headers()
      headers.append('content-type', 'application/json')
      headers.append('X-XSRF-TOKEN', (document.getElementsByName("__RequestVerificationToken")[0] as any).value)
      
      let res = await fetch('/api/v1/Admin/ChangePassword',
        { method: 'post', credentials: 'include',
          body: JSON.stringify({Password:cd.password, NewPassword:cd.newPassword, NewPasswordConfirmation:cd.newPasswordConfirmation}),
          headers: headers })
      if (!res.ok) throw Error(res.statusText)
        return "success"
    } catch (error) {
      return "failure"
    }
}

export function login(loginData: LoginData<string>) {
    return lift_promise<LoginData<string>, ApiResultWithMessage<any>>(ld => login_promise(ld), "semi exponential")(loginData);
}

export function logout(loginData: LoginData<string>) {
    return lift_promise<LoginData<string>, void>(ld => logout_promise(ld), "semi exponential")(loginData);
}

export function forgot_password(loginData: LoginData<string>) {
    return lift_promise<LoginData<string>, ApiResult>(ld => forgot_password_promise(ld), "semi exponential")(loginData);
}

export function reset_password(resetData: ResetData<string>) {
    return lift_promise<ResetData<string>, ApiResult>(rd => reset_password_promise(rd), "semi exponential")(resetData);
}

export function register(registerData: RegisterData<string>) {
    return lift_promise<RegisterData<string>, ApiResultWithMessage<any>>(rd => register_promise(rd), "semi exponential")(registerData);
}

export function change_password(changeData: ChangeData) {
    return lift_promise<ChangeData, ApiResult>(cd => change_password_promise(cd), "semi exponential")(changeData);
}
  

  