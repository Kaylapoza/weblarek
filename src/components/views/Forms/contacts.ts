import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./form";

interface IContactsForm {
    email: string,
    phone: string
}

export class Contacts extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    set email(value: string) {
        this.emailInput.textContent = value;
    }

    set phone(value: string) {
        this.phoneInput.textContent = value;
    }
}