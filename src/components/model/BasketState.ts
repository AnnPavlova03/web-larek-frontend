import { IBasket, TTotal, TProduct } from '../../types';
import { Model } from '../common/Model';

export class BasketState extends Model<IBasket> {
	count: number;
	listProduct: TProduct[] = [];
	total: number;
	products: string[] = [];

	getOrderList(): TTotal {
		return {
			total: this.getTotal(),
			items: this.products,
		};
	}

	addProduct(card: TProduct) {
		const isProductInBasket = this.listProduct.some(
			(product) => product.id === card.id
		);
		if (!isProductInBasket) {
			this.listProduct.push(card);
			this.toggleOrderedCard(card.id);
			this.updateProductList();
			this.emitChanges('basket:change', { listProduct: this.listProduct });
		}
	}

	deleteProduct(id: string): void {
		this.listProduct = this.listProduct.filter((element) => element.id !== id);
		this.setIndex();
		this.updateProductList();
		this.emitChanges('basket:change', { listProduct: this.listProduct });
	}

	toggleOrderedCard(id: string) {
		if (!this.products.includes(id)) {
			this.products.push(id);
		} else {
			this.products = this.products.filter((item) => item !== id);
		}
	}
	getTotal(): number {
		this.total = this.products.reduce((a, c) => {
			const item = this.listProduct.find((it) => it.id === c);
			if (!item || item.price === null) {
				return a;
			}
			return a + Number(item.price);
		}, 0);
		return this.total;
	}

	setIndex() {
		this.listProduct.forEach((product, index) => {
			product.index = index + 1;
		});
		this.count = this.listProduct.length;
	}

	clearBasket() {
		this.listProduct = [];
		this.products = [];
		this.setIndex();
		this.emitChanges('basket:change', { listProduct: this.listProduct });
	}
	updateProductList() {
		this.products = this.listProduct.map((product) => product.id);
	}
}
