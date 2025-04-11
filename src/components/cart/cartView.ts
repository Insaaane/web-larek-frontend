import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';
import { cloneTemplate } from '../../utils/utils';
import { ICartItem } from '../../types/Cart';

enum Selectors {
	parenContainer = '.modal__content',
	headerBasket = '.header__basket',
	headerBasketCounter = '.header__basket-counter',
	itemsList = '.basket__list',
	orderButton = '.button',
	title = '.card__title',
	index = '.basket__item-index',
	price = '.card__price',
	item = '.basket__item',
	deleteButton = '.basket__item-delete',
	card = '.card_compact',
	total = '.basket__price',
}

export class CartView extends Modal<ICartItem> {
	private _deleteButton: HTMLElement;
	private _orderButton: HTMLElement;
	private _headerCart: HTMLElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter,
		template: HTMLElement
	) {
		super(container, events, template);
		this._parentContainer = container.querySelector(Selectors.parenContainer);

		this._headerCart = document.querySelector(Selectors.headerBasket);
		this._headerCart.addEventListener('click', this.handleHeaderCartClick);
	}

	set products(products: ICartItem[]) {
		this.renderCart(products);
	}

	removeCard(id: string) {
		const container = this.template.querySelector(Selectors.itemsList);
		if (!container) return;

		const itemToDelete = document.getElementById(id);

		if (itemToDelete) itemToDelete.remove();

		container
			.querySelectorAll(Selectors.card)
			.forEach((el: HTMLElement, index) => {
				this.setText(el.querySelector(Selectors.index), index + 1);
			});
	}

	update(count: number, total: number) {
		this.setText(
			this._headerCart.querySelector(Selectors.headerBasketCounter),
			count
		);

		this.setText(
			this._parentContainer.querySelector(Selectors.total),
			`${total} синапсов`
		);

		this.setDisabled(this._orderButton, count === 0);
	}

	private renderCart(products: ICartItem[]) {
		const container = this.template.querySelector(Selectors.itemsList);
		container.innerHTML = '';

		products.forEach((product, index) => {
			this.renderCartItem(product, index, container);
		});

		this._parentContainer.appendChild(this._template);
		this._orderButton = document.querySelector(Selectors.orderButton);
		this._orderButton.addEventListener('click', this.handleOrderButtonClick);
	}

	private renderCartItem(product: ICartItem, index: number, container: Element) {
		const itemTemplate = cloneTemplate('#card-basket') as HTMLElement;

		this.setText(itemTemplate.querySelector(Selectors.title), product.title);
		this.setText(itemTemplate.querySelector(Selectors.price), product.price);
		this.setText(itemTemplate.querySelector(Selectors.index), index + 1);

		container.appendChild(itemTemplate);
		itemTemplate.setAttribute('id', product.id);

		this._deleteButton = itemTemplate.querySelector(Selectors.deleteButton);
		this._deleteButton.addEventListener('click', this.handleTrashButtonClick);
	}

	private handleHeaderCartClick = () => {
		this._events.emit('cart:open');
		this._parentContainer.innerHTML = '';
		this._parentContainer.appendChild(this._template);
	};

	private handleTrashButtonClick = (e: MouseEvent) => {
		const targetElem = e.target as HTMLElement;
		const targetId = targetElem.closest(Selectors.card).id;

		this._events.emit('cart:remove', { id: targetId });
	};

	private handleOrderButtonClick = () => {
		this.closeModal();
		this._events.emit('order:create');
	};
}
