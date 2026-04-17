import { IProduct } from "../../types";

export class Catalog {
    private products: IProduct[] = []; //массив товаров на странице
    private currentProduct: IProduct | null = null; // выранная карточка товара

    saveProducts(products: IProduct[]): void {
        this.products = products; //сохранение массива товаров полученного в параметрах метода;
    }

    getProducts(): IProduct[] {
        return this.products //    получение массива товаров из модели;
    }

    getProductByID(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id) // получение одного товара по его id;
    }

    saveCurrentProduct(product: IProduct | null): void {
        this.currentProduct = product; //    сохранение товара для подробного отображения;
    }

    getCurrentProduct(): IProduct | null {
        return this.currentProduct; //    получение товара для подробного отображения.
    }
} 