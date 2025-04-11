import { IProduct, IProductsListModel } from '../../types/Products';
import { EventEmitter } from '../base/events';
import { webLarekApi } from '../api';

export class ProductsModel implements IProductsListModel {
	private _productsList: IProduct[];

	constructor(private readonly _events: EventEmitter) {
		this.getItems();
	}

	get events() {
		return this._events;
	}

	get productsList() {
		return this._productsList;
	}

	getItems = async () => {
		try {
			const response = await webLarekApi.get('/product/');
			this._productsList = response as IProduct[];
			this._events.emit('products:get', this._productsList);

			return this._productsList;
		} catch (e) {
			console.error('Error fetching items from API:', e);
			return [];
		}
	};
}
