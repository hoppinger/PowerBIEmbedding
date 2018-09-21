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
import * as HomePageViews from './HomePage'
import * as CustomViews from '../custom_views'

export function BIDiagram_BIDiagram_HomePage_can_create(self:BIDiagramContext) {
  let state = self.state()
  return state.HomePage_BIDiagram == "loading" ? false : state.HomePage_BIDiagram.CanCreate
}
export function BIDiagram_BIDiagram_HomePage_can_delete(self:BIDiagramContext) {
  let state = self.state()
  return state.HomePage_BIDiagram == "loading" ? false : state.HomePage_BIDiagram.CanDelete
}
export function BIDiagram_BIDiagram_HomePage_page_index(self:BIDiagramContext) {
  let state = self.state()
  return state.HomePage_BIDiagram == "loading" ? 0 : state.HomePage_BIDiagram.PageIndex
}
export function BIDiagram_BIDiagram_HomePage_page_size(self:BIDiagramContext) {
  let state = self.state()
  return state.HomePage_BIDiagram == "loading" ? 25 : state.HomePage_BIDiagram.PageSize
}
export function BIDiagram_BIDiagram_HomePage_search_query(self:BIDiagramContext) {
  let state = self.state()
  return state.HomePage_BIDiagram == "loading" ? null : state.HomePage_BIDiagram.SearchQuery
}
export function BIDiagram_BIDiagram_HomePage_num_pages(self:BIDiagramContext) {
  let state = self.state()
  return state.HomePage_BIDiagram == "loading" ? 1 : state.HomePage_BIDiagram.NumPages
}

export function load_relation_BIDiagram_BIDiagram_HomePage(self:BIDiagramContext, force_first_page:boolean, current_Admin:Models.Admin, callback?:()=>void) {
  let state = self.state()
  let prelude = force_first_page && state.HomePage_BIDiagram != "loading" ?
    (c:() => void) => state.HomePage_BIDiagram != "loading" && self.setState({
      ...state,
      HomePage_BIDiagram: {...state.HomePage_BIDiagram, PageIndex:0 }
    }, c)
    :
    (c:() => void) => c()
  Permissions.can_view_HomePage(current_Admin) ?
    prelude(() => {
      var items = Api.get_BIDiagram_HomePage_BIDiagrams(self.props.entity, BIDiagram_BIDiagram_HomePage_page_index(self), BIDiagram_BIDiagram_HomePage_page_size(self))

      items.then(HomePages =>
        self.setState({...self.state(), update_count:self.state().update_count+1,
            HomePage_BIDiagram:Utils.raw_page_to_paginated_items<Models.HomePage, Utils.EntityAndSize<Models.HomePage> & { shown_relation:string }>((i, i_just_created) => {
              let state = self.state()
              return {
                element:i,
                size: state.HomePage_BIDiagram != "loading" ?
                  (state.HomePage_BIDiagram.Items.has(i.Id) ?
                    state.HomePage_BIDiagram.Items.get(i.Id).size
                  :
                    "preview")
                  :
                    "preview",
                shown_relation:"all"}}, {...HomePages, SearchQuery: BIDiagram_BIDiagram_HomePage_search_query(self)})
            }, callback))
    })
    :
      prelude(() => callback && callback())
}

export function load_relations_BIDiagram(self, current_Admin:Models.Admin, callback?:()=>void) {
  callback && callback()
}

export function set_size_BIDiagram(self:BIDiagramContext, new_size:Utils.EntitySize) {
  self.props.set_size(new_size, () => {
    if (new_size == "fullscreen")
      self.props.push(BIDiagram_to_page(self.props.entity.Id))
  })
}

export function render_BIDiagram_Title_editable_minimised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_Title_minimised(self)
  else
    return !Permissions.can_view_BIDiagram_Title(self.props.current_Admin) ? <div /> :
          <div className="model__attribute title">
  <label className="attribute-label attribute-label-title">{i18next.t(`BIDiagram:Title`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_Title(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.Title,
      v => self.props.set_entity({...self.props.entity, Title:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_AccessToken_editable_minimised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_AccessToken_minimised(self)
  else
    return !Permissions.can_view_BIDiagram_AccessToken(self.props.current_Admin) ? <div /> :
          <div className="model__attribute accesstoken">
  <label className="attribute-label attribute-label-accesstoken">{i18next.t(`BIDiagram:AccessToken`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_AccessToken(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.AccessToken,
      v => self.props.set_entity({...self.props.entity, AccessToken:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_EmbedUrl_editable_minimised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_EmbedUrl_minimised(self)
  else
    return !Permissions.can_view_BIDiagram_EmbedUrl(self.props.current_Admin) ? <div /> :
          <div className="model__attribute embedurl">
  <label className="attribute-label attribute-label-embedurl">{i18next.t(`BIDiagram:EmbedUrl`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_EmbedUrl(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.EmbedUrl,
      v => self.props.set_entity({...self.props.entity, EmbedUrl:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_ReportID_editable_minimised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_ReportID_minimised(self)
  else
    return !Permissions.can_view_BIDiagram_ReportID(self.props.current_Admin) ? <div /> :
          <div className="model__attribute reportid">
  <label className="attribute-label attribute-label-reportid">{i18next.t(`BIDiagram:ReportID`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportID(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportID,
      v => self.props.set_entity({...self.props.entity, ReportID:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_ReportType_editable_minimised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_ReportType_minimised(self)
  else
    return !Permissions.can_view_BIDiagram_ReportType(self.props.current_Admin) ? <div /> :
          <div className="model__attribute reporttype">
  <label className="attribute-label attribute-label-reporttype">{i18next.t(`BIDiagram:ReportType`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportType(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportType,
      v => self.props.set_entity({...self.props.entity, ReportType:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_ShowBIView_editable_minimised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_ShowBIView_minimised(self)
  else
    return !Permissions.can_view_BIDiagram_ShowBIView(self.props.current_Admin) ? <div /> :
          null
}


export function render_BIDiagram_Title_editable_maximised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_Title_maximised(self)
  else
    return !Permissions.can_view_BIDiagram_Title(self.props.current_Admin) ? <div /> :
          <div className="model__attribute title">
  <label className="attribute-label attribute-label-title">{i18next.t(`BIDiagram:Title`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_Title(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.Title,
      v => self.props.set_entity({...self.props.entity, Title:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_AccessToken_editable_maximised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_AccessToken_maximised(self)
  else
    return !Permissions.can_view_BIDiagram_AccessToken(self.props.current_Admin) ? <div /> :
          <div className="model__attribute accesstoken">
  <label className="attribute-label attribute-label-accesstoken">{i18next.t(`BIDiagram:AccessToken`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_AccessToken(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.AccessToken,
      v => self.props.set_entity({...self.props.entity, AccessToken:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_EmbedUrl_editable_maximised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_EmbedUrl_maximised(self)
  else
    return !Permissions.can_view_BIDiagram_EmbedUrl(self.props.current_Admin) ? <div /> :
          <div className="model__attribute embedurl">
  <label className="attribute-label attribute-label-embedurl">{i18next.t(`BIDiagram:EmbedUrl`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_EmbedUrl(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.EmbedUrl,
      v => self.props.set_entity({...self.props.entity, EmbedUrl:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_ReportID_editable_maximised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_ReportID_maximised(self)
  else
    return !Permissions.can_view_BIDiagram_ReportID(self.props.current_Admin) ? <div /> :
          <div className="model__attribute reportid">
  <label className="attribute-label attribute-label-reportid">{i18next.t(`BIDiagram:ReportID`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportID(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportID,
      v => self.props.set_entity({...self.props.entity, ReportID:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_ReportType_editable_maximised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_ReportType_maximised(self)
  else
    return !Permissions.can_view_BIDiagram_ReportType(self.props.current_Admin) ? <div /> :
          <div className="model__attribute reporttype">
  <label className="attribute-label attribute-label-reporttype">{i18next.t(`BIDiagram:ReportType`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportType(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportType,
      v => self.props.set_entity({...self.props.entity, ReportType:v})) }
      
  </div>
</div>
}

export function render_BIDiagram_ShowBIView_editable_maximised(self:BIDiagramContext) : JSX.Element {
  if (!Permissions.can_edit_BIDiagram(self.props.current_Admin)) return render_BIDiagram_ShowBIView_maximised(self)
  else
    return !Permissions.can_view_BIDiagram_ShowBIView(self.props.current_Admin) ? <div /> :
          <div className="model__attribute showbiview">
  <div className="model__attribute-content">
    {CustomViews.ShowBIView({...self.props})}
  </div>
</div>
}


export function render_editable_attributes_minimised_BIDiagram(self:BIDiagramContext) {
  let attributes = (<div>
      {render_BIDiagram_Title_editable_minimised(self)}
        {render_BIDiagram_AccessToken_editable_minimised(self)}
        {render_BIDiagram_EmbedUrl_editable_minimised(self)}
        {render_BIDiagram_ReportID_editable_minimised(self)}
        {render_BIDiagram_ReportType_editable_minimised(self)}
    </div>)
  return attributes
}

export function render_editable_attributes_maximised_BIDiagram(self:BIDiagramContext) {
    let state = self.state()
    let attributes = (<div>
        {render_BIDiagram_Title_editable_maximised(self)}
        {render_BIDiagram_AccessToken_editable_maximised(self)}
        {render_BIDiagram_EmbedUrl_editable_maximised(self)}
        {render_BIDiagram_ReportID_editable_maximised(self)}
        {render_BIDiagram_ReportType_editable_maximised(self)}{CustomViews.ShowBIView({...self.props})}
        
        
      </div>)
    return attributes
  }

export function render_breadcrumb_BIDiagram(self:BIDiagramContext) {
  return <div className="breadcrumb-bidiagram">{i18next.t("BIDiagram")}</div>
}

export function render_menu_BIDiagram(self:BIDiagramContext) {
  let state = self.state()
  return <div className="menu">
        <img className="logo" src={"/images/logo.png"} alt="Logo"/>
        <div className="pages">
          {!Permissions.can_view_HomePage(self.props.current_Admin) ? null :
              <div className={`menu_entry page_link`}>
                <a onClick={() => 
                  Api.get_HomePages(0, 1).then(e =>
                    e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id))
                  )
                }>
                  {i18next.t('HomePage')}
                </a>
              </div>
            }
          <div className="menu_entries">
          
            {!Permissions.can_view_BIDiagram(self.props.current_Admin) ? null :
                  <div className={`menu_entry active`}>
                    <a onClick={() =>
                        {
                            Api.get_HomePages(0, 1).then(e =>
                              e.Items.length > 0 && self.props.set_page(HomePageViews.HomePage_to_page(e.Items[0].Item.Id),
                                () => self.props.set_shown_relation("HomePage_BIDiagram"))
                            )
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

export function render_local_menu_BIDiagram(self:BIDiagramContext) {
  let state = self.state()
  return <div className="local-menu">
          <div className="local_menu_entries">
            <div className={`local_menu_entry${self.props.shown_relation == "none" ? " local_menu_entry--active" : ""}`}>
              <a onClick={() =>
                  self.props.set_shown_relation("none")
              }>
                {i18next.t('About this BIDiagram')}
              </a>
            </div>
          
              
          </div>
        </div>
}

export function render_controls_BIDiagram(self:BIDiagramContext) {
  return true ? <div className="control">
    {self.props.allow_maximisation && self.props.set_size ? <a className={`"bidiagram button button--toggle ${self.props.size != 'preview' ? 'button--toggle--open' : ''}`}
          onClick={() => {
            set_size_BIDiagram(self, self.props.size == "preview" ? "large" : "preview")}
          }>
      </a> : null}
    {Permissions.can_delete_BIDiagram(self.props.current_Admin) && self.props.size == "fullscreen" ? <a className="button button--delete"
      onClick={() => confirm(i18next.t('Are you sure?')) &&
        Api.delete_BIDiagram(self.props.entity).then(() => self.props.force_reload(() => self.props.pop()))
      }>
    </a> : null}
    {self.props.size == "fullscreen" && self.props.pages_count > 0 ? <a className="bidiagram button button--close"
        onClick={() => self.props.pop()}>
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

export function render_content_BIDiagram(self:BIDiagramContext) {
  let actions:Array<()=>void> =
    [
      self.props.allow_maximisation && self.props.set_size && self.props.size == "preview" ?
        () => set_size_BIDiagram(self, self.props.size == "preview" ? "large" : "preview")
      :
        null,
    ].filter(a => a != null)
  let content =
    Permissions.can_view_BIDiagram(self.props.current_Admin) ?
      self.props.size == "preview" ?
        render_preview_BIDiagram(self)
      : self.props.size == "large" ?
        render_large_BIDiagram(self)
      : self.props.size == "fullscreen" ?
        render_large_BIDiagram(self)
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

export function render_BIDiagram_Title_minimised(self:BIDiagramContext) : JSX.Element {
      return !Permissions.can_view_BIDiagram_Title(self.props.current_Admin) ? null : <div className="model__attribute title">
  <label className="attribute-label attribute-label-title">{i18next.t(`BIDiagram:Title`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_Title(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.Title,
      v => self.props.set_entity({...self.props.entity, Title:v})) }
      
  </div>
</div>
      
}
        export function render_BIDiagram_AccessToken_minimised(self:BIDiagramContext) : JSX.Element {
      return !Permissions.can_view_BIDiagram_AccessToken(self.props.current_Admin) ? null : <div className="model__attribute accesstoken">
  <label className="attribute-label attribute-label-accesstoken">{i18next.t(`BIDiagram:AccessToken`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_AccessToken(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.AccessToken,
      v => self.props.set_entity({...self.props.entity, AccessToken:v})) }
      
  </div>
</div>
      
}
        export function render_BIDiagram_EmbedUrl_minimised(self:BIDiagramContext) : JSX.Element {
      return !Permissions.can_view_BIDiagram_EmbedUrl(self.props.current_Admin) ? null : <div className="model__attribute embedurl">
  <label className="attribute-label attribute-label-embedurl">{i18next.t(`BIDiagram:EmbedUrl`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_EmbedUrl(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.EmbedUrl,
      v => self.props.set_entity({...self.props.entity, EmbedUrl:v})) }
      
  </div>
</div>
      
}
        export function render_BIDiagram_ReportID_minimised(self:BIDiagramContext) : JSX.Element {
      return !Permissions.can_view_BIDiagram_ReportID(self.props.current_Admin) ? null : <div className="model__attribute reportid">
  <label className="attribute-label attribute-label-reportid">{i18next.t(`BIDiagram:ReportID`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportID(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportID,
      v => self.props.set_entity({...self.props.entity, ReportID:v})) }
      
  </div>
</div>
      
}
        export function render_BIDiagram_ReportType_minimised(self:BIDiagramContext) : JSX.Element {
      return !Permissions.can_view_BIDiagram_ReportType(self.props.current_Admin) ? null : <div className="model__attribute reporttype">
  <label className="attribute-label attribute-label-reporttype">{i18next.t(`BIDiagram:ReportType`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportType(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportType,
      v => self.props.set_entity({...self.props.entity, ReportType:v})) }
      
  </div>
</div>
      
}
        export function render_BIDiagram_ShowBIView_minimised(self:BIDiagramContext) : JSX.Element {
      return null
}

export function render_BIDiagram_Title_maximised(self:BIDiagramContext) : JSX.Element {
        return !Permissions.can_view_BIDiagram_Title(self.props.current_Admin) ? null : <div className="model__attribute title">
  <label className="attribute-label attribute-label-title">{i18next.t(`BIDiagram:Title`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_Title(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.Title,
      v => self.props.set_entity({...self.props.entity, Title:v})) }
      
  </div>
</div>
}
        export function render_BIDiagram_AccessToken_maximised(self:BIDiagramContext) : JSX.Element {
        return !Permissions.can_view_BIDiagram_AccessToken(self.props.current_Admin) ? null : <div className="model__attribute accesstoken">
  <label className="attribute-label attribute-label-accesstoken">{i18next.t(`BIDiagram:AccessToken`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_AccessToken(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.AccessToken,
      v => self.props.set_entity({...self.props.entity, AccessToken:v})) }
      
  </div>
</div>
}
        export function render_BIDiagram_EmbedUrl_maximised(self:BIDiagramContext) : JSX.Element {
        return !Permissions.can_view_BIDiagram_EmbedUrl(self.props.current_Admin) ? null : <div className="model__attribute embedurl">
  <label className="attribute-label attribute-label-embedurl">{i18next.t(`BIDiagram:EmbedUrl`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_EmbedUrl(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.EmbedUrl,
      v => self.props.set_entity({...self.props.entity, EmbedUrl:v})) }
      
  </div>
</div>
}
        export function render_BIDiagram_ReportID_maximised(self:BIDiagramContext) : JSX.Element {
        return !Permissions.can_view_BIDiagram_ReportID(self.props.current_Admin) ? null : <div className="model__attribute reportid">
  <label className="attribute-label attribute-label-reportid">{i18next.t(`BIDiagram:ReportID`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportID(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportID,
      v => self.props.set_entity({...self.props.entity, ReportID:v})) }
      
  </div>
</div>
}
        export function render_BIDiagram_ReportType_maximised(self:BIDiagramContext) : JSX.Element {
        return !Permissions.can_view_BIDiagram_ReportType(self.props.current_Admin) ? null : <div className="model__attribute reporttype">
  <label className="attribute-label attribute-label-reporttype">{i18next.t(`BIDiagram:ReportType`, {context: self.props.inline ? "inline" : ""})}</label>
  <div className="model__attribute-content">
    { Components.String(
      self.props.is_editable && Permissions.can_edit_BIDiagram(self.props.current_Admin) && Permissions.can_edit_BIDiagram_ReportType(self.props.current_Admin),
      self.props.mode,
      () => self.props.entity.ReportType,
      v => self.props.set_entity({...self.props.entity, ReportType:v})) }
      
  </div>
</div>
}
        export function render_BIDiagram_ShowBIView_maximised(self:BIDiagramContext) : JSX.Element {
        return !Permissions.can_view_BIDiagram_ShowBIView(self.props.current_Admin) ? null : <div className="model__attribute showbiview">
  <div className="model__attribute-content">
    {CustomViews.ShowBIView({...self.props})}
  </div>
</div>
}

export function render_preview_BIDiagram(self:BIDiagramContext) {
  if (self.props.mode == "view" || !Permissions.can_edit_BIDiagram(self.props.current_Admin))
    return (<div className="block">
        { render_BIDiagram_Title_minimised(self) }
    { render_BIDiagram_AccessToken_minimised(self) }
    { render_BIDiagram_EmbedUrl_minimised(self) }
    { render_BIDiagram_ReportID_minimised(self) }
    { render_BIDiagram_ReportType_minimised(self) }
    { render_BIDiagram_ShowBIView_minimised(self) }
    </div>)
  else
    return (<div className="block">
        { render_BIDiagram_Title_editable_minimised(self) }
    { render_BIDiagram_AccessToken_editable_minimised(self) }
    { render_BIDiagram_EmbedUrl_editable_minimised(self) }
    { render_BIDiagram_ReportID_editable_minimised(self) }
    { render_BIDiagram_ReportType_editable_minimised(self) }
    { render_BIDiagram_ShowBIView_editable_minimised(self) }
    </div>)

}

export function render_large_BIDiagram(self:BIDiagramContext) {
  let state = self.state()
  if (self.props.mode == "view" || !Permissions.can_edit_BIDiagram(self.props.current_Admin)) {
    let attributes = <div>
        { render_BIDiagram_Title_maximised(self) }
    { render_BIDiagram_AccessToken_maximised(self) }
    { render_BIDiagram_EmbedUrl_maximised(self) }
    { render_BIDiagram_ReportID_maximised(self) }
    { render_BIDiagram_ReportType_maximised(self) }
    { render_BIDiagram_ShowBIView_maximised(self) }
        
      </div>
    return (<div className="block">
      {self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes}
      {render_relations_BIDiagram(self)}
    </div>)
  } else {
    let attributes = <div>
        { render_BIDiagram_Title_editable_maximised(self) }
    { render_BIDiagram_AccessToken_editable_maximised(self) }
    { render_BIDiagram_EmbedUrl_editable_maximised(self) }
    { render_BIDiagram_ReportID_editable_maximised(self) }
    { render_BIDiagram_ReportType_editable_maximised(self) }
    { render_BIDiagram_ShowBIView_editable_maximised(self) }
        
        
      </div>
    return (<div className="block">
      { self.props.nesting_depth == 0 && self.props.shown_relation != "all" && self.props.shown_relation != "none" ? null : attributes }
      { self.props.size == "fullscreen" ? render_relations_BIDiagram(self) : null }
    </div>)
  }

}


export function render_BIDiagram_BIDiagram_HomePage(self:BIDiagramContext, context:"presentation_structure"|"default") {
  if ((context == "default" && self.props.shown_relation != "all" && self.props.shown_relation != "BIDiagram_HomePage") || !Permissions.can_view_HomePage(self.props.current_Admin))
    return null
  let state = self.state()
  if (state.HomePage_BIDiagram == "loading")
    load_relation_BIDiagram_BIDiagram_HomePage(self, false, self.props.current_Admin)

  return <div>
  
    { List.render_relation("bidiagram_bidiagram_homepage",
   "BIDiagram",
   "HomePage",
   "HomePages",
   self.props.nesting_depth > 0,
   false,
   false,
   false)
  (
      state.HomePage_BIDiagram != "loading" ?
        state.HomePage_BIDiagram.IdsInServerOrder.map(id => state.HomePage_BIDiagram != "loading" && state.HomePage_BIDiagram.Items.get(id)):
        state.HomePage_BIDiagram,
      BIDiagram_BIDiagram_HomePage_page_index(self),
      BIDiagram_BIDiagram_HomePage_num_pages(self),
      (new_page_index, callback) => {
          let state = self.state()
          state.HomePage_BIDiagram != "loading" &&
          self.setState({...self.state(),
            update_count:self.state().update_count+1,
            HomePage_BIDiagram: {
              ...state.HomePage_BIDiagram,
              PageIndex:new_page_index
            }
          }, () =>  load_relation_BIDiagram_BIDiagram_HomePage(self, false ,self.props.current_Admin, callback))
        },
      (i,index) => {
          let i_id = i.element.Id
          let state = self.state()
          return <div key={"BIDiagram_BIDiagram_HomePage_" + index + "_" + i_id}
            className={`model-nested__item ${i.size != "preview" ? "model-nested__item--open" : ""}
                        ${state.HomePage_BIDiagram != "loading" && state.HomePage_BIDiagram.JustCreated.has(i_id) && state.HomePage_BIDiagram.JustCreated.get(i_id) ? "newly-created" : ""}` }
          
            >
            <div key={"BIDiagram_BIDiagram_HomePage_" + i_id}>
              {
                HomePageViews.HomePage({
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
                  is_editable:state.HomePage_BIDiagram != "loading" && state.HomePage_BIDiagram.Editable.get(i_id),
                  shown_relation:i.shown_relation,
                  set_shown_relation:(new_shown_relation:string, callback) => {
                    let state = self.state()
                    state.HomePage_BIDiagram != "loading" &&
                    self.setState({...self.state(),
                      HomePage_BIDiagram:
                        {
                          ...state.HomePage_BIDiagram,
                          Items:state.HomePage_BIDiagram.Items.set(i_id,{...state.HomePage_BIDiagram.Items.get(i_id), shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                  nested_entity_names: self.props.nested_entity_names.push("HomePage"),
                  
                  set_size:(new_size:Utils.EntitySize, callback) => {
                    let new_shown_relation = new_size == "large" ? "all" : i.shown_relation
                    let state = self.state()
                    state.HomePage_BIDiagram != "loading" &&
                    self.setState({...self.state(),
                      HomePage_BIDiagram:
                        {
                          ...state.HomePage_BIDiagram,
                          Items:state.HomePage_BIDiagram.Items.set(i_id,
                            {...state.HomePage_BIDiagram.Items.get(i_id),
                              size:new_size, shown_relation:new_shown_relation})
                        }
                    }, callback)
                  },
                    
                  toggle_button:undefined,
                  set_mode:undefined,
                  set_entity:(new_entity:Models.HomePage, callback?:()=>void, force_update_count_increment?:boolean) => {
                    let state = self.state()
                    state.HomePage_BIDiagram != "loading" &&
                    self.setState({...self.state(),
                      dirty_HomePage_BIDiagram:state.dirty_HomePage_BIDiagram.set(i_id, new_entity),
                      update_count:force_update_count_increment ? self.state().update_count+1 : state.update_count,
                      HomePage_BIDiagram:
                        {
                          ...state.HomePage_BIDiagram,
                          Items:state.HomePage_BIDiagram.Items.set(i_id,{...state.HomePage_BIDiagram.Items.get(i_id), element:new_entity})
                        }
                    }, callback)
                  },
                  unlink: undefined,
                    delete: !Permissions.can_delete_HomePage(self.props.current_Admin) || !BIDiagram_BIDiagram_HomePage_can_delete(self) ?
                    null
                    :
                    () => confirm(i18next.t('Are you sure?')) && Api.delete_HomePage(i.element).then(() =>
                      load_relation_BIDiagram_BIDiagram_HomePage(self, false, self.props.current_Admin))
                })
              }
            </div>
          </div>
        },
      () =>
        <div>
          
          
        </div>)
    }
    
    </div>
}



export function render_relations_BIDiagram(self:BIDiagramContext) {
  return <div className="relations">
      
      
    </div>
}





export function render_saving_animations_BIDiagram(self:BIDiagramContext) {
  return self.state().dirty_HomePage_BIDiagram.count() > 0 ?
    <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"red"}} className="saving"/>
    : <div style={{position:"fixed", zIndex:10000, top:0, left:0, width:"20px", height:"20px", backgroundColor:"cornflowerblue"}} className="saved"/>
}

export type BIDiagramContext = {state:()=>BIDiagramState, props:Utils.EntityComponentProps<Models.BIDiagram>, setState:(new_state:BIDiagramState, callback?:()=>void) => void}

export type BIDiagramState = {
    update_count:number
    add_step_HomePage_BIDiagram:"closed"|"open"|"saving",
      dirty_HomePage_BIDiagram:Immutable.Map<number,Models.HomePage>,
      HomePage_BIDiagram:Utils.PaginatedItems<{ shown_relation: string } & Utils.EntityAndSize<Models.HomePage>>|"loading",
  }
export class BIDiagramComponent extends React.Component<Utils.EntityComponentProps<Models.BIDiagram>, BIDiagramState> {
  constructor(props:Utils.EntityComponentProps<Models.BIDiagram>, context:any) {
    super(props, context)
    this.state = { update_count:0,add_step_HomePage_BIDiagram:"closed", dirty_HomePage_BIDiagram:Immutable.Map<number,Models.HomePage>(), HomePage_BIDiagram:"loading" }
  }

  get_self() {
    return {state:() => this.state, props:this.props, setState:(ns,c)=>this.setState(ns,c)}
  }

  componentWillReceiveProps(new_props:Utils.EntityComponentProps<Models.BIDiagram>) {
    if (new_props.size == "breadcrumb") return
    let current_logged_in_entity = this.props.current_Admin || null
    let new_logged_in_entity = new_props.current_Admin || null
    if (new_props.mode != this.props.mode || (new_props.size != this.props.size && (new_props.size == "large" || new_props.size == "fullscreen")) ||
        new_props.logic_frame != this.props.logic_frame ||
        (current_logged_in_entity && !new_logged_in_entity) ||
        (!current_logged_in_entity && new_logged_in_entity) ||
        (current_logged_in_entity && new_logged_in_entity && current_logged_in_entity.Id != new_logged_in_entity.Id)) {

      load_relations_BIDiagram(this.get_self(),  new_props.current_Admin)
    }
  }

  thread:number = null
  componentWillMount() {
    if (this.props.size == "breadcrumb") return
    if (this.props.size != "preview") {
      
      load_relations_BIDiagram(this.get_self(), this.props.current_Admin)
    }

    this.thread = window.setInterval(() => {
      if (this.state.dirty_HomePage_BIDiagram.count() > 0) {
         let first = this.state.dirty_HomePage_BIDiagram.first()
         this.setState({...this.state, dirty_HomePage_BIDiagram: this.state.dirty_HomePage_BIDiagram.remove(first.Id)}, () =>
           Api.update_HomePage(first)
         )
       }

    }, 500)
  }

  componentWillUnmount() {
    clearInterval(this.thread)
  }

  render() {
    if (this.props.size == "breadcrumb") {
      return Permissions.can_view_BIDiagram(this.props.current_Admin) ?
              render_breadcrumb_BIDiagram(this.get_self())
              : null
    }

    return <div id={`BIDiagram_${this.props.entity.Id.toString()}_${this.state.update_count}`} className={`model bidiagram`}>
      { render_saving_animations_BIDiagram(this.get_self()) }
      { this.props.nesting_depth == 0 ? render_menu_BIDiagram(this.get_self()) : null }
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
        { this.props.nesting_depth == 0 ? render_local_menu_BIDiagram(this.get_self()) : null }
        { render_controls_BIDiagram(this.get_self()) }
        { render_content_BIDiagram(this.get_self()) }
      </div>
    </div>
  }
}

export let BIDiagram = (props:Utils.EntityComponentProps<Models.BIDiagram>) : JSX.Element =>
  <BIDiagramComponent {...props} />

export let BIDiagram_to_page = (id:number) => {
  let can_edit = Utils.any_of([Permissions.can_edit_BIDiagram, Permissions.can_edit_HomePage_BIDiagram, Permissions.can_edit_HomePage])
  return Utils.scene_to_page<Models.BIDiagram>(can_edit, BIDiagram, Api.get_BIDiagram(id), Api.update_BIDiagram, "BIDiagram", "BIDiagram", `/admin/BIDiagrams/${id}`)
}

export let BIDiagram_to = (id:number, slug:string, target_element_id:string, project_name:string, current_Admin:Models.Admin) => {
  Utils.render_page_manager(slug, target_element_id,
    BIDiagram_to_page(id),
    current_Admin
  )
  Api.project_name_set(project_name)
  
}
