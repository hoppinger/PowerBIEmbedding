import * as React from 'react';
import * as ViewUtils from '../generated_views/view_utils'
import * as Models from '../generated_models'


interface PowerBIDashboardViewState {
  generateResult: string
};

class PowerBIDashboardView extends React.Component<ViewUtils.EntityComponentProps<Models.BIDiagram>, PowerBIDashboardViewState> {

  constructor(props, context) {
    super(props, context);
    this.state = {
      generateResult: null
    }
  }

  renderResult() {
    return <div>result</div>
  }

  render() {
    return (
      <div>
        <hr/>
       TEST
      </div>
    )
  }
}

export default PowerBIDashboardView;

