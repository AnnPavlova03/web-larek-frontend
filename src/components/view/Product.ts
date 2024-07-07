import { TProduct } from '../../types';
import { ensureAllElements } from '../../utils/utils';
import { Component } from '../base/Component';

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}
export class Product extends Component<TProduct> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLElement, events?: IProductActions) {
		super(container);
		this._index = container.querySelector('.basket__item-index');
		this._title = container.querySelector('.card__title');
		this._price = container.querySelector('.card__price');
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);
		if (events?.onClick) {
			this._buttons.forEach((button) => {
				button.addEventListener('click', events.onClick);
			});
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent || '';
	}
	set price(value: string) {
		this.setText(this._price, value);
	}
	get price(): string {
		return this._price.textContent || '';
	}
}
