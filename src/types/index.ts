export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

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
export type ProductResponse = {
  total: number,
  items: IProduct[]
}

//тип для отправки данных на сервер при заказе
export interface OrderRequest extends IBuyer {
  total: number,
  items: IProduct['id'][] //исправил вот так, но по правде говоря я так и не понял, почему прошлый вариант не подходил
}                         //вроде все совпадало с запросом в postman

//тип для полученного ответа от сервера
export type OrderResponse = {
  id: string,
  total: number
}