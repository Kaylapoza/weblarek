import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./card";
import { ICatalogCard } from "./cardCatalog";


interface ICardPreview extends ICatalogCard {
    description: string;
}

export class CardPreview extends Card<ICardPreview> {
    protected textElement: HTMLElement;
    protected buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (this.buyButton) {
            this.buyButton.addEventListener('click', () => {
                this.events.emit('card:add-to-basket');
            })
        }
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buyButton.textContent = value;
    }

    set valid(value: boolean) {
        this.buyButton.disabled != value;
    }
}