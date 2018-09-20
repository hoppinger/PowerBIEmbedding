import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as List from './components/list'
import * as Models from './generated_models'
import * as Api from './generated_api'
import * as ViewUtils from './generated_views/view_utils'

import { EntityComponentProps } from "./generated_views/view_utils"
import PowerBIDashboardView from "./custom_views/PowerBIDashboardView"

export const renderEntityId: (props: EntityComponentProps<{ Id: number }>) => JSX.Element =
  props => <div>{"Id: " + props.entity.Id}</div>

export const GenerateRepeatingActivityEditions = (props: ViewUtils.EntityComponentProps<Models.BIDiagram>) => {
  return (
    <PowerBIDashboardView {...props} />
  )
}