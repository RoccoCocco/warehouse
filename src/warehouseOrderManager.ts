import { Item } from "@/models";
import {
  IStrategy,
  IItemRepository,
  IWarehouse,
} from "@/interfaces";

export class WarehouseOrderManager {
  private _strategy?: IStrategy;

  constructor(
    private readonly _warehouse: IWarehouse,
    private readonly _itemRepository: IItemRepository
  ) {}

  withStrategy(strategy: IStrategy) {
    this._strategy = strategy;
    return this;
  }

  processOrder(orderList: Set<string>) {
    const assortedOrderList = this._getAssortedOrderList(orderList);

    for (const { name, size } of assortedOrderList) {
      if (orderList.has(name) === false) {
        console.debug(`🚫 Item [${name}] not available`);
        continue;
      }

      if (size > this._warehouse.freeSpace) {
        console.debug(`🔕 Not enough space for [${name}]`);
        continue;
      }

      const { requiredDependencies, requiredDependenciesSize } =
        this._getRequiredDependenciesAndTotalSize(name);
      const requiredSizeToAdd = size + requiredDependenciesSize;

      if (requiredSizeToAdd > this._warehouse.freeSpace) {
        console.debug(`🔕 Not enough space with dependencies for [${name}]`);
        continue;
      }

      for (const dependency of requiredDependencies) {
        console.debug(`➕ Add dependency [${dependency.name}] for [${name}]`);
        this._warehouse.add(dependency.name);
        orderList.delete(dependency.name);
      }

      console.debug(`➕ Add [${name}]`);

      this._warehouse.add(name);
      orderList.delete(name);
    }
  }

  private _getAssortedOrderList(
    orderList: Set<string>
  ): Array<Item> | Iterable<Item> {
    const itemList = Array.from(orderList.values()).map<Item>((id) =>
      this._itemRepository.getOrThrow(id)
    );

    if (this._strategy) {
      return this._strategy.assort(itemList);
    }

    return itemList;
  }

  private _getRequiredDependenciesAndTotalSize(id: string) {
    const dependencies = this._itemRepository.getDependencies(id);

    const requiredDependencies = dependencies.filter(
      ({ name }) => this._warehouse.has(name) === false
    );
    const requiredDependenciesSize = this._sumItemsSize(requiredDependencies);

    return { requiredDependencies, requiredDependenciesSize } as const;
  }

  private _sumItemsSize(items: Array<Item>) {
    return items.reduce((sum, { size }) => sum + size, 0);
  }
}
