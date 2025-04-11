import { EventEmitter } from '../base/events';
import { webLarekApi } from '../api';
import { FormFieldTypes, IFormModel, IOrderData } from '../../types/OrderForm';

const orderDataInitialState: IOrderData = {
	payment: '',
	email: '',
	phone: '',
	address: '',
	items: [''],
	total: 0,
};

enum FormErrors {
	EMPTY = 'Поле не должно быть пустым',
	EMAIL = 'Неправильно введена почта',
	PHONE = 'Неправильно введен телефон',
}

type TFormStage = 'order' | 'contact';

const REG_MAIL = /^[^@]+@[^@]+\.[^@]+$/;
const REG_PHONE = /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/;

export class FormModel implements IFormModel {
	private _orderData: IOrderData;
	private _errors: string[];
	private _currentFormStage: TFormStage;

	private readonly _events: EventEmitter;

	constructor(events: EventEmitter) {
		this._events = events;
		this._orderData = orderDataInitialState;
		this._currentFormStage = 'order';
	}

	get currentForm() {
		return this._currentFormStage;
	}

	get events() {
		return this._events;
	}

	get orderData() {
		return this._orderData;
	}

	get errors() {
		return this._errors;
	}

	set errors(error: string[]) {
		this._errors = error;
	}

	updateForm(newForm: TFormStage) {
		this._currentFormStage = newForm;
	}

	clear() {
		this._orderData = orderDataInitialState;
	}

	isReady() {
		switch (this._currentFormStage) {
			case 'order':
				return !!this.orderData.payment && !!this.orderData.address;
			case 'contact':
				return (
					REG_PHONE.test(this.orderData.phone) &&
					REG_MAIL.test(this.orderData.email)
				);
		}
	}

	validate(value: string, type: FormFieldTypes) {
		this._errors = [];

		if (!value) {
			this.errors.push(FormErrors.EMPTY);
		} else {
			this._errors = this.errors.filter((error) => error === FormErrors.EMPTY);
		}

		switch (type) {
			case 'phone':
				if (!value.match(REG_PHONE)) {
					this._errors.push(FormErrors.PHONE);
				} else {
					this._errors = this._errors.filter(
						(error) => error === FormErrors.PHONE
					);
				}
				break;
			case 'email':
				if (!value.match(REG_MAIL)) {
					this._errors.push(FormErrors.EMAIL);
				} else {
					this._errors = this._errors.filter(
						(error) => error === FormErrors.EMAIL
					);
				}
				break;
		}

		this.orderData[type] = value;
		return this._errors;
	}

	postOrder() {
		return webLarekApi.post('/order', this.orderData);
	}
}
