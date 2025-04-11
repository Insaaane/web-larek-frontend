import { EventEmitter } from '../../components/base/events';

export interface IComponent {
	parentContainer: HTMLElement;
	events: EventEmitter;
	template: HTMLElement;

	render(data?: any): HTMLElement;
}
