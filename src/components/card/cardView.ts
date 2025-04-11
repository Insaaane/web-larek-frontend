import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';
import { IProduct } from '../../types/Products';

enum CartEvent {
	Add = 'add',
	Remove = 'remove',
}

enum ButtonText {
	Add = 'В корзину',
	Remove = 'Убрать из корзины',
}

export class CardView extends Modal<IProduct> {
	private _button: HTMLElement;
	private _id: string;
	private _isInCart = false;

	constructor(
		container: HTMLElement,
		event: EventEmitter,
		template: HTMLElement
	) {
		super(container, event, template);
		this._parentContainer = container.querySelector('.modal__content');
	}

	setInCart(isInCart: boolean) {
		this._isInCart = isInCart;
		this._button = this.parentContainer.querySelector('.card__button');
		this.updateButton();
	}

	renderLoading() {
		this.setHidden(this.parentContainer);
		this.parentContainer.appendChild(this.template);
	}

	stopLoading() {
		this.setVisible(this.parentContainer);
	}

	set id(id: string) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set title(title: string) {
		this.setText(this.parentContainer.querySelector('.card__title'), title);
	}

	set description(description: string) {
		this.setText(
			this.parentContainer.querySelector('.card__text'),
			description
		);
	}

	set category(category: string) {
		this.setText(
			this.parentContainer.querySelector('.card__category'),
			category
		);
	}

	set price(price: string) {
		const priceEl = this.parentContainer.querySelector(
			'.card__price'
		) as HTMLElement;

		if (price) {
			this.setText(priceEl, `${price} синапсов`);
			this.setDisabled(this._button, false);
		} else {
			this.setText(priceEl, 'Бесценно');
			this.setDisabled(this._button, true);
		}
	}

	set image(url: string) {
		this.setImage(
			this.parentContainer.querySelector('.card__image'),
			CDN_URL + url
		);
	}

	private handleButtonClick = () => {
		const event = this._isInCart ? CartEvent.Remove : CartEvent.Add;
		this.toggleCartState(event);
	};

	private toggleCartState(event: CartEvent) {
		this._isInCart = event === CartEvent.Add;
		this.updateButton();
		this._events.emit(`cart:${event}`, { id: this.id });
	}

	private updateButton() {
		if (!this._button) return;

		this._button.textContent = this._isInCart
			? ButtonText.Remove
			: ButtonText.Add;

		this._button.removeEventListener('click', this.handleButtonClick);
		this._button.addEventListener('click', this.handleButtonClick);
	}
}
