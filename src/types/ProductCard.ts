import { IModel } from './base/model';
import { IProduct } from './Products';

export interface IProductCardModel extends IModel {
	product: IProduct;

	getItem(url: string): Promise<object>;
}
