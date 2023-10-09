import { Item } from "@/models";

import { IStrategy, IWarehouse, IItemRepository } from "@/interfaces";
import { ItemListHelper } from "@/helpers";

export class BruteforceSortStrategy implements IStrategy {
  constructor(
    private readonly _warehouse: IWarehouse,
    private readonly _itemRepository: IItemRepository
  ) {}

  assort(items: Array<Item>): Array<Item> | Iterable<Item> {
    const itemsWithDependencies = ItemListHelper.removeDuplicates(
      ...items.map((item) => this._getDependencies(item)).flat()
    );

    const itemsWithDependenciesSize = ItemListHelper.sumSize(
      itemsWithDependencies
    );

    if (itemsWithDependenciesSize <= this._warehouse.freeSpace) {
      console.debug("🔔 All can fit, returning whole order");
      return items;
    }

    return this._findMostValuableList(items);
  }

  private _findMostValuableList(items: Array<Item>) {
    const selection: Array<Array<Item>> = [];

    for (const item of items) {
      const currentLength = selection.length;

      const itemWithDependencies = this._getDependencies(item);

      if (itemWithDependencies.length === 0) {
        console.debug("🚫 Nothing to add");
        continue;
      }

      const totalSize = ItemListHelper.sumSize(itemWithDependencies);

      if (totalSize > this._warehouse.freeSpace) {
        console.debug(`🚫 Item [${item.name}] exceeds free space`);
        continue;
      }

      for (let i = 0; i < currentLength; i++) {
        const newItemList = ItemListHelper.removeDuplicates(
          ...selection[i],
          ...itemWithDependencies
        );

        const newListTotalSize = ItemListHelper.sumSize(newItemList);

        if (newListTotalSize <= this._warehouse.freeSpace) {
          selection.push(newItemList);
        }
      }

      selection.push([item]);
    }

    return this._selectMostValuableList(selection);
  }

  private _selectMostValuableList(list: Array<Array<Item>>) {
    let selectedValue = 0;
    let selectedSize = 0;
    let selectedItemList: Array<Item> = [];

    for (const itemList of list) {
      const totalSize = ItemListHelper.sumSize(itemList);
      const totalValue = ItemListHelper.sumValue(itemList);

      if (totalValue < selectedValue) {
        continue;
      }

      if (totalValue === selectedValue && totalSize > selectedSize) {
        continue;
      }

      selectedValue = totalValue;
      selectedSize = totalSize;
      selectedItemList = itemList;
    }

    return selectedItemList;
  }

  private _getDependencies(item: Item) {
    const dependencies = this._itemRepository.getDependencies(item.name);

    return [item, ...dependencies].filter(
      ({ name }) => this._warehouse.has(name) === false
    );
  }
}
