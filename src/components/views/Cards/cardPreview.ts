import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./card";
import { ICardActions, ICatalogCard } from "./cardCatalog";


interface ICardPreview extends ICatalogCard {
    description: string,
    buttonText?: string,
    valid?: boolean
}

export class CardPreview extends Card<ICardPreview> {
    protected textElement: HTMLElement;
    protected buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.textElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (this.buyButton && actions?.onClick) {
            this.buyButton.addEventListener('click', (e) => actions.onClick(e));
        }
    }

    set description(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buyButton.textContent = value;
    }

    set valid(value: boolean) {
        this.buyButton.disabled = !value;
    }
}