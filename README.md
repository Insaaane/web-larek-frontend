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

- `private _product: IProduct` - Хранит информацию о продукте
- `private readonly _events: EventEmitter` - Хранит брокер событий

**Методы**:

- `get product` - Геттер, предоставляет информацию о товаре
- `get events` - Геттер, предоставляет информацию о событиях товара
- `getItem` - Запрос на сервер для получения информации о товаре

---

### 2. Класс `CartModel`

**Свойства**:

- `private productsList: ICartItem[]` - Хранит информацию о списке товаров в корзине
- `private _total: number` - Хранит информацию об итоговой сумме товаров в корзине
- `private _events: EventEmitter` - Хранит брокер событий

**Методы**:

- `get total` - Геттер, предоставляет информацию об итоговой сумме товаров в корзине
- `get productsList` - Геттер, предоставляет информацию о списке товаров в корзине
- `addItem` - Добавление товара в корзину
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

Модальное окно для формы оформления заказа.

---

### 4. Класс `ProductsView`

Отображение списка товаров на странице.

---

### 5. Класс `ResultView`

Модальное окно с сообщением об успешной покупке.

## Ключевые типы данных

### `component.ts`

```
import { EventEmitter } from '../../components/base/events';

export interface IComponent {
	parentContainer: HTMLElement;
	events: EventEmitter;
	template: HTMLElement;

	render(data?: any): HTMLElement;
}
```

### `model.ts`

```
import { EventEmitter } from '../../components/base/events';

export interface IModel {
	events: EventEmitter;
}
```

### `Cart.ts`

```
import { IModel } from './base/model';

export interface ICartItem {
	id: string;
	price: number;
	title: string;
}

export interface ICartModel extends IModel {
	productsList: ICartItem[];
	total: number;

	addItem(item: ICartItem): void;
	removeItem(id: string): void;
}
```

### `OrderForm.ts`

```
export interface IOrderData {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export type FormFieldTypes = 'phone' | 'email' | 'address' | 'payment';

export interface IFormView {
	errors: string[];
	isSubmit: boolean;
}

export interface IFormModel {
	orderData: IOrderData;
	errors: string[];

	validate(value: string, type: FormFieldTypes): string[];
	postOrder(formFields: IOrderData): Promise<object>;
}
```

### `ProductCard.ts`

```
import { IModel } from './base/model';
import { IProduct } from './Products';

export interface IProductCardModel extends IModel {
	product: IProduct;

	getItem(url: string): Promise<object>;
}
```

### `Products.ts`

```
import { IModel } from './base/model';

export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	price: number | undefined;
}

export type IProductPreview = Omit<IProduct, 'description'>;

export interface IResponseProducts {
	total: number;
	items: IProduct[];
}

export interface IProductsListModel extends IModel {
	productsList: IProduct[];

	getItems(url: string): Promise<object>;
}
```

### `ResultModal.ts`

```
export interface IResultModal {
	id: string;
	total: number;
}
```
