export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IPayment {
	address: string | number;
	buttonPay: boolean; //кнопка онлайн или при получении
}

export interface IContacts {
	email: string;
	phone: number;
}

export interface ICardList {
	cards: ICard[]; // получаем массив карточек и выбираем по превью одну на которую нажмем и отобразим в попапе который открывается при клике по карточке
	preview: string | null; // здесь получаем либо айди карточки либо ничего, если в получении айди нет необходимости
	getCard(id: string): ICard;
}

export interface IBasket {
	count: number;
	toggleOrderedCard(id: string, isInclude: boolean): TProduct; // не дает добавить одинаковые товары
	getTotal(): number; // получаем сумму заказа
	deleteProduct(Id: string, payload: Function | null): void; // очищаем товары в корхине
	updateBasket(card: ICard, payload: Function | null): void; //обновляем состояние корзины после удаления или добавления товара
	checkStateButton(isInclude: boolean): void; //если добавлена бесценная карточка, блокируем кнопку
}
export type TProduct = Pick<ICard, 'id' | 'title' | 'price'>; // Товар в корзине
export type TForm = IContacts & IPayment; // формы
export type TFormErrors = Partial<Record<keyof TForm, string>>; // тип для хранения ошибок формы
