import {Package} from "../package";
import {ENVIRONMENT} from "../generated/constants";
import {Environment} from "../environment";

export function getFilteredPackages(packages: Package[], filter: string): Package[] | null {
    if (filter.length === 0) {
        return null;
    }

    let filteredPackages: Package[] = packages.slice();
    let filters: string[] = filter.toLowerCase().split(" ");
    if (filters.length === 0) {
        return null;
    }

    let filtersApplied: number = 0;
    for (let filterParts of filters) {
        let parts: string[] = filterParts.split(":");
        if (parts.length === 2) {
            let key: string = parts[0] || "";
            let value: string = parts[1] || "";
            switch (key) {
                default:
                    if (ENVIRONMENT === Environment.Development) {
                        console.warn("Invalid filter key: " + key);
                    }
                    return null;

                case "/name":
                    filteredPackages = filteredPackages.filter((item: Package): boolean => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1);
                    filtersApplied++;
                    break;
                case "/author":
                    filteredPackages = filteredPackages.filter((item: Package): boolean => item.author.toLowerCase().indexOf(value.toLowerCase()) !== -1);
                    filtersApplied++;
                    break;
                case "/stars":
                    filteredPackages = filterByStars(filteredPackages, value);
                    filtersApplied++;
                    break;
                case "/forks":
                    filteredPackages = filterByForks(filteredPackages, value);
                    filtersApplied++;
                    break;
                case "/updated":
                    filteredPackages = filterByUpdated(filteredPackages, value);
                    filtersApplied++;
                    break;
            }
        }
    }

    if (filtersApplied === 0) {
        filteredPackages = filteredPackages.filter((item: Package): boolean => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
    }

    return filteredPackages;
}

function filterByStars(items: any[], value: string): Package[] {
    let parts = value.split(":");
    if (parts.length === 2) {
        let operator: string = parts[0] || "";
        let stars: number = parseInt(parts[1] || "0");
        switch (operator) {
            case ">=":
                return items.filter((item: Package): boolean => item.stars >= stars);
            case "<=":
                return items.filter((item: Package): boolean => item.stars <= stars);
        }
    } else {
        let stars: number = parseInt(value);
        return items.filter((item: Package): boolean => item.stars === stars);
    }

    return items;
}

function filterByForks(items: any[], value: string): Package[] {
    let parts: string[] = value.split(":");
    if (parts.length === 2) {
        let operator: string = parts[0] || "";
        let forks: number = parseInt(parts[1] || "0");
        switch (operator) {
            case ">=":
                return items.filter((item: Package): boolean => item.forks >= forks);
            case "<=":
                return items.filter((item: Package): boolean => item.forks <= forks);
        }
    } else {
        let forks: number = parseInt(value);
        return items.filter((item: Package): boolean => item.forks === forks);
    }

    return items;
}

function filterByUpdated(items: any[], value: string): Package[] {
    let parts: string[] = value.split(":");
    if (parts.length === 2) {
        let operator: string = parts[0] || "";
        let updated: Date = new Date(parts[1] || "");
        if (isNaN(updated.getTime())) {
            return items;
        }

        switch (operator) {
            case ">=":
                return items.filter((item: Package): boolean => {
                    let itemUpdated: Date = new Date(item.updated);
                    if (isNaN(itemUpdated.getTime())) {
                        return false;
                    }

                    return itemUpdated >= updated;
                });
            case "<=":
                return items.filter((item: Package): boolean => {
                    let itemUpdated: Date = new Date(item.updated);
                    if (isNaN(itemUpdated.getTime())) {
                        return false;
                    }

                    return itemUpdated <= updated;
                });
        }
    } else {
        let updated: Date = new Date(value);
        return items.filter((item: Package): boolean => {
            let itemUpdated: Date = new Date(item.updated);
            if (isNaN(itemUpdated.getTime())) {
                return false;
            }
            return itemUpdated.getTime() === updated.getTime();
        });
    }

    return items;
}