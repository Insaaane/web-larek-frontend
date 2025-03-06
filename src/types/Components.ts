export interface IComponent<T> {
	container: HTMLElement;
	model: T;
	template: HTMLElement;
	element: HTMLElement;

	render(data?: object): HTMLElement;
}

export abstract class Modal {
	private isOpen: boolean;
	private closeButton: HTMLElement;

	private initializeEventListeners = (): void => {
		throw new Error('Method not implemented.');
	};

	protected handleEscClick = (event: KeyboardEvent): void => {
		throw new Error('Method not implemented.');
	};

	protected handleCloseButtonClick = (): void => {
		throw new Error('Method not implemented.');
	};

	protected handleBodyClick = (event: MouseEvent): void => {
		throw new Error('Method not implemented.');
	};

	protected openModal = (): void => {
		throw new Error('Method not implemented.');
	};

	protected closeModal = (): void => {
		throw new Error('Method not implemented.');
	};
}
