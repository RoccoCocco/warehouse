import { IItemRepository, IWarehouse } from "@/interfaces";

export class Warehouse implements IWarehouse {
  private readonly _warehouseList = new Set<string>();

  private _warehouseOccupancy = 0;
  private _warehouseValue = 0;

  constructor(
    readonly size: number,
    private readonly _itemRepository: IItemRepository
  ) {}

  add(id: string) {
    const item = this._itemRepository.getOrThrow(id);

    this._warehouseOccupancy += item.size;
    this._warehouseValue += item.value;
    this._warehouseList.add(id);
  }

  get freeSpace() {
    return this.size - this._warehouseOccupancy;
  }

  has(id: string) {
    return this._warehouseList.has(id);
  }

  get warehouseValue() {
    return this._warehouseValue;
  }

  listItemNames() {
    return Array.from(this._warehouseList.values());
  }
}
