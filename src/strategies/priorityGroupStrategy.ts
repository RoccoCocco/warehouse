import { Item } from "@/models";

import { IStrategy, IWarehouse } from "@/interfaces";

/**
 * Splits items into sorted priority groups and applies secondary strategy on each.
 */
export class PriorityGroupStrategy implements IStrategy {
  constructor(
    private readonly _warehouse: IWarehouse,
    private readonly _secondaryStrategy: IStrategy
  ) {}

  *assort(items: Array<Item>): Iterable<Item> {
    const priorityLists = this._getPrioritizedItemLists(items);

    for (const priorityItems of priorityLists) {
      const secondarySort = this._secondaryStrategy.assort(priorityItems);

      for (const item of secondarySort) {
        yield item;
      }
    }
  }

  private *_getPrioritizedItemLists(items: Array<Item>) {
    const distinctPriorities = new Set<number>();
    items.forEach(({ priority }) => distinctPriorities.add(priority));
    const sortedPriorities = Array.from(distinctPriorities).sort();

    for (const priority of sortedPriorities) {
      console.debug(`🚩 Handing over priority [${priority}]`);
      yield items
        .filter((item) => item.priority === priority)
        .filter((item) => this._warehouse.has(item.name) === false);
    }
  }
}
