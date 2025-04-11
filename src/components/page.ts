import { EventEmitter } from './base/events';
import { cloneTemplate } from '../utils/utils';
import { ProductsModel } from './products/productsModel';
import { ProductsView } from './products/productsView';
import { IProduct, IResponseProducts } from '../types/Products';
import { FormFieldTypes } from '../types/OrderForm';
import { CardModel } from './card/cardModel';
import { CardView } from './card/cardView';
import { CartModel } from './cart/cartModel';
import { CartView } from './cart/cartView';
import { ICartItem } from '../types/Cart';
import { FormView } from './orderForm/formView';
import { FormModel } from './orderForm/formModel';
import { ResultView } from './resultModal/resultView';
import { IResultModal } from '../types/ResultModal';

const modalContainer = document.querySelector('.modal') as HTMLElement;

const CatalogSelectors = {
	container: document.querySelector('.gallery') as HTMLElement,
	template: cloneTemplate('#card-catalog'),
};

const CardSelectors = {
	template: cloneTemplate('#card-preview'),
};

const CartSelectors = {
	template: cloneTemplate('#basket'),
};

const FormSelectors = {
	orderTemplate: cloneTemplate('#order'),
	contactTemplate: cloneTemplate('#contacts'),
	buttonNext: '.order__button',
	buttonSubmit: '.button',
};

const successTemplate = cloneTemplate('#success');

export class Page {
	private broker = new EventEmitter();

	private productsModel: ProductsModel;
	private productsView: ProductsView;

	private cartModel: CartModel;
	private cartView: CartView;

	private cardModel: CardModel | null = null;
	private cardView: CardView | null = null;

	private formView: FormView | null = null;
	private formModel: FormModel;

	private successView: ResultView | null = null;

	constructor() {
		this.productsModel = new ProductsModel(this.broker);
		this.productsView = new ProductsView(
			CatalogSelectors.container,
			this.broker,
			CatalogSelectors.template
		);

		this.cartModel = new CartModel(this.broker);
		this.cartView = new CartView(
			modalContainer,
			this.broker,
			CartSelectors.template
		);

		this.formModel = new FormModel(this.broker);
		this.formView = new FormView(
			modalContainer,
			this.broker,
			FormSelectors.orderTemplate,
			FormSelectors.orderTemplate.querySelector(FormSelectors.buttonNext)
		);

		this.successView = new ResultView(
			modalContainer,
			this.broker,
			successTemplate
		);

		this.setupEventHandlers();
	}

	private setupEventHandlers() {
		this.broker.on('products:get', () => {
			this.productsView.render(
				this.productsModel.productsList as Partial<IResponseProducts>
			);
		});

		this.broker.on('card:open', (data: Record<string, string>) => {
			if (!this.cardModel || !this.cardView) {
				this.cardModel = new CardModel(this.broker);
				this.cardView = new CardView(
					modalContainer,
					this.broker,
					CardSelectors.template
				);
			}

			this.cardView.renderLoading();
			this.cardView.openModal();

			this.cardModel
				.getItem(data.id)
				.then((card: IProduct) => {
					this.cardView.setInCart(
						this.cartModel.productsList.some(
							(cartCard) => cartCard.id === card.id
						)
					);
					this.cardView.render(card as Partial<IProduct>);
				})
				.finally(() => {
					this.cardView.stopLoading();
				});
		});

		this.broker.on('cart:open', () => {
			this.cartView.render({
				products: this.cartModel.productsList,
			} as Partial<ICartItem>);

			this.cartView.update(
				this.cartModel.productsList.length,
				this.cartModel.total
			);

			this.cartView.openModal();
		});

		this.broker.on('cart:add', () => {
			const card = this.cardModel.product;
			const { title, id, price } = card;
			const adaptedCard: ICartItem = { title, id, price };

			this.cartModel.addItem(adaptedCard);

			this.cartView.update(
				this.cartModel.productsList.length,
				this.cartModel.total
			);
		});

		this.broker.on('cart:remove', (id: Record<string, string>) => {
			this.cartModel.removeItem(id.id);
			this.cartView.removeCard(id.id);
			this.cartView.update(
				this.cartModel.productsList.length,
				this.cartModel.total
			);
		});

		this.broker.on('order:create', () => {
			this.formView.renderForm();
			this.formModel.orderData.items = this.cartModel.productsList.map(
				(product) => product.id
			);
			this.formModel.orderData.total = this.cartModel.total;
		});

		this.broker.on(
			'form:input',
			(data: { value: string; name: FormFieldTypes }) => {
				const errors = this.formModel.validate(data.value, data.name);

				if (errors.length) {
					this.formView.render({ errors: errors, isSubmit: false });
				}

				if (this.formModel.isReady()) {
					this.formView.render({ errors: errors, isSubmit: true });
				}
			}
		);

		this.broker.on('order:submit', () => {
			if (this.formModel.currentForm !== 'contact') {
				this.formView.changeForm(
					FormSelectors.contactTemplate,
					FormSelectors.contactTemplate.querySelector(
						FormSelectors.buttonSubmit
					)
				);
				this.formView.renderForm();
				this.formModel.updateForm('contact');
			} else {
				this.formModel.postOrder().then((res: IResultModal) => {
					this.cartModel.clear();
					this.cartView.update(0, 0);

					this.formModel.clear();
					this.formModel.updateForm('order');
					this.formView.changeForm(
						FormSelectors.orderTemplate,
						FormSelectors.orderTemplate.querySelector(FormSelectors.buttonNext)
					);

					this.successView.render(res);
				});
			}
		});
	}
}
