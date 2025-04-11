import {
	IProduct,
	IProductPreview,
	IResponseProducts,
} from '../../types/Products';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';
import { CDN_URL } from '../../utils/constants';

enum Selectors {
	cardTitle = '.card__title',
	cardImage = '.card__image',
	cardCategory = '.card__category',
	cardPrice = '.card__price',
}

export class ProductsView extends Component<IResponseProducts> {
	constructor(
		parentContainer: HTMLElement,
		events: EventEmitter,
		template: HTMLElement
	) {
		super(parentContainer, events, template);
	}

	set items(productsList: IProduct[]) {
		this.parentContainer.innerHTML = '';

		productsList.forEach((item: IProductPreview) => {
			this.renderProduct(item);
		});
	}

	private handleProductCardClick(id: string) {
		this._events.emit('card:open', { id: id });
	}

	renderProduct(productItem: IProductPreview) {
		const newItem = this._template.cloneNode(true) as HTMLElement;

		this.setText(newItem.querySelector(Selectors.cardTitle), productItem.title);

		this.setImage(
			newItem.querySelector(Selectors.cardImage),
			CDN_URL + productItem.image
		);

		this.setText(
			newItem.querySelector(Selectors.cardCategory),
			productItem.category
		);

		this.setText(
			newItem.querySelector(Selectors.cardPrice),
			productItem.price ? `${productItem.price} синапсов` : 'Бесценно'
		);

		newItem.addEventListener('click', () => {
			this.handleProductCardClick(productItem.id);
		});

		this.parentContainer.appendChild(newItem);
	}
}
