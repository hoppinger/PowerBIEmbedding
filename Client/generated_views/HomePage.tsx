import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../components/list'
import * as Components from '../components/components'
import * as Buttons from '../components/button_utils'
import { ChangeUsernameFlow, ChangeEmailFlow } from '../components/user_utils'
import * as ToggleContainer from '../components/toggle_container'
import * as Permissions from './permissions'
import * as Utils from './view_utils'
import * as Draft from 'draft-js'
import * as i18next from 'i18next'
import * as Moment from 'moment'
import { simple_application, none } from 'monadic_react'
import { Authenticate } from 'monadic_react_lib'
import * as BIDiagramViews from './BIDiagram'
import * as CustomViews from '../custom_views'

export function HomePage_HomePage_BIDiagram_can_create(self:HomePageContext) {
  let state = self.state()
  return state.BIDiagram_HomePage == "loading" ? false : state.BIDiagram_HomePage.CanCreate
}
export function HomePage_HomePage_BIDiagram_can_delete(self:HomePageContext) {
  let state = self.state()
  return state.BIDiagram_HomePage == "loading" ? false : state.BIDiagram_HomePage.CanDelete
}
export function HomePage_HomePage_BIDiagram_page_index(self:HomePageContext) {
  let state = self.state()
  return state.BIDiagram_HomePage == "loading" ? 0 : state.BIDiagram_HomePage.PageIndex
}
export function HomePage_HomePage_BIDiagram_page_size(self:HomePageContext) {
  let state = self.state()
  return state.BIDiagram_HomePage == "loading" ? 25 : state.BIDiagram_HomePage.PageSize
}
export function HomePage_HomePage_BIDiagram_search_query(self:HomePageContext) {
  let state = self.state()
  return state.BIDiagram_HomePage == "loading" ? null : state.BIDiagram_HomePage.SearchQuery
}
export function HomePage_HomePage_BIDiagram_num_pages(self:HomePageContext) {
  let state = self.state()
  return state.BIDiagram_HomePage == "loading" ? 1 : state.BIDiagram_HomePage.NumPages
}

export function load_relation_HomePage_HomePage_BIDiagram(self:HomePageContext, force_first_page:boolean, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.BIDiagram_HomePage != "loading" ?
    (c:() => void) => state.BIDiagram_HomePage != "loading" && self.setState({
      ...state,
      BIDiagram_HomePage: {...state.BIDiagram_HomePage, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_BIDiagram(current_Admin) ?
    prelude(() => {
      var items = Api.get_HomePage_HomePage_BIDiagrams(self.props.entity, HomePage_HomePage_BIDiagram_page_index(self), HomePage_HomePage_BIDiagram_page_size(self))

      items.then(BIDiagrams =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            BIDiagram_HomePage:Utils.raw_page_to_paginated_items<Models.BIDiagram, Utils.EntityAndSize<Models.BIDiagram> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.BIDiagram_HomePage != "loading" ?
                  (state.BIDiagram_HomePage.Items.has(i.Id) ?
                    state.BIDiagram_HomePage.Items.get(i.Id).size
                  :
                    "preview")
                  :
                    "preview",
                shown_relation:"all"}}, {...BIDiagrams, SearchQuery: HomePage_HomePage_BIDiagram_search_query(self)})
            }, callback))
    })
    :
      prelude(() => callback && callback())
}

export function load_relations_HomePage(self, current_Admin:Models.Admin, callback?:()=>void) {
  callback && callback()
}

export function set_size_HomePage(self:HomePageContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(HomePage_to_page(self.props.entity.Id))
  })
}





export function render_editable_attributes_minimised_HomePage(self:HomePageContext) {
  let attributes = (<div>
      
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_HomePage(self:HomePageContext) {
    let state = self.state()
    let attributes = (<div>
        
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_HomePage(self:HomePageContext) {
  return <div className="breadcrumb-homepage">{i18next.t("HomePage")}</div>
}

export function render_menu_HomePage(self:HomePageContext) {
  let state = self.state()
  return <div className="menu">
        <img className="logo" src={"/images/logo.png"} alt="Logo"/>
        <div className="pages">
          {!Permissions.can_view_HomePage(self.props.current_Admin) ? null :
              <div className={`menu_entry page_link active-page`}>
                <a onClick={() => 
                  self.props.set_shown_relation("none")
                  
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
          <div className="menu_entries">
          
            {!Permissions.can_view_BIDiagram(self.props.current_Admin) ? null :
                  <div className={`menu_entry${self.props.shown_relation == "HomePage_BIDiagram" ? " active" : ""}`}>
                    <a onClick={() =>
                        {self.props.set_shown_relation("HomePage_BIDiagram")
                        }
                      }>
                      {i18next.t('HomePage_BIDiagrams')}
                    </a>
                  </div>
                }
                <div className="menu_entry menu_entry--with-sub">
                
                </div>  
          </div>
        </div>
      </div>
}

export function render_local_menu_HomePage(self:HomePageContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this HomePage')}
              </a>
            </div>
          
          </div>
        </div>
}

export function render_controls_HomePage(self:HomePageContext) {
  return true ? <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"homepage button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {Permissions.can_delete_HomePage(self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_HomePage(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.unlink && self.props.mode != "view" ?
      <a className="button button--unlink"
          onClick={() => self.props.unlink()}>
      </a>
      :
      null
    }
    {self.props.delete && self.props.mode != "view" ?
      <a className="button button--delete"
          onClick={() => self.props.delete()}>
      </a>
      :
      null
    }
  </div>
  : <div></div>
}

export function render_content_HomePage(self:HomePageContext) {
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_HomePage(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_HomePage(self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_HomePage(self)
      : self.props.size == "large" ?
        render_large_HomePage(self)
      : self.props.size == "fullscreen" ?
        render_large_HomePage(self)
      : "Error: unauthorised access to entity."
    : "Error: unauthorised access to entity."
    if (self.props.mode == "view" && actions.length == 1 && !false)
      return <a onClick={() => actions[0]()}>
        <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
          {content}
        </div>
      </a>
    else
      return <div className={`${self.props.inline != undefined && self.props.inline ? "" : "model-content"} ${self.props.size == 'preview' ? 'model-content--preview' : ''}`}>
        {content}
      </div>
}





export function render_preview_HomePage(self:HomePageContext) {
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage(self.props.current_Admin))
    attributes = (<div className="model__attributes">
      
    </div>)
  else
    attributes = render_editable_attributes_minimised_HomePage(self)
  return (<div className="block">
      {attributes}
    </div>)
}

export function render_large_HomePage(self:HomePageContext) {
  let state = self.state()
  let attributes:JSX.Element = null
  if (self.props.mode == "view" || !Permissions.can_edit_HomePage(self.props.current_Admin))
    attributes = (<div className="model__attributes">
      
        
    </div>)
  else
    attributes = render_editable_attributes_maximised_HomePage(self)
  return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_HomePage(self)}
    </div>)
}


export function render_HomePage_HomePage_BIDiagram(self:HomePageContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "HomePage_BIDiagram") || !Permissions.can_view_BIDiagram(self.props.current_Admin))
    return null
  let state = self.state()
  if (state.BIDiagram_HomePage == "loading")
    load_relation_HomePage_HomePage_BIDiagram(self, false, self.props.current_Admin)

  return <div>
  
    { List.render_relation("homepage_homepage_bidiagram",
   "HomePage",
   "BIDiagram",
   "BIDiagrams",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.BIDiagram_HomePage != "loading" ?
        state.BIDiagram_HomePage.IdsInServerOrder.map(id => state.BIDiagram_HomePage != "loading" && state.BIDiagram_HomePage.Items.get(id)):
        state.BIDiagram_HomePage,
      HomePage_HomePage_BIDiagram_page_index(self),
      HomePage_HomePage_BIDiagram_num_pages(self),
      (new_page_index, callback) => {
          let state = self.state()
          state.BIDiagram_HomePage != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            BIDiagram_HomePage: {
              ...state.BIDiagram_HomePage,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_HomePage_HomePage_BIDiagram(self, false ,self.props.current_Admin, callback))
        },
      (i,index) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={"HomePage_HomePage_BIDiagram_" + index + "_" + i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.BIDiagram_HomePage != "loading" && state.BIDiagram_HomePage.JustCreated.has(i_id) && state.BIDiagram_HomePage.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={"HomePage_HomePage_BIDiagram_" + i_id}>
              {
                BIDiagramViews.BIDiagram({
                  ...self.props,
                  entity:i.element,
                  inline:false,
                  nesting_depth:self.props.nesting_depth+1,
                  size: i.size,
                  allow_maximisation:true,
                  allow_fullscreen:true,
                  mode:self.props.mode == "edit" && (Permissions.can_edit_HomePage_BIDiagram(self.props.current_Admin)
                        || Permissions.can_create_HomePage_BIDiagram(self.props.current_Admin)
                        || Permissions.can_delete_HomePage_BIDiagram(self.props.current_Admin)) ?
                    self.props.mode : "view",
                  is_editable:state.BIDiagram_HomePage != "loading" && state.BIDiagram_HomePage.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.BIDiagram_HomePage != "loading" &&
                    self.setState({...self.state(),
                      BIDiagram_HomePage:
                        {
                          ...state.BIDiagram_HomePage,
                          Items:state.BIDiagram_HomePage.Items.set(i_id,{...state.BIDiagram_HomePage.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("BIDiagram"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.BIDiagram_HomePage != "loading" &&
                    self.setState({...self.state(),
                      BIDiagram_HomePage:
                        {
                          ...state.BIDiagram_HomePage,
                          Items:state.BIDiagram_HomePage.Items.set(i_id,
                            {...state.BIDiagram_HomePage.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.BIDiagram, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.BIDiagram_HomePage != "loading" &&
                    self.setState({...self.state(),
                      dirty_BIDiagram_HomePage:state.dirty_BIDiagram_HomePage.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      BIDiagram_HomePage:
                        {
                          ...state.BIDiagram_HomePage,
                          Items:state.BIDiagram_HomePage.Items.set(i_id,{...state.BIDiagram_HomePage.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                    delete: !Permissions.can_delete_BIDiagram(self.props.current_Admin) || !HomePage_HomePage_BIDiagram_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_BIDiagram(i.element).then(() =>
                      load_relation_HomePage_HomePage_BIDiagram(self, false, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          {Permissions.can_create_BIDiagram(self.props.current_Admin) && Permissions.can_create_HomePage_BIDiagram(self.props.current_Admin) && HomePage_HomePage_BIDiagram_can_create(self) ? render_new_HomePage_HomePage_BIDiagram(self) : null}
          
        </div>)
    }
    
    </div>
}



export function render_relations_HomePage(self:HomePageContext) {
  return <div className="relations">
      { render_HomePage_HomePage_BIDiagram(self, "default") }
      
    </div>
}



export function render_new_HomePage_HomePage_BIDiagram(self:HomePageContext) {
    let state = self.state()
    return  self.props.mode == "edit"  ?
      <div className="button__actions">
        <div className="new-bidiagram">
              <button 
                      className="new-bidiagram button button--new"
                      onClick={() =>
                          Api.create_BIDiagram().then(e => {
                              Api.update_BIDiagram(
                                ({ ...e, ActivityId:"", Title:"", GenerateRepeatingActivityEditions:"" } as Models.BIDiagram)).then(() =>
                                load_relation_HomePage_HomePage_BIDiagram(self, true, self.props.current_Admin, () =>
                                    self.setState({...self.state(), add_step_BIDiagram_HomePage:"closed"})
                                  )
                                )
                          })
                      }>
                  {i18next.t('Create new BIDiagram')}
              </button>
            </div>
        </div>
      :
      null
    }
  

export function render_saving_animations_HomePage(self:HomePageContext) {
  return self.state().dirty_BIDiagram_HomePage.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type HomePageContext = {state:()=>HomePageState, props:Utils.EntityComponentProps<Models.HomePage>, setState:(new_state:HomePageState, callback?:()=>void) => void}

export type HomePageState = {
    update_count:number
    add_step_BIDiagram_HomePage:"closed"|"open"|"saving",
      dirty_BIDiagram_HomePage:Immutable.Map<number,Models.BIDiagram>,
      BIDiagram_HomePage:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.BIDiagram>>|"loading",
  }
export class HomePageComponent extends React.Component<Utils.EntityComponentProps<Models.HomePage>, HomePageState> {
  constructor(props:Utils.EntityComponentProps<Models.HomePage>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_BIDiagram_HomePage:"closed", dirty_BIDiagram_HomePage:Immutable.Map<number,Models.BIDiagram>(), BIDiagram_HomePage:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.HomePage>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {

      load_relations_HomePage(this.get_self(),  new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_HomePage(this.get_self(), this.props.current_Admin)
    }

    this.thread = window.setInterval(() => {
      if (this.state.dirty_BIDiagram_HomePage.count() > 0) {
         let first = this.state.dirty_BIDiagram_HomePage.first()
         this.setState({...this.state, dirty_BIDiagram_HomePage: this.state.dirty_BIDiagram_HomePage.remove(first.Id)}, () =>
           Api.update_BIDiagram(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_HomePage(this.props.current_Admin) ?
              render_breadcrumb_HomePage(this.get_self())
              : null
    }

    return <div id={`HomePage_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model homepage`}>
      { render_saving_animations_HomePage(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_HomePage(this.get_self()) : null }
      <div className={this.props.nesting_depth == 0 ? 'main__content' : ''}>
        {
          this.props.nesting_depth == 0 && !!this.props.toggle_button ?
          <div className="topbar">
            { this.props.breadcrumbs() }
            <div className="topbar__buttons">
              
                {this.props.toggle_button ? this.props.toggle_button() : null}
              { this.props.authentication_menu() }
            </div>
          </div>
          :
          null
        }
        
        { render_controls_HomePage(this.get_self()) }
        { render_content_HomePage(this.get_self()) }
      </div>
    </div>
  }
}

export let HomePage = (props:Utils.EntityComponentProps<Models.HomePage>) : JSX.Element =>
  <HomePageComponent {...props} />

export let HomePage_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_HomePage, Permissions.can_edit_HomePage_BIDiagram, Permissions.can_edit_BIDiagram])
  return Utils.scene_to_page<Models.HomePage>(can_edit, HomePage, Api.get_HomePage(id), Api.update_HomePage, "HomePage", "HomePage", `/admin/HomePages/${id}`)
}

export let HomePage_to = (id:number, slug:string, target_element_id:string, project_name:string, current_Admin:Models.Admin) => {
  Utils.render_page_manager(slug, target_element_id,
    HomePage_to_page(id),
    current_Admin
  )
  Api.project_name_set(project_name)
  
}
