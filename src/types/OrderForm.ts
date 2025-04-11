export interface IOrderData {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export type FormFieldTypes = 'phone' | 'email' | 'address' | 'payment';

export interface IFormView {
	errors: string[];
	isSubmit: boolean;
}

export interface IFormModel {
	orderData: IOrderData;
	errors: string[];

	validate(value: string, type: FormFieldTypes): string[];
	postOrder(formFields: IOrderData): Promise<object>;
}
