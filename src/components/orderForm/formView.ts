import { IFormView } from '../../types/OrderForm';
import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';

enum Selectors {
	modalContent = '.modal__content',
	formErrors = '.form__errors',
	orderButtons = '.order__buttons',
	formInput = '.form__input',
	buttonAlt = '.button_alt',
	buttonAltActive = 'button_alt-active',
	actionButton = '.modal__actions .button',
}

export class FormView extends Modal<IFormView> {
	private formElements: NodeListOf<HTMLInputElement>;
	private formControls: HTMLElement;

	constructor(
		container: HTMLElement,
		events: EventEmitter,
		template: HTMLElement,
		private actionButton: HTMLElement
	) {
		super(container, events, template);
		this._parentContainer = this.parentContainer.querySelector(
			Selectors.modalContent
		);
	}

	set errors(errors: string[]) {
		const errorContainer = this.parentContainer.querySelector(
			Selectors.formErrors
		);

		if (!errorContainer) return;

		errorContainer.innerHTML = '';

		errors.forEach((error) => {
			const errorText = document.createElement('p');
			errorText.textContent = error;
			errorContainer.appendChild(errorText);
		});
	}

	set isSubmit(isSubmit: boolean) {
		this.setDisabled(this.actionButton, !isSubmit);
	}

	changeForm = (template: HTMLElement, button: HTMLButtonElement) => {
		this._template = template;
		this.actionButton = button;
		this.closeModal();
	};

	renderForm = () => {
		this.openModal();
		this.parentContainer.innerHTML = '';
		this.parentContainer.appendChild(this._template);

		this.initFormElements();
		this.initPaymentButtons();
		this.initActionButton();

		this.formControls = this.parentContainer.querySelector(
			Selectors.orderButtons
		);
		return this.parentContainer;
	};

	private initFormElements = () => {
		this.formElements = this.parentContainer.querySelectorAll(
			Selectors.formInput
		);
		this.formElements.forEach((field) => {
			field.value = '';
			field.addEventListener('input', this.handleFormElementInput);
		});
	};

	private initPaymentButtons = () => {
		const buttons = this.parentContainer.querySelectorAll(Selectors.buttonAlt);
		buttons.forEach((button) => {
			button.setAttribute('checked', 'false');
			button.classList.remove(Selectors.buttonAltActive);
			button.addEventListener('click', this.handlePaymentButtonClick);
		});
	};

	private initActionButton = () => {
		this.actionButton = this.parentContainer.querySelector(
			Selectors.actionButton
		);
		this.actionButton.addEventListener('click', this.handleSubmitButtonClick);
	};

	private handlePaymentButtonClick = (e: Event) => {
		e.preventDefault();
		const button = e.currentTarget as HTMLButtonElement;
		const anotherButton = this.formControls.querySelector(
			button.name === 'cash' ? 'button[name="card"]' : 'button[name="cash"]'
		) as HTMLButtonElement;
		this.events.emit('form:input', { value: button.name, name: 'payment' });
		this.updatePaymentButtonState(button, anotherButton);
	};

	private updatePaymentButtonState = (
		selectedButton: HTMLButtonElement,
		otherButton: HTMLButtonElement
	) => {
		selectedButton.setAttribute('checked', 'true');
		selectedButton.classList.add(Selectors.buttonAltActive);
		otherButton.setAttribute('checked', 'false');
		otherButton.classList.remove(Selectors.buttonAltActive);
	};

	private handleFormElementInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target && target.name) {
			this.events.emit('form:input', {
				value: target.value,
				name: target.name,
			});
		}
	};

	private handleSubmitButtonClick = (e: Event) => {
		e.preventDefault();

		if (this.actionButton.id === 'buy-button') this.closeModal();

		this.cleanupPaymentButtons();
		this.removeAllEventListeners();
		this.events.emit('order:submit');
	};

	private cleanupPaymentButtons = () => {
		const buttons = this.parentContainer.querySelectorAll(
			Selectors.buttonAlt
		) as NodeListOf<HTMLButtonElement>;
		buttons.forEach((button) => {
			button.removeEventListener('click', this.handlePaymentButtonClick);
		});
	};

	private removeAllEventListeners = () => {
		this.formElements?.forEach((field) => {
			field.removeEventListener('input', this.handleFormElementInput);
		});

		this.cleanupPaymentButtons();

		if (this.actionButton) {
			this.actionButton.removeEventListener(
				'click',
				this.handleSubmitButtonClick
			);
		}
	};
}
