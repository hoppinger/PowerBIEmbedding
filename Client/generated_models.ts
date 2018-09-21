import * as Immutable from 'immutable'
import * as Moment from 'moment'

export type HomePage = {
    Id : number
    CreatedDate:Moment.Moment
    
    
    
  }
  
export type Admin = {
    Id : number
    CreatedDate:Moment.Moment
    
  Username : string
  Language : string
  Email : string
HasPassword:boolean
    
    EmailConfirmed: boolean
  }
  
export type BIDiagram = {
    Id : number
    CreatedDate:Moment.Moment
    Title : string
  AccessToken : string
  EmbedUrl : string
  ReportID : string
  ReportType : string
  
    
    
  }
  
export type HomePage_BIDiagram = {
    Id : number
    CreatedDate:Moment.Moment
    HomePageId : number
  BIDiagramId : number
    
    
  }
  

