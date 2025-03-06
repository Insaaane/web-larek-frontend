export interface IProductModel {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	category: string;
	price: number | undefined;
}

export interface IProductCard {
	product: IProductModel;

	getCard(url: string): Promise<IProductModel>;
}

export interface IProductsList {
	products: IProductModel[];

	getItems(url: string): Promise<object>;
}