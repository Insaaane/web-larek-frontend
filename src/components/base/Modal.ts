import { Component } from './Component';
import { EventEmitter } from './events';

enum Selectors {
	modalClose = '.modal__close',
}

export abstract class Modal<T> extends Component<T> {
	protected closeButton: HTMLElement;
	private readonly modalParentContainer: HTMLElement;

	protected constructor(
		parentContainer: HTMLElement,
		events: EventEmitter,
		template: HTMLElement
	) {
		super(parentContainer, events, template);
		this.modalParentContainer = parentContainer;
	}

	openModal = () => {
		const top = window.scrollY || document.documentElement.scrollTop || 0;
		const left = window.scrollX || document.documentElement.scrollLeft || 0;

		this.modalParentContainer.style.top = `${top}px`;
		this.modalParentContainer.style.left = `${left}px`;

		document.body.style.overflow = 'hidden';
		this.toggleClass(this.modalParentContainer, 'modal_active');

		this.initEventListeners();
	};

	private initEventListeners = () => {
		document.body.addEventListener('click', this.handleBodyClick);

		this.closeButton = this.modalParentContainer.querySelector(
			Selectors.modalClose
		);
		if (this.closeButton) {
			this.closeButton.addEventListener('click', this.handleCloseButtonClick);
		}
	};

	protected handleCloseButtonClick = () => {
		this.closeModal();
	};

	protected handleBodyClick = (event: MouseEvent) => {
		if (event.target === this.closeButton) {
			event.stopPropagation();
		}
		if (event.target === this.modalParentContainer) {
			this.closeModal();
		}
	};

	protected closeModal = () => {
		document.body.style.overflow = 'auto';
		this.toggleClass(this.modalParentContainer, 'modal_active');

		document.body.removeEventListener('click', this.handleBodyClick);

		if (this.closeButton) {
			this.closeButton.removeEventListener(
				'click',
				this.handleCloseButtonClick
			);
		}

		this._parentContainer.innerHTML = '';
	};
}
