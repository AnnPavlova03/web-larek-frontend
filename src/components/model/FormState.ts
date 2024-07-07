import { IFormState, TForm, TFormErrors } from '../../types';
import { Model } from '../common/Model';

export class FormState extends Model<IFormState> {
	order: TForm = {
		email: '',
		phone: '',
		address: '',
		button: '',
	};
	button: boolean = false;
	formErrors: TFormErrors = {};

	setFormOrder(field: keyof TForm, value: string) {
		this.order[field] = value;

		if (this.validateFormOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateFormOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.button) {
			errors.button = 'необходимо указать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'необходимо указать адресс проживания';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setFormContacts(field: keyof TForm, value: string) {
		this.order[field] = value;
		if (this.validateFormContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}
	validateFormContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
