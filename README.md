# 3 курс
# Дайбов Александр Валерьевич
# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/types/ — папка с интерфейсами моделей  

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
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
# Архитектура
Web-ларёк использует архитектурный паттерн Model-View-Presenter (MVP), который разделяет бизнес-логику, отображение и обработку пользовательских действий. Это позволяет сделать код более читаемым, модульным и легко расширяемым.
## Базовый код
### 1. Класс `Api`
Класс для работы с API. 

**Свойства**:  
- `baseUrl: string` - Ссылка на начало пути к API, до роутинга  
- `options: RequestInit` - Настройки запроса, конкретно заголовки   

**Методы**:  
- `handleResponse` - Принимает и проверяет запрос, возвращает промис с данными или ошибкой  
- `get` - Принимает ссылку для `GET` запроса, и возвращает результат, обработанный методом `handleResponse`
- `post` - принимает ссылку для `POST` запроса, и возвращает результат, обработанный методом `handleResponse` 
---
### 2. Класс `EventEmitter`
Брокер событий. Позволяет подписываться на события и уведомлять подписчиков 
о наступлении события.  

**Свойства**:
- `private _events: Map<EventName, Set<Subscriber>>` - Хранит имя события и подписчика на событие  

**Методы**:

- `on` - Установить обработчик на событие

- `off` - Снять обработчик с события

- `emit` - Инициировать событие с данными

- `onAll` - Слушать все события

- `offAll` - Сбросить все обработчики

- `trigger` - Сделать коллбек триггер, генерирующий событие при вызове  
---
## Компоненты модели данных
### 1. Класс `CardModel`  
**Свойства**:
- `private _product: IProductModel` - Хранит информацию о продукте  

**Методы**:
- `get product` - Геттер, предоставляет информацию о товаре  
- `getCard` - Запрос на сервер для получения информации о товаре  
---
### 2. Класс `CartModel`  
**Свойства**:
- `productsList: ICartItem[]` - Хранит информацию о списке товаров в корзине  
- `totalPrice: number` - Хранит информацию об итоговой сумме товаров в корзине  

**Методы**:
- `get total` - Геттер, предоставляет информацию об итоговой сумме товаров в корзине  
- `get products` - Геттер, предоставляет информацию о списке товаров в корзине
- `addItemToCart` - Добавление товара в корзину 
- `removeItem` - Удаление товара из корзины
---
### 3. Класс `FormModel`  
**Свойства**:
- `_orderData: IOrderData` - Хранит информацию о заказе  

**Методы**:
- `get orderData` - Геттер, предоставляет информацию о заказе  
- `input` - Сохраняет пользовательский ввод
- `validate` - Отвечает за валидацию пользовательского ввода  
- `postOrder` - Отправляет запрос с созданием заказа на сервер  
---
### 4. Класс `ProductsModel`  
**Свойства**:
- `_products: IProductModel[]` - Хранит информацию о списке товаров 

**Методы**:
- `get products` - Геттер, предоставляет информацию о списке товаров   
- `getItems` - Отправляет запрос на сервер для получения списка товаров  
---

## Компоненты представления  
Все классы View слоя имплементируют интерфейс `IComponent`, с дженерик параметром типа модели компонента, и, если они модальные, то также являются наследниками класса `Modal`.  
Внутри классов все свойства от интерфейса представлены в виде приватных полей класса и достаются с помощью геттеров.  

---
### 1. Класс `CardView`  
Модальное окно карточки товара.  

---
### 2. Класс `CartView`  
Модальное окно корзины товаров.

---
### 3. Класс `FormView`  
Модальное окно для форм (н-р. оформление заказа).

---
### 4. Класс `ProductsView`  
Отображение списка товаров на странице.  

---
## Ключевые типы данных  
### `Cart.ts`  
```
export interface ICartItem {
	id: string;
	price: number;
	title: string;
}

export interface ICartModel {
	productsList: ICartItem[];
	totalPrice: number;

	addItemToCart(id: string): void;
	removeItem(id: string): void;
}
```

### `Components.ts`
```
export interface IComponent<T> {
	container: HTMLElement;
	model: T;
	template: HTMLElement;
	element: HTMLElement;

	render(data?: object): HTMLElement;
}

export abstract class Modal {
	private isOpen: boolean;
	private closeButton: HTMLElement;

	private initializeEventListeners = (): void => {
		throw new Error('Method not implemented.');
	};

	protected handleEscClick = (event: KeyboardEvent): void => {
		throw new Error('Method not implemented.');
	};

	protected handleCloseButtonClick = (): void => {
		throw new Error('Method not implemented.');
	};

	protected handleBodyClick = (event: MouseEvent): void => {
		throw new Error('Method not implemented.');
	};

	protected openModal = (): void => {
		throw new Error('Method not implemented.');
	};

	protected closeModal = (): void => {
		throw new Error('Method not implemented.');
	};
}
```

### `OrderForm.ts`
```
export type TPayment = 'online' | 'cash';

export interface IOrderData {
	payment: TPayment;
	mail: string;
	phone: string;
	address: string;
	totalPrice: number;
	items: string[];
}

export interface IFormModel {
	orderData: IOrderData;

	input(value: string): void;
	validate(value: string): string | undefined;
	postOrder(formFields: IOrderData): Promise<object>;
}
```

### `Products.ts`
```
export interface IProductModel {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	category: string;
	price: number | undefined;
}

export interface IProductCard {
	product: IProductModel;

	getCard(url: string): Promise<IProductModel>;
}

export interface IProductsList {
	products: IProductModel[];

	getItems(url: string): Promise<object>;
}
```