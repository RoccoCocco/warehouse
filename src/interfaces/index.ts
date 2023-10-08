import { Item } from "@/models";

export interface IWarehouse {
  readonly size: number;
  readonly freeSpace: number;
  readonly warehouseValue: number;
  add(id: string): void;
  has(id: string): boolean;
}

export interface IItemRepository {
  getOrThrow(id: string): Item;
  getDependencies(id: string): Array<Item>;
}

export interface IStrategy {
  assort(items: Array<Item>): Array<Item> | Iterable<Item>;
}
