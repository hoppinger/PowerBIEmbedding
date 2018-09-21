import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as Models from '../generated_models'
import * as Api from '../generated_api'
import * as List from '../components/list'

export let can_view_HomePage = (current_Admin:Models.Admin) => true 

export let can_create_HomePage = (current_Admin:Models.Admin) => false 

export let can_edit_HomePage = (current_Admin:Models.Admin) => current_Admin != null 

export let can_delete_HomePage = (current_Admin:Models.Admin) => false 




export let can_view_Admin = (current_Admin:Models.Admin) => current_Admin != null 

export let can_create_Admin = (current_Admin:Models.Admin) => current_Admin != null 

export let can_edit_Admin = (current_Admin:Models.Admin) => current_Admin != null 

export let can_delete_Admin = (current_Admin:Models.Admin) => current_Admin != null 

export let can_view_Admin_AdminId = (current_Admin:Models.Admin) => true 

export let can_edit_Admin_AdminId = (current_Admin:Models.Admin) => true 

export let can_view_Admin_Username = (current_Admin:Models.Admin) => true 

export let can_edit_Admin_Username = (current_Admin:Models.Admin) => true 

export let can_view_Admin_Language = (current_Admin:Models.Admin) => true 

export let can_edit_Admin_Language = (current_Admin:Models.Admin) => true 

export let can_view_Admin_Email = (current_Admin:Models.Admin) => true 

export let can_edit_Admin_Email = (current_Admin:Models.Admin) => true 



export let can_view_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_create_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_delete_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_view_BIDiagram_Title = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram_Title = (current_Admin:Models.Admin) => true 

export let can_view_BIDiagram_AccessToken = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram_AccessToken = (current_Admin:Models.Admin) => true 

export let can_view_BIDiagram_EmbedUrl = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram_EmbedUrl = (current_Admin:Models.Admin) => true 

export let can_view_BIDiagram_ReportID = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram_ReportID = (current_Admin:Models.Admin) => true 

export let can_view_BIDiagram_ReportType = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram_ReportType = (current_Admin:Models.Admin) => true 

export let can_view_BIDiagram_ShowBIView = (current_Admin:Models.Admin) => true 

export let can_edit_BIDiagram_ShowBIView = (current_Admin:Models.Admin) => true 






export let can_view_HomePage_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_create_HomePage_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_add_HomePage_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_edit_HomePage_BIDiagram = (current_Admin:Models.Admin) => true 

export let can_delete_HomePage_BIDiagram = (current_Admin:Models.Admin) => true 



