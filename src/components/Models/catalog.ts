import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
    private products: IProduct[] = []; //массив товаров на странице
    private currentProduct: IProduct | null = null; // выранная карточка товара

    constructor(protected events: IEvents) {
        this.events = events;
    }

    saveProducts(products: IProduct[]): void {
        this.products = products; //сохранение массива товаров полученного в параметрах метода;

        this.events.emit('items:changed', {items: this.products});
    }

    getProducts(): IProduct[] {
        return this.products //    получение массива товаров из модели;
    }

    getProductByID(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id) // получение одного товара по его id;
    }

    saveCurrentProduct(product: IProduct | null): void {
        this.currentProduct = product; //    сохранение товара для подробного отображения;
        this.events.emit('preview:changed');
    }

    getCurrentProduct(): IProduct | null {
        return this.currentProduct; //    получение товара для подробного отображения.
    }
} 