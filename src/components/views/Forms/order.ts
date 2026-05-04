import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./form";

interface IOrderForm {
    payment: 'card' | 'cash' | null,
    address: string
}

export class Order extends Form<IOrderForm> {
    protected cardBtnElement: HTMLButtonElement;
    protected cashBtnElement: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this.cardBtnElement = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashBtnElement = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInputElement = ensureElement<HTMLInputElement>('.form__input', this.container);

        this.cardBtnElement.addEventListener('click', () => {
            this.events.emit('order:payment-change', { target: 'card' })
        })
        this.cashBtnElement.addEventListener('click', () => {
            this.events.emit('order:payment-change', { target: 'cash' })
        })
    }

    set payment(value: 'card' | 'cash' | null) {
        this.cardBtnElement.classList.toggle('button_alt-active', value === 'card');
        this.cashBtnElement.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }
}