import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IModalData {
	content: HTMLElement;
}
export class Modal extends Component<IModalData> {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._content = container.querySelector('.modal__content');
		this._closeButton = container.querySelector('.modal__close');
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}
	close() {
		if (this.container.querySelector('.form')) {
			this.container.classList.remove('modal_active');
			this.events.emit('modal-form:close');
		} else {
			this.container.classList.remove('modal_active');
			this.events.emit('modal:close');
		}
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
