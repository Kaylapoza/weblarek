import { IBuyer, TPayment, ValidationErrors } from "../../../types";

export class Buyer {
    private payment: TPayment;
    private address: string;
    private phone: string;
    private email: string;

    constructor() {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    //сохранение данных в модели. Один ощий метод
    setBuyerData(buyer: Partial<IBuyer>): void {
        if (buyer.payment !== undefined) {
            this.payment = buyer.payment;
        }
        if (buyer.address !== undefined) {
            this.address = buyer.address;
        }
        if (buyer.phone !== undefined) {
            this.phone = buyer.phone;
        }
        if (buyer.email !== undefined) {
            this.email = buyer.email;
        }
    }

    // получение всех данных покупателя;
    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        }
    }

    // очистка данных покупателя;
    clearBuyerData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    //валидация данных. Метод, возвращающий объект с ошибками.
    validate(): ValidationErrors {
        let errors: ValidationErrors = {};
        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address) {
            errors.address = 'Адресс не указан';
        }
        if (!this.phone) {
            errors.phone = 'Телефон не указан';
        }
        if (!this.email) {
            errors.email = 'Email не указан'
        }
        return errors;
    }
}