export interface IBook {
    title : string,
    description : string,
    author : string,
    publisher : string,
    quantity : number,
    price : number,
    id : string,
    createdAt : string,
    cover : string
}

export interface ICategory {
    name: string;
    id: string;
}

export interface IGetBooksRequest {
    size: number;
    offset: number;
    search?: string;
}

export interface IReqGetLatestBooks {
    size: number;
    offset: number;
}


export interface ICreateBookReq {
    title : string,
    description : string,
    author : string,
    publisher : string,
    categoryIds : string[],
    quantity : number,
    price : number,
    cover : any ,
}

export interface IEditBookReq {
    title? : string,
    description? : string,
    author? : string,
    publisher? : string,
    categoryIds? : string[],
    id? : string,
}


