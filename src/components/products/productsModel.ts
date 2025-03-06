import { IProductModel, IProductsList } from '../../types/Products';

export class ProductsModel implements IProductsList {
	private readonly _products: IProductModel[];

	constructor(products: IProductModel[]) {
		this._products = products;
	}

	get products(): IProductModel[] {
		return this._products;
	}

	public getItems = (url: string): Promise<object> => {
		return new Promise((resolve, reject) => {
			resolve({});
		});
	};
}
