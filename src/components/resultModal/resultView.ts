import { IResultModal } from '../../types/ResultModal';
import { EventEmitter } from '../base/events';
import { Modal } from '../base/Modal';

enum Selectors {
	total = '.order-success__description',
	button = '.order-success__close',
	modalContent = '.modal__content',
}

export class ResultView extends Modal<IResultModal> {
	constructor(
		parentContainer: HTMLElement,
		events: EventEmitter,
		template: HTMLElement
	) {
		super(parentContainer, events, template);
		this._parentContainer = parentContainer.querySelector(
			Selectors.modalContent
		);
	}

	set total(total: number) {
		this.parentContainer.innerHTML = '';
		this.parentContainer.appendChild(this._template);

		this.closeButton = this.parentContainer.querySelector(
			Selectors.button
		) as HTMLButtonElement;

		if (this.closeButton) {
			this.closeButton.removeEventListener('click', this.handleFormClose);
			this.closeButton.addEventListener('click', this.handleFormClose);
		}

		this.setText(
			this.parentContainer.querySelector(Selectors.total),
			`Списано ${total} синапсов`
		);

		this.openModal();
	}

	handleFormClose = () => {
		this.closeModal();
	};
}
