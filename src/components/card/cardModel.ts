import { IProductCardModel } from '../../types/ProductCard';
import { IProduct } from '../../types/Products';
import { webLarekApi } from '../api';
import { EventEmitter } from '../base/events';

export class CardModel implements IProductCardModel {
	private _product: IProduct;
	private readonly _events: EventEmitter;

	constructor(events: EventEmitter) {
		this._events = events;
	}

	get product() {
		return this._product;
	}

	get events() {
		return this._events;
	}

	async getItem(id: string) {
		const response = await webLarekApi.get(`/product/${id}`);
		this._product = response as IProduct;
		return response;
	}
}
