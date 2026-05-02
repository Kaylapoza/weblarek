import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface IForm {
    valid: boolean,
    errors: string[]
}

export abstract class Form<T> extends Component<IForm & T> {
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    set errors(value: string[]) {
        this.errorsElement.textContent = value.join('; ');
    }

    set valid(value: boolean) {
        
    }
}