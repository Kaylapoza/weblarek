import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard {
    title: string,
    price: number | null
}

export abstract class Card<T> extends Component<ICard & T> {
    protected titleElement: HTMLElement;
    protected priceELement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceELement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceELement.textContent = value !== null
            ? `${String(value)} синапсов`
            : 'Бесценно'
    }
}