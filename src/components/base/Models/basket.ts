import { IProduct } from "../../../types";

export class Basket {
    private items: IProduct[] = [];
    
    getItems(): IProduct[] | null {
        return this.items; //    получение массива товаров, которые находятся в корзине;
    }

    //добавление товара, который был получен в параметре, в массив корзины;
    addItem(item: IProduct): void {
        this.items.push(item);
    }

    //удаление товара, полученного в параметре из массива корзины;
    removeItem(item: IProduct): void {
        const index: number = this.items.indexOf(item)
        if (index !== -1) {
            this.items.slice(index, 1)
        }
    }

    //очистка корзины;
    cleanBasket(): void {
        this.items = [];
    }

    //получение стоимости всех товаров в корзине;
    getTotalPrice(items: IProduct[]): number {
        return this.items.reduce((total, item) => {
            return total + item.price;
        }, 0)
    }

    //получение количества товаров в корзине;
    getItemCount(): number {
        return this.items.length;
    }

    //проверка наличия товара в корзине по его id, полученного в параметр метода.
    hasItemInBasket(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}