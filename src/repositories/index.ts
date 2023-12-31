import { Item } from "@/models";
import { IItemRepository } from "@/interfaces";

export class ItemRepository implements IItemRepository {
  private readonly _itemMap = new Map<string, Item>();

  constructor(items: Array<Item> = []) {
    items.forEach((item) => this._itemMap.set(item.name, item));
  }

  get(id: string) {
    return this._itemMap.get(id);
  }

  getOrThrow(id: string) {
    const item = this._itemMap.get(id);

    if (item) {
      return item;
    }

    throw new Error("Item not found");
  }

  getDependencies(id: string) {
    return this._getDependencies(id);
  }

  private _getDependencies(
    id: string,
    isRoot = true,
    processed: Set<string> = new Set()
  ) {
    const item = this.getOrThrow(id);
    const dependencies: Array<Item> = [];

    if (isRoot === false) {
      dependencies.push(item);
    }

    for (const dependency of item.dependencies) {
      // Avoids infinite recursion if there are circular dependencies
      if (processed.has(dependency) === false) {
        processed.add(dependency);
        dependencies.push(
          ...this._getDependencies(dependency, false, processed)
        );
      }
    }

    return dependencies;
  }
}
