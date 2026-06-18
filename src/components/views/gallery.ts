import { Component } from "../base/Component";

interface IGallery {
    items: HTMLElement[]
}

export class Gallery extends Component<IGallery> {
    constructor(container: HTMLElement) {
        super(container)
    }

    set items(cards: HTMLElement[]) {
        this.container.innerHTML = '';
        this.container.append(...cards)
    }
}