export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

//тип для получения данных с сервера
export type ProductRequest = {
  total: number,
  items: IProduct[]
}

//тип для отправки данных на сервер при заказе
export type OrderRequest = IBuyer & {
  total: number,
  items: IProduct['id'][]
}