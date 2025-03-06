import { IComponent } from '../../types/Components';

export class ProductsView<T> implements IComponent<T> {
	private readonly _container: HTMLElement;
	private readonly _model: T;
	private readonly _template: HTMLElement;
	private readonly _element: HTMLElement;

	constructor(
		container: HTMLElement,
		model: T,
		template: HTMLElement,
		element: HTMLElement
	) {
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

	render(data?: object): HTMLElement {
		throw new Error('Method not implemented.');
	}
}
