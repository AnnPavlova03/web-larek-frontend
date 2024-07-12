import { IFormState, TForm, TFormErrors } from '../../types';
import { Model } from '../common/Model';

export class FormState extends Model<IFormState> {
	order: TForm = {
		email: '',
		phone: '',
		address: '',
		payment: '',
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

		if (!this.order.payment) {
			errors.payment = 'необходимо указать способ оплаты';
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

		if (!this.isValidEmail(this.order.email)) {
			errors.email = 'Email должен содержать символ @ и домен, например example@domain.com';
		  }
		  if (!this.isValidPhone(this.order.phone) ) {
			errors.phone = 'Формат телефона: +7 (ХХХ) ХХХ-ХХ-ХХ';
		  }
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
	resetForm() { // если окно с формой закрыли, ранее введенные данные сбрасываются, чтобы кнопка "далее" оставалась в didabled, пока снова не заполнят оба поля
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: '',
		};
		this.button = false;
		this.formErrors = {};
		this.events.emit('form:reset');
	}


	isValidEmail(email:string) {
		const pattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/;
		return pattern.test(String(email).toLowerCase());
	  }
	  
	 isValidPhone(phone:string) {
		const pattern = /^(?:\+7|8)\d{10}$/;
		return pattern.test(String(phone).replace(/[^\d]/g, ''));
	  }

}
