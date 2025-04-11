import { ICartItem, ICartModel } from '../../types/Cart';
import { EventEmitter } from '../base/events';

export class CartModel implements ICartModel {
	private _productsList: ICartItem[];
	private _total: number;
	private _events: EventEmitter;

	constructor(events: EventEmitter) {
		this._events = events;
		this._productsList = [];
		this._total = 0;
	}

	get events() {
		return this._events;
	}

	get productsList() {
		return this._productsList;
	}

	get total() {
		return this._total;
	}

	clear() {
		this._productsList = [];
		this._total = 0;
	}

	addItem(card: ICartItem) {
		this._total += card.price;
		this._productsList.push(card);
	}

	removeItem(id: string) {
		this._total -= this.productsList.find((card) => card.id === id).price;
		this._productsList = this._productsList.filter((card) => card.id !== id);
	}
}
