export enum SortDirection {
    Ascending = 0,
    Descending = 1
}

export default class Sorting<T> {
    _currentSort: number = 0;
    _currentSortDirection: SortDirection = SortDirection.Ascending;

    sort(sortType: number, sortDirection: SortDirection): Promise<T[]> {
        return new Promise<T[]>((resolve): void => {
            this._currentSort = sortType;
            this._currentSortDirection = sortDirection;
            resolve([]);
        });
    }
}