import { IComponent, Modal } from '../../types/Components';
import { IOrderData } from '../../types/OrderForm';

export class CartView<T> extends Modal implements IComponent<T> {
	private readonly _container: HTMLElement;
	private readonly _model: T;
	private readonly _template: HTMLElement;
	private readonly _element: HTMLElement;
	private _trashButton: HTMLElement;
	private _orderButton: HTMLElement;

	constructor(
		container: HTMLElement,
		model: T,
		template: HTMLElement,
		element: HTMLElement
	) {
		super();
		this._template = template;
		this._element = element;
		this._model = model;
		this._container = container;
	}

	get element(): HTMLElement {
		return this._element;
	}
	get model(): T {
		return this._model;
	}
	get template(): HTMLElement {
		return this._template;
	}
	get container(): HTMLElement {
		return this._container;
	}

	render(data: object): HTMLElement {
		throw new Error('Method not implemented.');
	}

	private handleTrashButtonClick(): HTMLElement {
		throw new Error('Method not implemented.');
	}

	private handleOrderButtonClick(data: IOrderData): void {
		throw new Error('Method not implemented.');
	}
}
