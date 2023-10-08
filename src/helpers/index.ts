import { Item } from "@/models";

export class ItemListHelper {
  static sumSize(items: Array<Item>) {
    return items.reduce((sum, { size }) => sum + size, 0);
  }

  static sumValue(items: Array<Item>) {
    return items.reduce((sum, { value }) => sum + value, 0);
  }

  static removeDuplicates(...items: Array<Item>): Array<Item> {
    return Array.from(
      new Map<string, Item>(items.map((item) => [item.name, item])).values()
    );
  }
}
