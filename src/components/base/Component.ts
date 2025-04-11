import { IComponent } from '../../types/base/component';
import { EventEmitter } from './events';

export abstract class Component<T> implements IComponent {
	protected _template: HTMLElement;
	protected _parentContainer: HTMLElement;
	protected _events: EventEmitter;

	protected constructor(
		parentContainer: HTMLElement,
		events: EventEmitter,
		template: HTMLElement
	) {
		this._template = template;
		this._events = events;
		this._parentContainer = parentContainer;
	}

	get template() {
		return this._template;
	}

	get parentContainer() {
		return this._parentContainer;
	}

	get events() {
		return this._events;
	}

	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	protected setImage(element: HTMLImageElement, imgSrc: string, alt?: string) {
		if (element) {
			element.src = imgSrc;
			element.alt = alt || '';
		}
	}

	render(data?: Partial<T>) {
		Object.assign(this as object, data ?? {});
		return this.parentContainer;
	}
}
