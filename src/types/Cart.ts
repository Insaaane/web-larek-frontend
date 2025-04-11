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
