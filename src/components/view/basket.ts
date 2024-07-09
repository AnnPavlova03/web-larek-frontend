import { TProduct } from '../../types';
import { createElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number | string;
	selected: string[];

}
export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
	constructor(container: HTMLElement, protected event: EventEmitter) {
		super(container);
		this._list = container.querySelector('.basket__list');
		this._button = container.querySelector('.basket__button');
		this._total = container.querySelector('.basket__price');
		if (this._button) {
			this._button.addEventListener('click', () => {
				event.emit('order:open');
			});
		}
		this.items = [];
		this.selected = [];
	}
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
	set selected(items: TProduct[]) {
		if (items.length === 0 || items.some((item) => item.price === null)) {
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}

	set total(total: number | string) {
		this.setText(this._total, total + `${' синапсов'}`);
	}
	get total(): number | string {
		return this._total.textContent;
	}


}
