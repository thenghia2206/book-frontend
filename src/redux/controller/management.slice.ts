/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-debugger */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CheckboxOptionType, notification } from "antd";
import { catchError, concatMap, filter, map, mergeMap, switchMap } from "rxjs/operators";
import { RootEpic } from "../../common/define-type";
import Utils from "../../utils/base-utils";
import IdentityApi from "../../api/identity/identity.api";
import { QUERY_PARAM } from "../../constants/get-api.constant";
import { get } from "http";
import { IReport, IStatisticReport } from "../../common/report.interface";
import { IBook, ICategory, ICreateBookReq } from "../../common/book.interface";
import BookApi from "../../api/book/book.api";
import CategoryApi from "../../api/categories/categories.api";


interface ManagementState {
    loading: boolean;
    bookList: IBook[];
    totalBookRecords : number;
    cover: any | undefined;
    detailBook : any | undefined;
    listCategory : ICategory[];
    addBookSuccess : boolean;
    statusCode: string | undefined;
}

const initState: ManagementState = {
    loading: false,
    bookList:[],
    totalBookRecords : 0,
    cover: undefined,
    detailBook: undefined,
    listCategory:[],
    addBookSuccess : false,
    statusCode: undefined,
};

const managementSlice = createSlice({
    name: "management",
    initialState: initState,
    reducers: {

        //Get Book
        getBookRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },

        getBookSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.bookList = action.payload.items
            state.totalBookRecords = action.payload.total
            console.log(action.payload);
            
        },

        getBookFail(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
                style: {
                    marginTop: 50,
                    paddingTop: 40,
                },
            });

        },


        getDetailBookRequests(state, action: PayloadAction<any>) {
            state.loading = true;
        },
        getDetailBookSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.detailBook = action.payload

        },
        getDetailBookFail(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
                style: {
                    marginTop: 50,
                    paddingTop: 40,
                },
            });

        },


        //Get Category
        getCategoryRequest(state) {
            state.loading = true;
        },

        getCategorySuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            state.listCategory = action.payload
        },

        getCategoryFail(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
                style: {
                    marginTop: 50,
                    paddingTop: 40,
                },
            });

        },

        addBookRequest(state, action: PayloadAction<ICreateBookReq>) {
            state.loading = true;
            state.addBookSuccess = false;
        },

        addBookSuccess(state, action: PayloadAction<any>) {
            state.loading = false;

            notification.open({
                message: "Thêm sách thành công",
                // description:
                //     action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });

            // state.user = action.payload.user
            state.addBookSuccess = true;
        },

        addBookFail(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: action.payload.response.message,
                onClick: () => {
                    console.log("Notification Clicked!");
                },
                style: {
                    marginTop: 50,
                    paddingTop: 40,
                },
            });

        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setStatusCode(state, action: PayloadAction<string>) {
            state.statusCode = action.payload;
        },


        editBookRequest(state, action: PayloadAction<any>) {
            state.loading = true;
            
        },

        editBookSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: "Thành công",
                description: "Cập nhật sách thành công",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });
            // }
        },

        editBookFail(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: "Thất bại",
                description: "Cập nhật sách thất bại",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });
        },

        deleteBookRequest(state, action: PayloadAction<any>) {
            state.loading = true;
        },

        deleteBookSuccess(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: "Thành công",
                description: "Xóa sách thành công",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });

        },

        deleteBookFail(state, action: PayloadAction<any>) {
            state.loading = false;
            notification.open({
                message: "Thất bại",
                description: "Xóa sách không thành công",
                onClick: () => {
                    console.log("Notification Clicked!");
                },
            });
        },


    },
});


    const getBooks$: RootEpic = (action$) =>
    action$.pipe(
        filter(getBookRequest.match),
        mergeMap((re) => {
            return BookApi.getListBook(re.payload).pipe(
                mergeMap((res: any) => {
                    return [
                        managementSlice.actions.getBookSuccess(res.data),

                    ];
                }),
                catchError((err) => [managementSlice.actions.getBookFail(err)])
            );
        })
    );

    const getDetailBook$: RootEpic = (action$) =>
    action$.pipe(
        filter(getDetailBookRequests.match),
        mergeMap((re) => {
            return BookApi.getDetailBook(re.payload.id).pipe(
                mergeMap((res: any) => {
                    return [
                        managementSlice.actions.getDetailBookSuccess(res.data),

                    ];
                }),
                catchError((err) => [managementSlice.actions.getDetailBookFail(err)])
            )
        })
    );

    const getCategories$: RootEpic = (action$) =>
    action$.pipe(
        filter(getCategoryRequest.match),
        mergeMap((re) => {
            return CategoryApi.getListCategory(re.payload).pipe(
                mergeMap((res: any) => {
                    return [
                        managementSlice.actions.getCategorySuccess(res.data),
                    ];
                }),
                catchError((err) => [managementSlice.actions.getCategoryFail(err)])
            );
        })
    );

    const addBook$: RootEpic = (action$) =>
    action$.pipe(
        filter(addBookRequest.match),
        switchMap((re) => {
            const bodyrequest = {
                size: QUERY_PARAM.size,
                offset: 0
            }
            return BookApi.addBook(re.payload).pipe(
                mergeMap((res: any) => {
                    return [
                        managementSlice.actions.setLoading(false),
                        managementSlice.actions.setStatusCode(res.statusCode),
                        managementSlice.actions.addBookSuccess(res),
                        managementSlice.actions.getBookRequest(bodyrequest)
                    ];
                }),
                catchError((err) => [
                    managementSlice.actions.addBookFail(err),
                ])
            );
        })
    );

    const editBook$: RootEpic = (action$) =>
    action$.pipe(
        filter(editBookRequest.match),
        mergeMap((re) => {
            const bodyrequest = {
                size: QUERY_PARAM.size,
                offset: 0
            }

            return BookApi.editBook(re.payload).pipe(
                mergeMap((res: any) => {
                    console.log(re.payload)
                    return [
                        managementSlice.actions.editBookSuccess(res.data),
                        managementSlice.actions.getBookRequest(bodyrequest)
                    ];
                }),
                catchError((err) => [managementSlice.actions.editBookFail(err)])
            );
        })
    );

    const deleteBook$: RootEpic = (action$) =>
    action$.pipe(
        filter(deleteBookRequest.match),
        mergeMap((re) => {
            const bodyrequest = {
                id: re.payload.id
            }
            const bodyrequest1 = {
                size: QUERY_PARAM.size,
                offset: 0
            }
            return BookApi.deleteBook(bodyrequest).pipe(
                mergeMap((res: any) => {
                    console.log(re.payload)
                    return [
                        managementSlice.actions.deleteBookSuccess(res.data),
                        managementSlice.actions.getBookRequest(bodyrequest1)
                    ];
                }),
                catchError((err) => [managementSlice.actions.deleteBookFail(err)])
            );
        })
    );


export const ManagementEpics = [
    getBooks$,
    getDetailBook$,
    getCategories$,
    addBook$,
    editBook$,
    deleteBook$,
];
export const {
    getBookRequest,
    getDetailBookRequests,
    getCategoryRequest,
    addBookRequest,
    editBookRequest,
    deleteBookRequest,
} = managementSlice.actions;
export const managementReducer = managementSlice.reducer;
