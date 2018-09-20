import * as React from "react"
import * as ReactDOM from "react-dom"
import * as i18next from "i18next"
import * as ViewUtils from "../generated_views/view_utils"
import * as Models from '../generated_models'
import * as Components from "./components"
import * as Api from '../generated_api'

type ChangeUsernameFlowProps = {
    endpoint: (username: string, password: string) => Promise<any>
    onSucces: (new_username: string) => void
}

type ChangeUsernameFlowState = {
    mode: "button" | "flow"
    status: "waiting" | "verifying" | "invalid" | "success"
    username: string
    password: string
}

type ChangeEmailFlowProps = {
    endpoint: (newEmail: string, password: string) => Promise<any>
    onSucces: (new_email: string) => void
}

type ChangeEmailFlowState = {
    mode: "button" | "flow"
    status: "waiting" | "verifying" | "invalid" | "success"
    newEmail: string
    password: string
}

export class ChangeUsernameFlow extends React.Component<ChangeUsernameFlowProps, ChangeUsernameFlowState> {
    constructor(props: ChangeUsernameFlowProps) {
        super(props);
        this.state = { mode: "button", status: "waiting", username: "", password: "" }
    }

    handleClick(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ ...this.state, mode: "flow" })
    }

    changeUsername() {
        this.setState({ ...this.state, status: "verifying" }, () =>
            this.props.endpoint(this.state.username, this.state.password)
                .then(() => this.setState({ ...this.state, status: "success", mode: "button" }, () => this.props.onSucces(this.state.username)))
                .catch(() => this.setState({ ...this.state, status: "invalid" }))
        )
    }

    render() {
        if (this.state.mode == "button") {
            return <button onClick={(e) => this.handleClick(e)}>{i18next.t("Change")}</button>
        }

        return (
            <div className="overlay" onClick={(e) => e.stopPropagation()}>
                <div className="overlay__item">
                    <h2 className="overlay__title">{i18next.t("changeusername:title", { defaultValue: "Change Username" })}</h2>
                    {this.state.status == "invalid" ? <div className="message message--error">{i18next.t("changeusername:invalid", { defaultValue: "The given username allready exists or the provided password is not correct" })}</div> : null}
                    <div className="message message--info">{i18next.t("changeusername:info", { defaultValue: "Enter a new username below to change your current username" })}</div>
                    {this.state.status === "verifying" ? <span className="loader"></span> : null}
                    <label>{i18next.t("New username")}</label>
                    <input type="text" value={this.state.username} onChange={(e) => this.setState({ ...this.state, username: e.currentTarget.value })} />
                    
                    <label>{i18next.t("Password")}</label>
                    <input type="password" value={this.state.password} onChange={(e) => this.setState({ ...this.state, password: e.currentTarget.value })} />
                    <button onClick={() => this.setState({ ...this.state, mode: "button" })}>{i18next.t("Cancel")}</button>
                    <button onClick={() => this.changeUsername()}>{i18next.t("Change username")}</button>
                </div>
            </div>
        )
    }
}

export class ChangeEmailFlow extends React.Component<ChangeEmailFlowProps, ChangeEmailFlowState> {
    constructor(props: ChangeEmailFlowProps) {
        super(props);
        this.state = { mode: "button", status: "waiting", newEmail: "", password: "" }
    }

    handleClick(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ ...this.state, mode: "flow" })
    }

    requestToken() {
        this.setState({ ...this.state, status: "verifying" }, () =>
            this.props.endpoint(this.state.newEmail, this.state.password)
                .then((res) => this.setState({ ...this.state, status: "success" }))
                .catch(() => this.setState({ ...this.state, status: "invalid" }))
        )
    }

    render() {
        if (this.state.mode == "button") {
            return <button onClick={(e) => this.handleClick(e)}>{i18next.t("Change")}</button>
        }

        return (
            <div className="overlay" onClick={(e) => e.stopPropagation()}>
                <div className="overlay__item">
                    <h2 className="overlay__title">{i18next.t("changeemail:title", { defaultValue: "Change Email" })}</h2>
                    {this.state.status == "invalid" ? <div className="message message--error">{i18next.t("changeemail:invalid", { defaultValue: "The given email address is not a valid email address or the provided password is not correct." })}</div> : null}
                    <div className="message message--info">{i18next.t("changeemail:desc", { defaultValue: "An email will be sent to the new email address. Follow the instruction in this mail to confirm your address change" })}</div>
                    {this.state.status === "verifying" ? <span className="loader"></span> : null}

                    {this.state.status != "success" ?
                        <div>
                            <label>{i18next.t("New mail address")}</label>
                            <input type="text" value={this.state.newEmail} onChange={(e) => this.setState({ ...this.state, newEmail: e.currentTarget.value })} />
                            
                            <label>{i18next.t("Password")}</label>
                            <input type="password" value={this.state.password} onChange={(e) => this.setState({ ...this.state, password: e.currentTarget.value })} />
                            <button onClick={() => this.setState({ ...this.state, mode: "button" })}>{i18next.t("Cancel")}</button>
                            <button onClick={() => this.requestToken()}>{i18next.t("Change Email")}</button>
                        </div>
                    : null }

                    {this.state.status == "success" ?
                        <div>
                            <button onClick={() => this.setState({ ...this.state, mode: "button" })}>{i18next.t("Close")}</button>
                        </div>
                    : null }
                </div>
            </div>
        )
    }
}