import { IApi, OrderRequest, OrderResponse, ProductResponse } from "../types";


export class RequestService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<ProductResponse> {
        return this.api.get<ProductResponse>('/product/');
    }

    postOrder(order: OrderRequest): Promise<OrderResponse> {
        return this.api.post<OrderResponse>('/order/', order)
    }
}