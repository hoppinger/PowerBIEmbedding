import * as React from 'react';
import * as pbi from 'powerbi-client';
import * as util from './util';
declare var powerbi: pbi.service.Service;
/*
export interface IProps {
  id: string
  accessToken: string;
  embedUrl: string;
  pageName?: string;
  filters?: pbi.models.IFilter[];
  filterPaneEnabled?: boolean;
  navContentPaneEnabled?: boolean;
  onEmbedded?: (embed: pbi.Embed) => any;
}*/

export interface PowerBIReportProps extends pbi.IEmbedConfiguration {
  reportId?: string,
  mode?: string,
  name?: string,
  onEmbedded?: (embed: pbi.Embed) => any,
  filterPaneEnabled?: boolean,
  navContentPaneEnabled?: boolean,
}

export class PowerBIReport extends React.Component<PowerBIReportProps, {}> {
  component: pbi.Embed;
  rootElement: HTMLElement;
  
  constructor(props: PowerBIReportProps) {
    super(props);
    this.component = null;
    this.state = {
      type: 'report'
    };
  }

  componentDidMount() {
    this.updateState(this.props);
  }

  componentWillReceiveProps(nextProps: PowerBIReportProps) {
    this.updateState(nextProps);
  }

  componentDidUpdate() {
    if (this.validateConfig(this.state)) {
      this.embed(this.state);
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  embed(config: pbi.IEmbedConfiguration): pbi.Embed {
    this.component = powerbi.embed(this.rootElement, config);
    if (this.props.onEmbedded) {
      this.props.onEmbedded(this.component);
    }
    return this.component;
  }

  reset() {
    powerbi.reset(this.rootElement);
    this.component = null;
  }

  updateState(props: PowerBIReportProps) {
    const nextState = util.assign({}, this.state, props, {
      settings: {
        filterPaneEnabled: this.props.filterPaneEnabled,
        navContentPaneEnabled: this.props.navContentPaneEnabled
      }
    });
    /**
     * This property must be removed from the state object so that it doesn't get used in the embedConfig.
     * This would be passed to `powerbi.embed(element, embedConfig)` and attempted to be sent over postMessage;
     * however, functions cannot be cloned and it will fail.
     */
    delete nextState.onEmbedded;
    this.setState(nextState);
  }

  validateConfig(config: pbi.IEmbedConfiguration) {
    const errors = pbi.models.validateReportLoad(config);
    return (errors === undefined);
  }

  render() {
    return (
      <div>
        <div className="powerbi-frame" ref={(ref) => this.rootElement = ref}></div>
        <div>
          Token: <pre>{this.props.accessToken}</pre>
          Url: <pre>{this.props.embedUrl}</pre>
          id: <pre>{this.props.id}</pre>
          type: <pre>{this.props.type}</pre>
          mode: <pre>{this.props.mode} ({this.props.viewMode})</pre>
        </div>
      </div>
    )
  }
}

// Report.propTypes = {
//   accessToken: React.PropTypes.string,
//   embedUrl: React.PropTypes.string
// }

//export default PowerBIReport;
