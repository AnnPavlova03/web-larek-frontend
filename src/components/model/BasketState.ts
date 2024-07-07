import { IBasket, TProduct } from '../../types';
import { Model } from '../common/Model';


export class BasketState extends Model<IBasket> {
	count: number;
	listProduct: TProduct[] = [];
	product: string[] = [];

	addProduct(card: TProduct) {
		const isProductInBasket = this.listProduct.some(
			(product) => product.id === card.id
		);
		if (!isProductInBasket) {
			this.listProduct.push(card);
			this.toggleOrderedCard(card.id);
			this.emitChanges('basket:change', { listProduct: this.listProduct });
		} else {
            document.getElementById('card__basket-messages').classList.add('card__basket-messages');
        }
    }
		
	
	deleteProduct(id: string): void {
		this.listProduct = this.listProduct.filter((element) => element.id !== id);
		this.emitChanges('basket:change', { listProduct: this.listProduct });
	}

	toggleOrderedCard(id: string) {
		if (!this.product.includes(id)) {
			this.product.push(id);
		} else {
			this.product = this.product.filter((item) => item !== id);
		}
	}
	getTotal():number {
		return this.product.reduce((a, c) => {
			const item = this.listProduct.find((it) => it.id === c);
			if (!item || item.price === null) {
				return a;
			}
			return a + Number(item.price);
		}, 0);
	}

	setIndex() {
		this.listProduct.forEach((product, index) => {
			product.index = index + 1;
		});
		this.count = this.listProduct.length;
	}

	clearBasket() {
		this.listProduct = [];
		this.setIndex();
		this.emitChanges('basket:change', { listProduct: this.listProduct });
	}
}
