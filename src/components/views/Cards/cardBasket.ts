import { ensureElement } from '../../../utils/utils';
import { Card, ICard } from './card';
import { ICardActions } from './cardCatalog';

interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container
    );

    if (this.deleteButton && actions?.onClick) {
      this.deleteButton.addEventListener('click', (e) => actions.onClick(e));
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
