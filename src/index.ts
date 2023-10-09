import { items, TOTAL_SPACE } from "@/data";

import { ItemRepository } from "@/repositories";
import { Warehouse } from "@/warehouse";
import { WarehouseOrderManager } from "@/warehouseOrderManager";
import { PriorityGroupStrategy, MostValuableSetStrategy } from "@/strategies";

const itemRepository = new ItemRepository(items);

(() => {
  const warehouse = new Warehouse(TOTAL_SPACE, itemRepository);
  const manager = new WarehouseOrderManager(warehouse, itemRepository);

  const subStrategy = new MostValuableSetStrategy(warehouse, itemRepository);
  const strategy = new PriorityGroupStrategy(warehouse, subStrategy);

  const orderList = new Set<string>(items.map(({ name }) => name));

  manager.withStrategy(strategy).processOrder(orderList);

  console.log(`Total value is: ${warehouse.warehouseValue}`);
  console.log(`Warehouse occupancy: ${warehouse.size - warehouse.freeSpace}`);
  console.log("Warehouse items");
  console.table(warehouse.listItemNames());
})();
