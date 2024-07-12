import { ICard, ICardList, TProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';


interface ICardActions {
	onClick: (event: MouseEvent) => void;
}
export class Card extends Component<ICard> {
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(
		protected containerName: string,
		container: HTMLElement,
		events?: ICardActions
	) {
		super(container);
		this._description = container.querySelector(
			'.card__text'
		) as HTMLElement | null;
		this._image = container.querySelector(
			'.card__image'
		) as HTMLImageElement | null;
		this._title = ensureElement<HTMLElement>(
			`.${containerName}__title`,
			container
		);
		this._category = container.querySelector(
			'.card__category'
		) as HTMLElement | null;
		this._price = ensureElement<HTMLElement>(
			`.${containerName}__price`,
			container
		);
		this._button = container.querySelector(
			'.card__button'
		) as HTMLButtonElement | null;


		if (events?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', events.onClick);
			} else {
				container.addEventListener('click', events.onClick);
			}
		}
	}

    set button(element: HTMLButtonElement ) {
        this._button = element;
    }

    get button(): HTMLButtonElement {
        return this._button;
    }

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
	
	setCategory() {
		switch (true) {
			case this._category.textContent === 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case this._category.textContent === 'другое':
				this._category.classList.add('card__category_other');
				break;
			case this._category.textContent === 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			case this._category.textContent === 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case this._category.textContent === 'кнопка':
				this._category.classList.add('card__category_button');
				break;

		}
	}

}
