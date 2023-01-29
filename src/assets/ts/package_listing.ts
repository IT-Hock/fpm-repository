import {Listing} from "./objects/listing";
import {Package} from "./package";
import {SortDirection} from "./objects/sorting";
import {getFilteredPackages} from "./utils/search";

export enum SortType {
    Name = 0,
    Stars = 1,
    Forks = 2,
    Updated = 3
}

export class PackageListing extends Listing<Package> {
    protected currentFilter: string = "";

    constructor(items: Package[] = [], itemsPerPage: number = 10, sortType: SortType = SortType.Name, sortDirection: SortDirection = SortDirection.Ascending) {
        super(items, itemsPerPage, sortType, sortDirection);
    }

    public override sort(sortBy: SortType | null = null, direction: SortDirection | null = null): Promise<Package[]> {
        return new Promise<Package[]>((resolve): void => {
            if (sortBy === null) {
                sortBy = this._currentSort;
            }
            if (direction === null) {
                direction = this._currentSortDirection;
            }
            this._currentSort = sortBy;
            this._currentSortDirection = direction;

            let items: Package[] = this.paginationItems.slice();
            switch (sortBy) {
                case SortType.Name:
                    items = items.sort((a: Package, b: Package): number => {
                        return direction === SortDirection.Ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                    });
                    break;
                case SortType.Stars:
                    items = items.sort((a: Package, b: Package): number => {
                        if (a.stars === 0) {
                            return 1;
                        }

                        if (b.stars === 0) {
                            return -1;
                        }
                        return direction === SortDirection.Ascending ? a.stars - b.stars : b.stars - a.stars;
                    });
                    break;
                case SortType.Forks:
                    items = items.sort((a: Package, b: Package): number => {
                        if (a.forks === 0) {
                            return 1;
                        }

                        if (b.forks === 0) {
                            return -1;
                        }
                        return direction === SortDirection.Ascending ? a.forks - b.forks : b.forks - a.forks;
                    });
                    break;
                case SortType.Updated:
                    items = items.sort((a: Package, b: Package): number => {
                        if (a.updated === "") {
                            return 1;
                        }

                        if (b.updated === "") {
                            return -1;
                        }

                        return direction === SortDirection.Ascending ? a.updated.localeCompare(b.updated) : b.updated.localeCompare(a.updated);
                    });
                    break;
                default:
                    throw new Error("Invalid sort type: " + SortType[sortBy] + " (" + sortBy + ")");
            }

            this.setPaginationItems(items);
            resolve(items);
        });
    }

    public override filter(filter: string): Promise<Package[]> {
        return new Promise<Package[]>((resolve, reject): void => {
            let filteredPackages = getFilteredPackages(this._items, filter);
            this.currentFilter = filter;
            if (filteredPackages == null || filteredPackages.length === 0) {
                reject("No packages found");
                return;
            }

            resolve(filteredPackages);
        });
    }

    public override setItems(items: Package[]): Promise<Package[]> {
        super.setItems(items);
        this.paginationItems = items;
        return this.sort(null, null);
    }
}
