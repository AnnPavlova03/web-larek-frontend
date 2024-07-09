import { IBasket, TTotal, TProduct } from '../../types';
import { Model } from '../common/Model';


export class BasketState extends Model<IBasket> {
	count: number;
	listProduct: TProduct[] = [];
	total:number ;
	product: string[] = [];

	getOrderList(): TTotal {
        return {
            total: this.getTotal(), 
            items: this.product,
        };
    }

	addProduct(card: TProduct) {
		const isProductInBasket = this.listProduct.some(
			(product) => product.id === card.id
		);
		if (!isProductInBasket) {
			this.listProduct.push(card);
			this.toggleOrderedCard(card.id);
			this.emitChanges('basket:change', { listProduct: this.listProduct });
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
		this.total =this.product.reduce((a, c) => {
			const item = this.listProduct.find((it) => it.id === c);
			if (!item || item.price === null) {
				return a;
			}
			return a + Number(item.price);
		}, 0);
		return this.total
	}

	setIndex() {
		this.listProduct.forEach((product, index) => {
			product.index = index + 1;
		});
		this.count = this.listProduct.length;
	}

	clearBasket() {
		this.listProduct = [];
		this.product=[]
		this.setIndex();
		this.emitChanges('basket:change', { listProduct: this.listProduct });
	}
}
