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
