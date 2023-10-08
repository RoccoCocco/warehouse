import { Item } from "@/models";

import { IStrategy } from "@/interfaces";

/**
 * Simple ordering
 * Prefer items with largest value, otherwise the with smalles size
 */
export class ValueSortStrategy implements IStrategy {
  assort(itemList: Array<Item>): Array<Item> | Iterable<Item> {
    const sorted = itemList.sort(this._sortByPriorityValueAndSize);

    console.table(sorted.map(({ name, value }) => ({ name, value })));

    return sorted;
  }

  private _sortByPriorityValueAndSize(left: Item, right: Item) {
    if (left.value !== right.value) {
      return left.value - right.value > 0 ? -1 : 1;
    }

    return left.size > right.size ? 1 : -1;
  }
}
