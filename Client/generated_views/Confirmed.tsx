import * as React from "react"
  import * as ReactDOM from "react-dom"
  import * as Models from '../generated_models'
  import * as Api from '../generated_api'
  import * as Utils from './view_utils'
  import * as i18next from 'i18next'
  
  import {simple_application, none} from "monadic_react"
  import {Authenticate} from "monadic_react_lib"
  
  export type ConfirmPage = {
    Message: string
  }
  
  export function render_menu_ConfirmPage() {
      return<div className="menu">
          <img className="logo" src={"/images/logo.png"} alt="Logo"/>
          <div className="pages">
          </div>
        </div>
    }
    
  export type ConfirmPageState = {
    }
  export class ConfirmPageComponent extends React.Component<Utils.EntityComponentProps<ConfirmPage>, ConfirmPageState> {
    constructor(props:Utils.EntityComponentProps<ConfirmPage>, context:any) {
      super(props, context)
      this.state = {}
    }
  
    get_self() {
      return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
    }
  
    render() {
      return <div id={'ConfirmPage'} className={'model ConfirmPage'}>
        { render_menu_ConfirmPage() }
        <div className='main__content'>
          <div className="topbar">
          </div>
          <div className="model-content">
            <div>
            {i18next.t(this.props.entity.Message)}
            </div>
            <a href="/" className="button">Back to home</a>
          </div>
        </div>
      </div>
    }
  }
  
  export let ConfirmPage = (props:Utils.EntityComponentProps<ConfirmPage>) : JSX.Element =>
    <ConfirmPageComponent {...props} />
  
  export async function get_ConfirmPage_mock(message: string) : Promise<Api.ItemWithEditable<ConfirmPage>> {
    return { Item: {Message: message} as ConfirmPage, Editable: false, JustCreated:false }
  }
  
  export let Confirmed_to_page = (message: string) => {
    return Utils.scene_to_page<ConfirmPage>(() => false, ConfirmPage, get_ConfirmPage_mock(message), null, "ConfirmPage", "ConfirmPage", '/ForgotPassword')
  }
  
  export let Confirmed_to = (message: string, slug:string, target_element_id:string, ) => {
    Utils.render_page_manager(slug, target_element_id,
      Confirmed_to_page(message), null)
  }
  