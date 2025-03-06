import { ICartItem, ICartModel } from '../../types/Cart';

export class CartModel implements ICartModel {
	productsList: ICartItem[];
	totalPrice: number;

	get products(): ICartItem[] {
		return this.productsList;
	}

	get total(): number {
		return this.totalPrice;
	}

	addItemToCart(id: string): void {
		throw new Error('Method not implemented.');
	}
	removeItem(id: string): void {
		throw new Error('Method not implemented.');
	}
}
