import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import './components/view/Card';
import './components/view/Page';
import { EventEmitter } from './components/base/events';
import { Card } from './components/view/Card';
import { Page } from './components/view/Page';
import { AppApi } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import {
	ICard,
	ICardList,
	IContacts,
	IPayment,
	TForm,
	TProduct,
} from './types';

import { BasketState } from './components/model/BasketState';
import { Basket } from './components/view/basket';
import { Product } from './components/view/Product';
import { CardState } from './components/model/CardState';

import { FormState } from './components/model/FormState';
import { Success } from './components/view/Success';
import { Modal } from './components/common/modal';
import { Order } from './components/view/FormOrder';
import { Contacts } from './components/view/FormContacts';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const SuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const events = new EventEmitter();
const page = new Page(document.body, events);
const api = new AppApi(CDN_URL, API_URL);
const cardState = new CardState({}, events);
const basketState = new BasketState({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(SuccessTemplate), events);
const formState = new FormState({}, events);

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

events.on<ICardList>('cards:changed', () => {
	page.cardList = cardState.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price + ' ' + 'синапсов',
		});
	});
});

events.on('card:select', (item: ICard) => {
	cardState.setPreview(item);
});

events.on('preview:changed', (element: ICard) => {
	const showItem = (item: ICard) => {
		const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
			onClick: () => events.emit('add:card', item),
		});
		modal.render({
			content: card.render({
				title: item.title,
				image: item.image,
				category: item.category,
				description: item.description,
				price: item.price + ' ' + 'синапсов',
			}),
		});
	};
	if (element) {
		api
			.getCardsApi()
			.then((result) => {
				cardState.catalog = result;
				showItem(element);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

events.on('add:card', (card: TProduct) => {
	basketState.addProduct(card);
});

events.on('delete:card', (card: TProduct) => {
	basketState.deleteProduct(card.id);
});

events.on('basket:change', () => {
	basket.items = basketState.listProduct.map((item) => {
		basketState.setIndex();
		const product = new Product(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('delete:card', item),
		});

		modal.render({
			content: basket.render(),
		});

		return product.render({
			title: item.title,
			index: item.index,
			price: item.price + ' ' + 'синапсов',
		});
	});
	page.counter = basketState.count;
	basket.selected = basketState.listProduct;
	basket.total = basketState.getTotal();
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('order:open', () => {
	modal.render({
		content: order.render({
			button: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});
events.on('order.button:change', () => {
	formState.button = order.paymentSelected;
	formState.validateFormOrder();
	if (formState.button && formState.order.address) {
		events.emit('order:ready', formState.order);
	}
});

events.on(
	'order.address:change',
	(data: { field: keyof IPayment; value: string }) => {
		formState.setFormOrder(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		formState.setFormContacts(data.field, data.value);
	}
);
events.on('formErrors:change', (errors: Partial<TForm>) => {
	const { email, phone, address, button } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
	order.paymentSelected && (order.valid = !address);
	order.errors = Object.values({ address, button })
		.filter((i) => !!i)
		.join(';');
});
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
	order.resetPaymentSelection();
});
events.on('contacts:submit', () => {
	modal.render({
		content: success.render({
			total: `Списано ${basket.total} синапсов`,
		}),
	});
});
events.on('order-success', () => {
	modal.close();
	basketState.clearBasket();
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getCardsApi()
	.then(cardState.setCatalog.bind(cardState))
	.catch((err) => {
		console.error(err);
	});
