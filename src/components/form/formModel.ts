import { IFormModel, IOrderData } from '../../types/OrderForm';

export class FormModel implements IFormModel {
	private _orderData: IOrderData;

	get orderData(): IOrderData {
		return this._orderData;
	}
	
	input(value: string): void {
		throw new Error('Method not implemented.');
	}
	validate(value: string): string {
		throw new Error('Method not implemented.');
	}
	postOrder(formFields: IOrderData): Promise<object> {
		throw new Error('Method not implemented.');
	}
}
