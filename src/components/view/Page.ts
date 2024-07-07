import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IPage {
	cardList: HTMLElement[];
	counter: number;
	locked: boolean
}

export class Page extends Component<IPage> {
	protected _cardList: HTMLElement;
	protected _basket: HTMLElement;
	protected _count: HTMLElement;
	protected _wrapper: HTMLElement

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._wrapper=ensureElement<HTMLElement>('.page__wrapper')
		this._count = ensureElement<HTMLElement>('.header__basket-counter');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._cardList = ensureElement<HTMLElement>('.gallery');
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set cardList(items: HTMLElement[]) {
		this._cardList.replaceChildren(...items);
	}
	set counter(value: number) {
		this.setText(this._count, value);
	}
    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
	}

