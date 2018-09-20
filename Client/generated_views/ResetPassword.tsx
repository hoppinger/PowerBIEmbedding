import * as React from "react"
  import * as ReactDOM from "react-dom"
  import * as Models from '../generated_models'
  import * as Api from '../generated_api'
  import * as Utils from './view_utils'
  import * as i18next from 'i18next'
  
  import {simple_application, none} from "monadic_react"
  import {Authenticate} from "monadic_react_lib"
  
  export type ResetPassword = {
    Token: string,
    Role: string,
    Email: string
  }

  export function render_menu_ResetPassword() {
      return<div className="menu">
          <img className="logo" src={"/images/logo.png"} alt="Logo"/>
          <div className="pages">
          </div>
        </div>
    }
    
  export type ResetPasswordState = {
    }
  export class ResetPasswordComponent extends React.Component<Utils.EntityComponentProps<ResetPassword>, ResetPasswordState> {
    constructor(props:Utils.EntityComponentProps<ResetPassword>, context:any) {
      super(props, context)
      this.state = {}
    }
  
    get_self() {
      return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
    }
  
    render() {
      return <div id={'ResetPassword'} className={'model resetpassword'}>
        { render_menu_ResetPassword() }
        <div className='main__content'>
          <div className="topbar">
          </div>
          <div className="model-content">
          <div className="message message--info">{i18next.t("reset_info")}</div>
          {simple_application(
            Authenticate<any, string>(Api.login, Api.logout, Api.register, Api.forgot_password, Api.reset_password, Api.change_password, (message) => alert(i18next.t(message)))(r => r)(["Admin"])
            ({ kind: "reset",
              loginState: { email: "", password: "", role: null },
              resetState: { email: this.props.entity.Email, new_password: "", new_password_confirm: "", role: this.props.entity.Role, token: this.props.entity.Token},
              registerState: {username: "", email: "", emailConfirmation: "", password: "", passwordConfirmation: "", role: ""},
              user: none() }
            ), (result) => result.user.kind == "some" ? window.location.replace("/") : "")}
          </div>
        </div>
      </div>
    }
  }
  
  export let ForgotPassword = (props:Utils.EntityComponentProps<ResetPassword>) : JSX.Element =>
    <ResetPasswordComponent {...props} />
  
  export async function get_ResetPassword_mock(token: string, role: string, email: string) : Promise<Api.ItemWithEditable<ResetPassword>> {
    return { Item: {Token: token, Role: role, Email: email} as ResetPassword, Editable: false, JustCreated:false }
  }
  
  export let ResetPassword_to_page = (token: string, role: string, email: string) => {
    return Utils.scene_to_page<ResetPassword>(() => false, ForgotPassword, get_ResetPassword_mock(token, role, email), null, "ForgotPassword", "ForgotPassword", '/ForgotPassword')
  }
  
  export let ResetPassword_to = (token: string, role: string, email: string, slug:string, target_element_id:string, ) => {
    Utils.render_page_manager(slug, target_element_id,
      ResetPassword_to_page(token, role, email), null)
  }
  