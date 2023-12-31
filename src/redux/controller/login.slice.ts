/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-debugger */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import { WritableDraft } from "immer/dist/internal";
import { catchError, filter, map, mergeMap, switchMap } from "rxjs/operators";
// import IdentityApi from "../../api/identity.api";
import { RootEpic } from "../../common/define-type";
import Utils from "../../utils/base-utils";
import IdentityApi from "../../api/identity/identity.api";

type MessageLogin = {
    content: string;
    errorCode?: number;
};
type MessageForgot = {
    ErrorCode?: number;
    Message: string;
};
interface LoginState {
    loading: boolean;
    isSuccess: boolean;
    message: MessageLogin | undefined;
    messageForgot: MessageForgot | undefined;
    departmentId: number;
    refresh_token: string;
    statusCode: string | undefined;
    tokenLogin: string | undefined;
    isExistEmail: boolean;
    registerSuccess: boolean;
    userName: string | undefined;
    userMail: string | undefined;
    userPhone: string | undefined;
    accesstokenExpỉred: boolean;
}

const initState: LoginState = {
    loading: false,
    isSuccess: true,
    userName: Utils.getValueLocalStorage("userName"),
    userMail: Utils.getValueLocalStorage("userMail"),
    userPhone: Utils.getValueLocalStorage("userPhone"),
    departmentId: 1,
    message: undefined,
    messageForgot: undefined,
    refresh_token: "",
    statusCode: undefined,
    tokenLogin: Utils.getValueLocalStorage("token"),
    isExistEmail: true,
    registerSuccess: false,
    accesstokenExpỉred: true,
};

const loginSlice = createSlice({
    name: "login",
    initialState: initState,
    reducers: {
        loginRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        loginSuccess(state, action: PayloadAction<any>) {
            
                const token = action.payload.accessToken
                const lastDotIndex = token.lastIndexOf('.');
                let beforeDot = ""
                let afterDot = ""
                if (lastDotIndex !== -1) {
                    beforeDot = token.substring(0, lastDotIndex);
                    afterDot = token.substring(lastDotIndex + 1);
                }
                Utils.setLocalStorage("token", beforeDot);
                Utils.setLocalStorage("refresh_token", action.payload.refreshToken);
                Utils.setLocalStorage("key",afterDot)
                console.log(Utils.getValueLocalStorage("token"))
                console.log(Utils.getValueLocalStorage("key"))
                state.tokenLogin = action.payload.accessToken;
                state.loading = false;
                state.isSuccess = true;
                state.accesstokenExpỉred = false;
                notification.open({
                    message: "Đăng nhập thành công",
                    onClick: () => {
                        console.log("Notification Clicked!");
                    },
                    style: {
                        marginTop: 50,
                        paddingTop: 40,
                    },
                });
        },
        loginFail(state, action: any) {
            state.loading = false;
            state.accesstokenExpỉred = true;

            notification.open({
                message: "Đăng nhập không thành công",
                description: "Hãy kiểm tra lại thông tin đăng nhập.",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
                style: {
                    paddingTop: 40,
                },
            });
            state.message = action.payload.message;
        },
        checkAbleToLogin(state, action: PayloadAction<string>) {
            state.statusCode = action.payload;
        },
        getUserInfoRequest(state, action: PayloadAction<any>) {
            state.tokenLogin = action.payload;

            state.loading = true;
        },
        getUserInfoSuccess(
            state,
            action: PayloadAction<{ user: any; token: string }>
        ) {
            Utils.setLocalStorage("userName", action.payload.user.name);
            Utils.setLocalStorage("userMail", action.payload.user.email);
            Utils.setLocalStorage("userPhone", action.payload.user.phone);
            state.userName = action.payload.user.name;
            state.loading = false;
            state.isSuccess = true;
            state.accesstokenExpỉred = false;
        },
        getUserInfoFail(state, action: any) {
            Utils.removeItemLocalStorage("userName");
            Utils.removeItemLocalStorage("userMail");
            Utils.removeItemLocalStorage("userPhone");
            state.message = action.payload?.message;
            state.accesstokenExpỉred = true;
            state.loading = false;


        },

        checkEmailRequest: (state, action: PayloadAction<string>) => {
            state.isExistEmail = true;
            state.loading = true;
        },
        checkEmailSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;

            state.isExistEmail = action.payload.exist;
            if (action.payload.exist) {
                notification.open({
                    message: "Email đã tồn tại",
                    onClick: () => {
                        console.log("Notification Clicked!");
                    },
                    style: {
                        marginTop: 40,
                    },
                });
            }
        },
        checkEmailFailed(state, action: PayloadAction<boolean>) {
            // state.loading = action.payload;
            state.loading = false;

        },
        checkActiveAccountRequest: (state, action: PayloadAction<any>) => {
            state.loading = true;
        },
        checkActiveAccountSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;

            if (action.payload.statusCode === "OK") {
                notification.open({
                    message: action.payload.data,
                    description: "Tài khoản đã có thể đăng nhập",
                    onClick: () => {
                        console.log("Notification Clicked!");
                    },
                    style: {
                        // marginTop: 20
                    },
                });
            }
            if (action.payload.statusCode === "AccountActivated") {
                notification.open({
                    message: action.payload.data,
                    description: "Vui lòng không xác nhận lại",
                    onClick: () => {
                        console.log("Notification Clicked!");
                    },
                    style: {
                        // marginTop: 20
                    },
                });
            }
            if (action.payload.statusCode === "UserNotFound") {
                notification.open({
                    message: action.payload.data,
                    description:
                        "Vui lòng đăng ký / đăng nhập lại với tài khoản khác đã xác nhận",
                    onClick: () => {
                        console.log("Notification Clicked!");
                    },
                    style: {
                        // marginTop: 20
                    },
                });
            }
        },
        checkActiveAccountFailed(state, action: PayloadAction<boolean>) {
            // state.loading = action.payload;
            state.loading = false;

        },
        forgotRequest(state, action: PayloadAction<string>) {
            state.loading = true;
        },
        sendMailSuccess(
            state,
            action: PayloadAction<{
                message: WritableDraft<MessageLogin> | undefined;
            }>
        ) {
            state.message = action.payload.message;
            state.loading = false;
            state.isSuccess = true;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        message(state, action: PayloadAction<MessageLogin>) {
            state.message = action.payload;
            state.loading = false;
        },
        messageForgot(state, action: PayloadAction<MessageForgot>) {
            state.messageForgot = action.payload;
            state.loading = false;
        },
        clearMessageResquest(state) {
            state.loading = true;
        },
        clearMessage(state) {
            state.messageForgot = undefined;
            state.message = undefined;
            state.loading = false;
        },
        setStatusCode(state, action: PayloadAction<string>) {
            state.statusCode = action.payload;
        },
        clearAllRequest(state) {
            state.loading = true;
            state.statusCode = undefined;
            // state.user = undefined;
        },

        registerRequest(state, action: PayloadAction<any>) {
            state.loading = true;
            state.registerSuccess = false;
        },

        registerSuccess(state, action: PayloadAction<any>) {
            state.loading = false;

            notification.open({
                message: "Đăng ký tài khoản thành công. Vui lòng kiểm tra email để kích hoạt tài khoản !",
                // description:
                //     action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });

            // state.user = action.payload.user
            state.isSuccess = true;
            state.registerSuccess = true;
        },

        registerFail(state, action: PayloadAction<any>) {

            notification.open({
                message: "Đăng ký không thành công",
                // description:
                //     action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });
            state.loading = false;
            state.registerSuccess = false;
        },
    },
});

const login$: RootEpic = (action$) =>
    action$.pipe(
        filter(loginRequest.match),
        mergeMap((re) => {
            const body: any = {
                email: re.payload.email,
                password: re.payload.password,
                remember: re.payload.remember,
                additionalProp1: {},
            };

            return IdentityApi.login(body).pipe(
                mergeMap((res: any) => {
                    return [
                        loginSlice.actions.loginSuccess(res.data),
                        loginSlice.actions.getUserInfoRequest(res.data.accessToken),
                        loginSlice.actions.setLoading(false),   
                        loginSlice.actions.setStatusCode(res.statusCode),
                    ];
                }),
                catchError((err) => [loginSlice.actions.loginFail(err)])
            );
        })
    );

const clearMessage$: RootEpic = (action$) =>
    action$.pipe(
        filter(clearMessageResquest.match),
        map(() => {
            return loginSlice.actions.clearMessage();
        })
    );

const logOut$: RootEpic = (action$) =>
    action$.pipe(
        filter(clearAllRequest.match),
        mergeMap(() => {
            return [
                loginSlice.actions.clearAllRequest(),
                loginSlice.actions.setLoading(false),
            ];
        })
    );

const register$: RootEpic = (action$) =>
    action$.pipe(
        filter(registerRequest.match),
        switchMap((re) => {
            const body: any = {
                email: re.payload.email,
                password: re.payload.password,
                confirmPassword: re.payload.confirmPassword,
                name: re.payload.name,
                phone: re.payload.phone,
                address: re.payload.address,
                dob: re.payload.dob,
                gender: re.payload.gender,
                additionalProp1: {},
            };
            return IdentityApi.reqister(body).pipe(
                mergeMap((res: any) => {
                    return [
                        loginSlice.actions.setLoading(false),
                        loginSlice.actions.setStatusCode(res.statusCode),
                        loginSlice.actions.registerSuccess(res),
                    ];
                }),
                catchError((err) => [
                    loginSlice.actions.setStatusCode("UniqueEmail"),
                    loginSlice.actions.registerFail(err),
                ])
            );
        })
    );
const getUserInfo$: RootEpic = (action$) =>
    action$.pipe(
        filter(getUserInfoRequest.match),
        switchMap((re) => {
            return IdentityApi.getUserInfo(re.payload).pipe(
                mergeMap((res: any) => {
                    const token = res.data.accessToken;
                    const user = {
                        email: res.data.email,
                        name: res.data.name,
                        phone: res.data.phone,
                        address: res.data.address,
                        dob: res.data.dob,
                        gender: res.data.gender,
                        createdAt: res.data.createdAt,
                        updatedAt: res.data.updatedAt,
                    };
                    return [
                        loginSlice.actions.getUserInfoSuccess({
                            user,
                            token: token,
                        }),
                    ];
                }),
                catchError((err) => [loginSlice.actions.getUserInfoFail(err)])
            );
        })
    );

const checkActiveAccount$: RootEpic = (action$) => action$.pipe(
    filter(checkActiveAccountRequest.match),
    switchMap((re) => {
        return IdentityApi.checkActiveAccount(re.payload).pipe(
            mergeMap((res: any) => {
                return [
                    loginSlice.actions.checkActiveAccountSuccess(res),
                ];
            }),
            catchError(err =>
                [loginSlice.actions.checkActiveAccountFailed(err)]
            )
        )
    })
)
export const LoginEpics = [
    login$,
    clearMessage$,
    logOut$,
    register$,
    getUserInfo$,
    checkActiveAccount$,
];
export const {
    getUserInfoRequest,
    loginRequest,
    checkEmailRequest,
    forgotRequest,
    clearMessageResquest,
    clearAllRequest,
    registerRequest,
    checkAbleToLogin,
    checkActiveAccountRequest,
} = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
