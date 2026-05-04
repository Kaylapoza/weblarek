import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    valid: boolean,
    errors: string[]
}

export abstract class Form<T> extends Component<IForm & T> {
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        const formName = this.container.getAttribute('name');

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;

            this.events.emit(`${formName}.${String(field)}:changed`, {field, value}) // вешаем слушатель на все поля инпута
        })

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${formName}:submit`)//слушатель на отправку формы
        })
    }

    protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.getAttribute('name')}.${String(field)}:change`, {
        field,
        value
    });
}

    set errors(value: string[]) {
        this.errorsElement.textContent = value.join('; ');
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }
}