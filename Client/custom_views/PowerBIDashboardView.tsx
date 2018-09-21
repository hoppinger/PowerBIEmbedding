import * as React from 'react';
import * as ViewUtils from '../generated_views/view_utils'
import * as Models from '../generated_models'
import { PowerBIReport } from '../powerbi-components/PowerBIReport';

// Embed configuration used to describe the what and how to embed.
// This object is used when calling powerbi.embed.
// This also includes settings and options such as filters.
// You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
/*
var config = {
  type: 'dashboard',
  tokenType: tokenType == '0' ? models.TokenType.Aad : models.TokenType.Embed,
  accessToken: txtAccessToken,
  embedUrl: txtEmbedUrl,
  id: txtEmbedDashboardId,
  pageView: 'fitToWidth'
};
*/
////https://microsoft.github.io/PowerBI-JavaScript/demo/v2-demo/index.html#
interface PowerBIDashboardViewState {
  id: string
  embedUrl: string
  accessToken: string
};
 
class PowerBIDashboardView extends React.Component<ViewUtils.EntityComponentProps<Models.BIDiagram>, {}> {

  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  onEmbedded(embed) {
    console.log(`Report embedded: `, embed, this);
  }
   
  render() {
    return (
      <div>
        <h1>react-powerbi demo</h1>
        <PowerBIReport

          id={this.props.entity.ReportID}
          embedUrl={this.props.entity.EmbedUrl}
          accessToken={this.props.entity.AccessToken}

          mode="View"

        />
      </div>
    )

  }
  
}

export default PowerBIDashboardView;

