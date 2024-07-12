import { ICard, ICardList } from '../../types';
import { Model } from '../common/Model';

export class CardState extends Model<ICardList> {
	catalog: ICard[];
	preview: string | null;
	button: boolean;

	setCatalog(items: ICard[]) {
		this.catalog = items.map((item) => item, this.events);
		this.emitChanges('cards:changed', { catalog: this.catalog });
	}
	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}
}
