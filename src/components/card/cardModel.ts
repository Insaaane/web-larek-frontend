import { IProductCard, IProductModel } from '../../types/Products';

export class CardModel implements IProductCard {
	private _product: IProductModel;

	constructor(product: IProductModel) {
		this._product = product;
	}

	get product(): IProductModel {
		return this._product;
	}

	getCard(url: string): Promise<IProductModel> {
		this._product = {
			id: '',
			category: '',
			description: '',
			imageUrl: '',
			price: 1,
			title: 'a',
		};
		throw new Error('Method not implemented');
	}
}
