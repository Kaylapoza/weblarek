import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items; //    получение массива товаров, которые находятся в корзине;
  }

  //добавление товара, который был получен в параметре, в массив корзины;
  addItem(item: IProduct): void {
    this.items.push(item);

    this.events.emit('basket:change', { items: this.items });
  }

  //удаление товара, полученного в параметре из массива корзины;
  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);

    this.events.emit('basket:change', { items: this.items });
  }

  //очистка корзины;
  cleanBasket(): void {
    this.items = [];

    this.events.emit('basket:change', { items: this.items });
  }

  //получение стоимости всех товаров в корзине;
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  //получение количества товаров в корзине;
  getItemCount(): number {
    return this.items.length;
  }

  //проверка наличия товара в корзине по его id, полученного в параметр метода.
  hasItemInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
