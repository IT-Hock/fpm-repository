import Filtering from "./filtering";
import Sorting, {SortDirection} from "./sorting";
import Paginating from "./paginating";

export class Listing<T> extends Paginating<T> implements Sorting<T>, Filtering<T> {
    _currentSort: number = 0;
    _currentSortDirection: SortDirection = SortDirection.Ascending;
    protected _items: T[] = [];

    constructor(items: T[] = [], itemsPerPage: number = 10, sortType: number = 0, sortDirection: SortDirection = SortDirection.Ascending) {
        super(items, itemsPerPage);

        this._currentSort = sortType;
        this._currentSortDirection = sortDirection;

        this._items = items;
    }

    public setItems(items: T[]): void {
        this._items = items.slice();
    }

    /**
     * Returns a copy of the items in the listing.
     */
    public getItems(): T[] {
        return this._items.slice();
    }

    filter(filterValue: string): Promise<T[]> {
        throw new Error("Method not implemented: " + filterValue);
    }

    sort(sortType: number, sortDirection: SortDirection): Promise<T[]> {
        throw new Error("Method not implemented: " + sortType + ", " + sortDirection);
    }
}