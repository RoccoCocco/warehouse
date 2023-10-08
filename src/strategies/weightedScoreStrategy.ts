import { Item } from "@/models";

import { IStrategy, IItemRepository } from "@/interfaces";

/**
 * @todo Not sure what I wanted to do with this approach
 */
export class WeightedScoreStrategy implements IStrategy {
  constructor(
    private readonly _itemRepository: IItemRepository,
    private readonly _scoreWithPriorityPenalty = true
  ) {}

  assort(itemList: Array<Item>) {
    const assortedItemList = itemList
      .map((id) => this.getScore(id))
      .sort((left, right) => (left.score > right.score ? -1 : 1));

    console.debug(`📘 Assorted by weighted score`);
    console.table(
      assortedItemList.map(({ item: { name }, score }) => ({ name, score }))
    );

    return assortedItemList.map(({ item }) => item);
  }

  private getScore(item: Item) {
    const items = this._itemRepository.getDependencies(item.name);

    const totalSize = item.size + this.sum(items.map(({ size }) => size));
    const totalValue = item.value + this.sum(items.map(({ value }) => value));

    let score = totalValue / totalSize;

    if (this._scoreWithPriorityPenalty) {
      score -= score * (item.priority / 10);
    }

    return { item, score } as const;
  }

  private sum(nums: Array<number>) {
    return nums.reduce((sum, num) => sum + num, 0);
  }
}
