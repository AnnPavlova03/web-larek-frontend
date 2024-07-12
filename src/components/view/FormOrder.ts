import { IPayment } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class Order extends Form<IPayment> {
	protected _buttons: HTMLButtonElement[];
	protected _isPaymentSelectedState: boolean;
	protected _selectedPaymentValue: string;

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

				this._isPaymentSelectedState = true;
				this._selectedPaymentValue = button.name;
				this.events.emit('order.button:change');
			});
		});
	}

	set PaymentSelectedValue(value: string) {
		this._selectedPaymentValue = value;
	}
	get PaymentSelectedValue(): string {
		return this._selectedPaymentValue;
	}

	set paymentSelectedState(value: boolean) {
		this._isPaymentSelectedState = value;
	}

	get paymentSelectedState(): boolean {
		return this._isPaymentSelectedState;
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
	resetPaymentSelection() {
		this._buttons.forEach((button) => {
			button.classList.remove('button_alt-active');
		});
		this._isPaymentSelectedState = false;
		this._selectedPaymentValue = '';
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
