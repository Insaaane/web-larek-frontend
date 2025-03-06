export type TPayment = 'online' | 'cash';

export interface IOrderData {
	payment: TPayment;
	mail: string;
	phone: string;
	address: string;
	totalPrice: number;
	items: string[];
}

export interface IFormModel {
	orderData: IOrderData;

	input(value: string): void;
	validate(value: string): string | undefined;
	postOrder(formFields: IOrderData): Promise<object>;
}
