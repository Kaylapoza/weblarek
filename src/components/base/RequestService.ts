import { IApi, IProduct, OrderRequest, ProductRequest } from "../../types";


export class RequestService {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProducts(): Promise<IProduct[]> {
        return this.api.get<ProductRequest>('/product/').then((data) => data.items)
    }

    postOrder(order: OrderRequest): Promise<OrderRequest> {
        return this.api.post<OrderRequest>('/order/', order)
    }
}