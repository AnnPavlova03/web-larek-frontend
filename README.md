# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные используемые в приложении 

Данные пользователя, приходящие с сервера
```
export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: string | number;
}
```
Интерфейс для модели данных карточек
```
export interface ICardList {
	catalog: ICard[];
	preview: string | null; 
	setCatalog(items: ICard[]):void
	setPreview(item: ICard):void
}
```
Интерфейс корзины
```
export interface IBasket {
	count: number;
	listProduct: TProduct[]
	product: string[] 
	addProduct(items: TProduct): TProduct;
	toggleOrderedCard(id: string): TProduct; // не дает добавить одинаковые товары
	getTotal(): number; // получаем сумму заказа
	deleteProduct(Id: string): void; // очищаем товары в корхине
	setIndex():void;
	clearBasket():void 
}
```
Интерфейс заказа
```
export interface IPayment {
	address: string;
	button: string;
}
```
Интерфейс контактных данных покупателя
```
export interface IContacts {
	phone: string;
	email: string;
}
```
Данные товара при добавление его в корзину
```
export type TProduct = Pick<ICard, 'id' | 'title' | 'price'> & {index: number;}
```
Данные форм
```
export type TForm = IContacts & IPayment; 
```
Тип для хранения ошибок формы
```
export type TFormErrors = Partial<Record<keyof TForm, string>>
```
Интерфейс для взаимодействия с формами 
```
export interface IFormState {
	order:TForm
	button: boolean 
	formErrors: TFormErrors 
	setFormOrder(field: TForm, value: string): void;
	setFormContacts(field: TForm, value: string): void;
	validateFormOrder(error: string): void;
	validateFormContacts(error: string): void;
}
```
## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

#### Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

### Слой данных
#### Общий класс Model
Абстрактный класс отвечает за обновления состояния модели и оповещения других частей приложения о произошедших изменениях

#### Класс CardsState
Класс отвечает за хранение и логику работы с данными карточек\
В полях класса хранятся следующие данные:
- catalog: ICard[] - массив объектов карточек
- preview: string | null - id карточки, выбранной для просмотра в модальной окне

Методы для работы с данными.
-setCatalog(items: ICard[]):void - отображает первоначальный массив карточек, приходящий с сервера
-setPreview(item: ICard):void - получает айди карточки, необходимо для просмотра подробной информации о конкретном товаре 

#### Класс BasketState
Класс отвечает за логику работы корзины
В полях класса хранятся следующие данные:
	count: number; - количество карточек добавленных в корзину
	listProduct: TProduct[] - массив карточек
	product: string[] - свойства карточки

Методы для работы с данными.
- addProduct(items: TProduct): TProduct; - добавляет карточку
- toggleOrderedCard(id:string):TProduct - проверяет в корзине наличие товара с заданным айди 
- getTotal(): number -  получаем сумму заказа
- deleteProduct(Id: string): void; - удаляем товары из корзины 
- setIndex():void; - подсчитывает количество товараров в корзине
- clearBasket():void - очищает корзину от товаров после их заказа

#### Класс FormState
Класс отвечает за логику работы c формами 
В полях класса хранятся следующие данные:
	order:TForm - данные полей форм
	button: boolean - кнопка оплаты
	formErrors: TFormErrors - данные ошибок форм

Методы для работы с данными.
	setFormOrder(field: TForm, value: string): void; - устанавливает данные (адрес) в форму заказа
	setFormContacts(field: TForm, value: string): void; - устанваливает данные (телефон, email) в форму заказа
	validateFormOrder(error: string): void; - проверяет заполнено ли поле(адрес) и выбрана ли кнопка оплаты и отображает ошибки 
	validateFormContacts(error: string): void; - проверяет заполнены ли поля(телефон, email) и отображает ошибки 


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Общий Класс Modal
Общай класс для всех модальных окон, в нем реализуются методы открытия и закрытия окна. Устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия попапа.  
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает контейнер модального окна и брокер событий

Поля класса
- _content: HTMLElement - содержимое какое темплейта нужно будет отобразить 
- _closeButton: HTMLButtonElement - кнопка закрытия окна

Методы для работы с данными.
Сеттер content для установки содержимого темплейта

#### Класс Basket
Отвечает за отображение модального окна корзины.
В полях класса описаны:
- _list: HTMLElement - список где будут отображаться карточки
- _total: HTMLElement - общая стоимость товаров в корзине 
- _button: HTMLButtonElement - кнопка подтверждения выбора

Методы:
В сеттерах устанавливаются:
- items - товары в корзине
- selected - переключение состояние кнопки, в случае, если корзина пуста или добавлен товар с ценой Null
- total - для установки общей стоимости товаров, находящийся в корзине, геттер нужен для отображения стоимости в модальное окне success

#### Класс Card 
Отвечает за отображение карточки, задавая в карточке данные категории, названия, изображения, стоиости, описания. Класс используется для отображения карточек на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливается слушатель на всю карточку, при нажатии на которую генерируется событие открытия модального окна (подробное описание товара)\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает containerName, для разного отображения в разных окнах и событие events, имитирующее событие клика по контейнеру или кнопке удаления карточки(когда она находится в корзине)

Методы:
Сеттеры для всех свойств карточки

#### Общий Класс Form
Отвечает за валидацию форм, отображения ошибок
В полях класс:
- _errors: HTMLElement; - элемент, где будут отображаться ошибки
- _submit: HTMLButtonElement; - кнопка подтверджения

В конструкторе класса передается container: HTMLFormElement, и events: IEvents - имитирующий события происходящие на форме

Методы:
сеттеры для установки валидации формы и текстовых ошибок

#### Класс FormContacts
Расширяет класс form.  Конструктор принимает container: HTMLFormElement, events: IEvents. В методах применяются сеттеры для установки значений phone и email

#### Класс FormOrder
Расчширяет класс form. Конструктор принимает container: HTMLFormElement, events: IEvents. 
В поллях класса:
- _buttons: HTMLButtonElement[]; - массив кнопок
- _isPaymentSelected: boolean = false; - первоначальное состояние кнопок

Методы:
сеттер для установки данных из поля address,  
сеттер для установки состояния кнопки 
resetPaymentSelection- метод дяя сброса состояния кнопки после откытия следующего модального окна
choiceChange- метод переключает состояние выбранной кнопки

#### Класс Page
Отвечает за отображние главной страницы. Метод расширяет базовый класс Component.
В полях класс определены:
- _cardList: HTMLElement; 
- _basket: HTMLElement;
- _count: HTMLElement - счетчик на корзине
- _wrapper: HTMLElement - обертка основного контента, используется при открытии любого модального окна

В конструткоре (container: HTMLElement, protected events: IEvents)
На корзину вешается слушатель и инициализируется события открытия модального окна заказа

Методы:
сеттеры для отображения карточек на главной страницк, изменения счетчика товаров на корзине, и состояния основного контента (locked)

#### Класс Product
Класс предназначен для отображения товара находящегося в корзине. Класс расширяет Component
В полях описаны:
- _index: HTMLElement; 
- _title: HTMLElement;
- _price: HTMLElement;
- _buttons: HTMLButtonElement[];

На кнопку вешается слушатель, который имитирует событие клика (удаление карточки из корзины)

Методы:
Сеттеры для установки index, title, price

#### Класс Success
Модальное окно отвечает за отображение успешного заказа товара.
В полях класс описаны:
- _description: HTMLElement;
- _buttonSuccess: HTMLButtonElement;

Конструткор класс принимает (container: HTMLElement, protected events: IEvents)
На кнопку вешается слушатель клика, по которому имитируется осбытие

Методы:
сеттер для установки конечной стоимоости товара 

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.


## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `basket:change` - изменение данных в корзине
- `cards:changed` - изменение массива карточек
- `preview:changed` - изменение открываемой в модальном окне картинки карточки
- `order:ready` - состояние формы заказа, если все поля заполнены
- `contacts:ready` - состояние формы контакных данных, если все поля заполнены
- `formErrors:change` - состояние ошибок в формах

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `order:open` - открытие модального окна с формой заказа
- `delete:card` - удаление твоара из коризны
- `add:card` - добавление товара в корзину
- `card:select` - состояние выбранной карточки 
- `order.button:change` - изменился выбор оплаты
- `order.address:change` - изменился поле с адресом
- `basket:open` - открытие модального окна корзины
- `contacts:submit` - кнопка подтверждения контактных данных
- `order:submit` - кнопка подтверждения данных оплаты
- `modal:open` - открытие модального окна 
- `modal:close` - закрытие модального окна 
- `contacts.phone.change` - изменились данные в поле телефон
- `contacts.email.change` -  изменились данные в поле email







