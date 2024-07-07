import { IPayment } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';


export class Order extends Form<IPayment> {
	protected _buttons: HTMLButtonElement[];
	protected _isPaymentSelected: boolean = false;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._buttons = Array.from(container.querySelectorAll(`button[name]`));
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.toggleClass(button, 'button_alt-active');
				this.choiceChange(
					button,
					this._buttons.find((b) => b !== button)
				);
				this._isPaymentSelected = true;
				this.events.emit('order.button:change');
			});
		});
	}

	set paymentSelected(value: boolean) {
		this._isPaymentSelected = value;
	}

	get paymentSelected(): boolean {
		return this._isPaymentSelected;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	resetPaymentSelection() {
		this._buttons.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
		this._isPaymentSelected = false;
	}
	choiceChange(
		selectedButton: HTMLButtonElement,
		otherButton: HTMLButtonElement
	) {
		if (selectedButton.classList.contains('button_alt-active')) {
			otherButton.classList.remove('button_alt-active');
		}
	}
}

