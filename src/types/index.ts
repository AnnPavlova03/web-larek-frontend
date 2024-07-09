export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: string | number;
}

export interface IPayment {
	address: string;
	payment: string;
}

export interface IContacts {
	phone: string;
	email: string;
}

export interface ICardList {
	catalog: ICard[]; // получаем массив карточек и выбираем по превью одну на которую нажмем и отобразим в попапе который открывается при клике по карточке
	preview: string | null; // здесь получаем либо айди карточки либо ничего, если в получении айди нет необходимости
	// getCard(id: string): ICard;
	setCatalog(items: ICard[]): void;
	setPreview(item: ICard): void;
}

export interface IBasket {
	count: number;
	listProduct: TProduct[];
	product: string[];
	getOrderList(): TTotal
	addProduct(items: TProduct): TProduct;
	toggleOrderedCard(id: string): TProduct; // не дает добавить одинаковые товары
	getTotal(): number; // получаем сумму заказа
	deleteProduct(Id: string): void; // очищаем товары в корхине
	setIndex(): void;
	clearBasket(): void;
}
export type TProduct = Pick<ICard, 'id' | 'title' | 'price'> & {
	index: number;
}; // Товар в корзине
export type TForm = IContacts & IPayment; // формы
export type TFormErrors = Partial<Record<keyof TForm, string>>; // тип для хранения ошибок формы

export interface IFormState {
	order: TForm;
	button: boolean;
	formErrors: TFormErrors;
	setFormOrder(field: TForm, value: string): void;
	setFormContacts(field: TForm, value: string): void;
	validateFormOrder(error: string): void;
	validateFormContacts(error: string): void;
}

export interface IOrderProduct {
	phone: string;
	email: string;
	address: string;
	payment: string;
	total: number;
	items: string[];
}

export type TTotal = Pick<IOrderProduct , 'total' | 'items' >;