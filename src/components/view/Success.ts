import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccess {
	total: string | number;
}

export class Success extends Component<ISuccess> {
	protected _description: HTMLElement;
	protected _buttonSuccess: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._description = container.querySelector('.order-success__description');
		this._buttonSuccess = container.querySelector('.order-success__close');
		this._buttonSuccess.addEventListener('click', () => {
			this.events.emit('order-success');
		});
	}

	set total(items: string) {
		this.setText(this._description, items);
	}
}
