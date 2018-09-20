import * as React from "react"
import * as ReactDOM from "react-dom"
import * as Immutable from "immutable"
import * as i18next from 'i18next'
import * as Api from '../generated_api'

export type BlobImageProps = {
  src:string,
  delete:()=>Promise<void>,
  upload:(src:File)=>Promise<void>,
  can_edit:boolean }
export type BlobImageState = { image:"uploading"|"loading"|"deleting"|{src:string} }
export class BlobImage extends React.Component<BlobImageProps, BlobImageState> {
  private fileInputRef;
  constructor(props:BlobImageProps, context:any) {
    super(props, context)
    this.state = { image:"loading" }
  }

  componentWillMount() {
    this.setState({...this.state, image: {src: this.props.src}});
  }

  render() {
    if (this.state.image == "loading")
      return <div className="loading">Loading...</div>
    if (this.state.image == "uploading")
      return <div className="uploading">Uploading...</div>
    if (this.state.image == "deleting")
      return <div className="deleting">Deleting...</div>

    return <div className="lazy-image">
     {this.state.image.src ? <img src={this.state.image.src} onError={(e)=>{(e.target as HTMLImageElement).style.display="none"}}/> : <div /> }
     {
        this.props.can_edit ?
          <div className="image-controls">
            <a className="user button button--delete"
              style={!this.props.can_edit ? {pointerEvents:"none"} : {}}
                onClick={() => {
                    if(confirm(i18next.t('Are you sure?'))) {
                      this.setState({...this.state, image: "deleting"}, () =>
                        this.props.delete().then(() =>
                          this.setState({...this.state, image: {src: ""}}))
                      )
                    }
                  }
                }>
            </a>
            <input disabled={!this.props.can_edit} type="file" accept="image/*" onChange={(e:any) => {
              let files:FileList = (e.target as any).files;
              this.setState({...this.state, image: "uploading"}, () =>
                this.props.upload(files[0]).then(() =>
                  this.setState({...this.state, image: {src: this.props.src}}))
              )
            }
            } />

          </div>
        :
        null
      }
    </div>
  }
}
