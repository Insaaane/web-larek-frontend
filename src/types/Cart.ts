export interface ICartItem {
	id: string;
	price: number;
	title: string;
}

export interface ICartModel {
	productsList: ICartItem[];
	totalPrice: number;

	addItemToCart(id: string): void;
	removeItem(id: string): void;
}