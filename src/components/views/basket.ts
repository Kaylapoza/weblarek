import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[],
    total: number,
    active: boolean
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.buyButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.buyButton.addEventListener('click', () => {
            this.events.emit('order:open');
        })

        this.active = false;
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${String(value)} синапсов`;
    }

    set active(value: boolean) {
        this.buyButton.disabled = !value;
    }
}