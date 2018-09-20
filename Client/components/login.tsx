import { a, any, button, C, div, label, none, Option, repeat, retract, selector, string, some, unit } from 'monadic_react'

export type LoginData<R> = { email: string, password: string, role: R }
export type ResetData<R> = { new_password: string, new_password_confirm: string, role: R, token: string }
export type RegisterData<R> = { username: string, email: string, emailConfirmation: string, password: string, passwordConfirmation: string, role: R}
export type ChangeData = { password: string, newPassword: string, newPasswordConfirmation: string }
export type ApiResult = "success" | "failure"
export type AuthState<U, R> = { kind: "login" | "requestreset" | "reset" | "register" | "changepassword" | "loggedin", loginState: LoginData<R>, resetState: ResetData<R>, registerState: RegisterData<R>, user: Option<U> }
export type AuthResult<U, R> = {role: R, user: Option<U>}

let login = function <U, R>(loginApi: (loginData: LoginData<R>) => C<Option<U>>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => (roles: R[]) => initAuthState =>
        repeat<AuthState<U, R>>('login_repeat')(
            any<AuthState<U, R>, AuthState<U, R>>('login_form')([
                inner_login<U, R>(role_to_string)(roles)(true),
                ld => button<AuthState<U, R>>("Login", false, "login_button")(ld).then(undefined, ld =>
                        loginApi(ld.loginState).then(undefined, u => {
                            if (u.kind == "none") {
                                messageHandler("login_failed")
                                return unit<AuthState<U, R>>(ld)
                            }

                            return unit<AuthState<U, R>>({...ld, user: u, kind: "loggedin"})
                        })),
                ld => ld.resetState != null ? a<AuthState<U, R>>("Forgot password?", null, null, false,  "forgot_password")({ ...ld, kind: "requestreset"}) : unit<AuthState<U, R>>(null).never(),
                ld => ld.registerState != null ? a<AuthState<U, R>>("Create an account", null, null, false,  "register")({ ...ld, kind: "register"}) : unit<AuthState<U, R>>(null).never()
            ])
        )(initAuthState).filter((newState) => initAuthState.kind != newState.kind, 'login_filter')
}

let inner_login = function <U, R>(role_to_string: (role: R) => string) : (roles: R[]) => (show_password: boolean) => (_: AuthState<U, R>) => C<AuthState<U, R>> {
    return (roles: R[]) => (show_password: boolean) =>
        repeat<AuthState<U, R>>("inner_login_repeat")(
            any<AuthState<U, R>, AuthState<U, R>>("inner_login_any")([
                retract<AuthState<U, R>, string>("email_retract")(authState => authState.loginState.email, authState => v => ({ ...authState, loginState: {...authState.loginState, email: v}}),
                    label<string, string>("Email", true, null, "email_label")(string("edit", "email", "email_input"))),

                show_password ?
                    retract<AuthState<U, R>, string>('password_retract')(authState => authState.loginState.password, authState => v => ({ ...authState, loginState: {...authState.loginState, password: v}}),
                        label<string, string>("Password", true, null, "password_label")(string("edit", "password", "password_input")))
                    : authState => unit(null).never("inner_login_password"),

                retract<AuthState<U, R>, R>('role_retract')(authState => authState.loginState.role, authState => v => ({ ...authState, loginState: {...authState.loginState, role: v}}),
                    label<R, R>("Role", true, null, "role_label")(r => selector<R>("dropdown", role_to_string, "role_selector")(roles, r))),
            ])
        )
}

let resetPasswordRequest = function <U, R>(requestResetApi: (loginData: LoginData<R>) => C<ApiResult>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>)  => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => (roles: R[]) => initAuthState =>
        repeat<AuthState<U, R>>('requestreset_repeat')(
            any<AuthState<U, R>, AuthState<U, R>>('requestreset_form')([
                inner_login<U, R>(role_to_string)(roles)(false),
                ld => button<AuthState<U, R>>("Request reset", false, "request_reset_button")(ld).then(undefined, ld =>
                    requestResetApi(ld.loginState).then(undefined, result => {
                        result == "success" ? messageHandler("request_reset_success") : messageHandler("request_reset_failed")
                        return unit<AuthState<U, R>>(ld)
                    })
                ),
                ld => a<AuthState<U, R>>("Back to login", null, null, false, "back_to_login")({ ...ld, kind: "login"})
            ])
        )(initAuthState).filter((newState) => initAuthState.kind != newState.kind, 'resetpasswordrequest_filter')
    }

let resetPassword = function <U, R>(resetApi: (resetData: ResetData<R>) => C<ApiResult>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => (roles: R[]) => initAuthState =>
        repeat<AuthState<U, R>>('resetpassword_repeat')(
            any<AuthState<U, R>, AuthState<U, R>>('reset_form')([
                inner_resetPassword<U, R>(role_to_string)(roles),
                ld => button<AuthState<U, R>>("Change password", false, "reset_button")(ld).then(undefined, ld =>
                    resetApi(ld.resetState).then(undefined, result => {
                        if (result == "failure") {
                            messageHandler("reset_failed")

                            return unit<AuthState<U, R>>({...ld, kind: "reset"})
                        }

                        messageHandler("reset_success")
                        return unit<AuthState<U, R>>({...ld, kind: "login"})
                    })),
            ])
        )(initAuthState).filter((newState) => initAuthState.kind != newState.kind, 'resetpassword_filter')
    }

let inner_resetPassword = function <U, R>(role_to_string: (role: R) => string) : (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>> {
    return (roles: R[]) =>
        repeat<AuthState<U, R>>("inner_reset_repeat")(
            any<AuthState<U, R>, AuthState<U, R>>("inner_reset_any")([
                retract<AuthState<U, R>, string>("new_password_retract")(authState => authState.resetState.new_password, authState => v => ({ ...authState, resetState: {...authState.resetState, new_password: v}}),
                    label<string, string>("Password", true, null, "new_password_label")(string("edit", "password", "new_password_input"))),

                retract<AuthState<U, R>, string>("new_password_confirm_retract")(authState => authState.resetState.new_password_confirm, authState => v => ({ ...authState, resetState: {...authState.resetState, new_password_confirm: v}}),
                    label<string, string>("Confirm password", true, null, "new_password_confirm_label")(string("edit", "password", "new_password_confirm_input"))),
            ])
        )
}

let changePassword = function <U, R>(changeApi: (changeData: ChangeData) => C<ApiResult>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (_: AuthState<U, R>) => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => initAuthState =>
        repeat<AuthState<U, R>>('changepassword_repeat')(
            any<AuthState<U, R>, AuthState<U, R>>('reset_form')([
                authS => inner_changePassword()({password: "", newPassword: "", newPasswordConfirmation: ""}).then(undefined, changeData => {
                    return button<AuthState<U, R>>("Change password", false, "reset_button")(authS).then(undefined, authS =>
                        changeApi(changeData).then(undefined, result => {
                            if (result == "failure") {
                                messageHandler("change_password_failed")

                                return unit<AuthState<U, R>>(authS)
                            }

                            messageHandler("change_password_success")
                            return unit<AuthState<U, R>>({...authS, kind: "loggedin"})
                        })
                    )
                })
            ])
        )(initAuthState).filter((newState) => initAuthState.kind != newState.kind, 'changepassword_filter')
    }

let inner_changePassword = function () : (_: ChangeData) => C<ChangeData> {
    return repeat<ChangeData>("inner_change-repeat")(
            any<ChangeData, ChangeData>("inner_change-any")([
                retract<ChangeData, string>("old_password_retract")(changeData => changeData.password, changeData => v => ({ ...changeData, password: v}),
                    label<string, string>("Old Password", true, null, "old_password_label")(string("edit", "password", "old_password_input"))),

                retract<ChangeData, string>("new_password_retract")(changeData => changeData.newPassword, changeData => v => ({ ...changeData, newPassword: v}),
                    label<string, string>("New Password", true, null, "new_password_label")(string("edit", "password", "new_password_input"))),

                retract<ChangeData, string>("new_password_confirm_retract")(changeData => changeData.newPasswordConfirmation, changeData => v => ({ ...changeData, newPasswordConfirmation: v}),
                    label<string, string>("Confirm password", true, null, "new_password_confirm_label")(string("edit", "password", "new_password_confirm_input"))),
            ])
        )
}

let loggedin = function <U, R>(logoutApi: (loginData: LoginData<R>) => C<void>, messageHandler: (message: string) => void) : (_: AuthState<U, R>) => C<AuthState<U, R>> {
    return any<AuthState<U, R>, AuthState<U, R>>('logout_form')([
        ld => a<AuthState<U, R>>("Logout", null, "nofollow", false, "logout_link")(ld).then("logout_api_call", ld => logoutApi(ld.loginState)).then(undefined, _ =>
            unit<AuthState<U, R>>({...ld, kind: "login", user: none(), loginState: {email: "", password: "", role: null}})),
        ld => a<AuthState<U, R>>("Change password", null, "nofollow", false, "change_password_link")(ld).then("change_password_kind", _ => unit<AuthState<U, R>>({...ld, kind: "changepassword"}))        
    ])
}

let register = function <U, R>(registerApi: (registerData: RegisterData<R>) => C<ApiResult>, messageHandler: (message: string) => void) : (role_To_string: (role: R) => string) => (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>>{
    return (role_to_string: (role: R) => string) => (roles: R[]) => initAuthState =>
        repeat<AuthState<U, R>>('register_repeat')(        
            any<AuthState<U, R>, AuthState<U, R>>('register_form')([
                inner_register<U, R>(role_to_string)(roles),
                ld => button<AuthState<U, R>>("Register", false, "register_button")(ld).then(undefined, ld =>
                        registerApi(ld.registerState).then(undefined, result => {
                            if (result == "failure") {
                                messageHandler("register_failed")

                                return unit<AuthState<U, R>>({...ld, kind: "register"})
                            }

                            messageHandler("register_success")
                            return unit<AuthState<U, R>>({...ld, kind: "login"})
                        })),
                ld => a<AuthState<U, R>>("Back to login", null, null, false, "back_to_login")({ ...ld, kind: "login"})                    
            ])
        )(initAuthState).filter((newState) => initAuthState.kind != newState.kind, 'register_filter')
}

let inner_register = function <U, R>(role_to_string: (role: R) => string) : (roles: R[]) => (_: AuthState<U, R>) => C<AuthState<U, R>> {
    return (roles: R[]) =>
        repeat<AuthState<U, R>>("inner_register_repeat")(
            any<AuthState<U, R>, AuthState<U, R>>("inner_register_any")([
                retract<AuthState<U, R>, string>("username_retract")(authState => authState.registerState.username, authState => v => ({ ...authState, registerState: {...authState.registerState, username: v}}),
                    label<string, string>("Username", true, null, "username_label")(string("edit", "text", "username_input"))),
                
                retract<AuthState<U, R>, string>("email_retract")(authState => authState.registerState.email, authState => v => ({ ...authState, registerState: {...authState.registerState, email: v}}),
                    label<string, string>("Email", true, null, "email_label")(string("edit", "email", "email_input"))),

                retract<AuthState<U, R>, string>("emailconfirm_retract")(authState => authState.registerState.emailConfirmation, authState => v => ({ ...authState, registerState: {...authState.registerState, emailConfirmation: v}}),
                    label<string, string>("Confirm email", true, null, "emailconfirm_label")(string("edit", "email", "emailconfirm_input"))),

                retract<AuthState<U, R>, string>("password_retract")(authState => authState.registerState.password, authState => v => ({ ...authState, registerState: {...authState.registerState, password: v}}),
                    label<string, string>("Password", true, null, "password_label")(string("edit", "password", "password_input"))),

                retract<AuthState<U, R>, string>("passwordConfirm_retract")(authState => authState.registerState.passwordConfirmation, authState => v => ({ ...authState, registerState: {...authState.registerState, passwordConfirmation: v}}),
                    label<string, string>("Confirm password", true, null, "passwordConfirm_label")(string("edit", "password", "passwordConfirm_input"))),

                retract<AuthState<U, R>, R>('role_retract')(authState => authState.registerState.role, authState => v => ({ ...authState, registerState: {...authState.registerState, role: v}}),
                    label<R, R>("Role", true, null, "role_label")(r => selector<R>("dropdown", role_to_string, "role_selector")(roles, r))),
            ])
        )
}

export let Authenticate = function <U, R>(loginApi: (loginData: LoginData<R>) => C<Option<U>>, logoutApi: (loginData: LoginData<R>) => C<void>, registerApi: (registerData: RegisterData<R>) => C<ApiResult>, requestResetApi: (loginData: LoginData<R>) => C<ApiResult>, resetApi: (resetData: ResetData<R>) => C<ApiResult>, changeApi: (changeData: ChangeData) => C<ApiResult>, messageHandler: (message: string) => void) {
    return (role_to_string: (role: R) => string) => (roles: R[]) =>
        repeat<AuthState<U, R>>('authenticate')(
            any<AuthState<U, R>, AuthState<U, R>>('authenticate_wrapper')([
                ld =>
                    ld.kind == "login" ?
                        login<U, R>(loginApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "loggedin" ?
                        loggedin<U, R>(logoutApi, messageHandler)(ld)
                    : ld.kind == "requestreset" ?
                        resetPasswordRequest<U, R>(requestResetApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "reset" ? 
                        resetPassword<U, R>(resetApi, messageHandler)(role_to_string)(roles)(ld)
                    : ld.kind == "changepassword" ? 
                        changePassword<U, R>(changeApi, messageHandler)(role_to_string)(ld)
                    : register<U, R>(registerApi, messageHandler)(role_to_string)(roles)(ld)
            ])
        )
}