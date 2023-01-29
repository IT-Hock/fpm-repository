// Unit Tests for PackageListing class

import { PackageListing, SortOrder, SortType } from "../package_listing";

describe("PackageListing", () => {
    it("should be defined", () => {
        expect(PackageListing).toBeDefined();
    });

    it("should be able to sort by name ASC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "b", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "a", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "c", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" }
        ]);
        listing.sort(SortType.Name, SortOrder.Ascending);
        expect(listing.getPaginationItems()[0].name).toBe("a");
        expect(listing.getPaginationItems()[1].name).toBe("b");
        expect(listing.getPaginationItems()[2].name).toBe("c");
    });

    it("should be able to sort by stars ASC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "a", stars: 2, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "b", stars: 1, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "c", stars: 3, forks: 0, updated: "2018-01-01T00:00:00Z" }
        ]);

        listing.sort(SortType.Stars, SortOrder.Ascending);
        expect(listing.getPaginationItems()[0].name).toBe("b");
        expect(listing.getPaginationItems()[1].name).toBe("a");
        expect(listing.getPaginationItems()[2].name).toBe("c");
    });

    it("should be able to sort by forks ASC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "a", stars: 0, forks: 2, updated: "2018-01-01T00:00:00Z" },
            { name: "b", stars: 0, forks: 1, updated: "2018-01-01T00:00:00Z" },
            { name: "c", stars: 0, forks: 3, updated: "2018-01-01T00:00:00Z" }
        ]);

        listing.sort(SortType.Forks, SortOrder.Ascending);
        expect(listing.getPaginationItems()[0].name).toBe("b");
        expect(listing.getPaginationItems()[1].name).toBe("a");
        expect(listing.getPaginationItems()[2].name).toBe("c");
    });

    it("should be able to sort by updated ASC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "a", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "b", stars: 0, forks: 0, updated: "2018-01-02T00:00:00Z" },
            { name: "c", stars: 0, forks: 0, updated: "2018-01-03T00:00:00Z" }
        ]);

        listing.sort(SortType.Updated, SortOrder.Ascending);
        expect(listing.getPaginationItems()[0].name).toBe("a");
        expect(listing.getPaginationItems()[1].name).toBe("b");
        expect(listing.getPaginationItems()[2].name).toBe("c");
    });

    it("should be able to sort by name DESC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "b", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "a", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "c", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" }
        ]);

        listing.sort(SortType.Name, SortOrder.Descending);
        expect(listing.getPaginationItems()[0].name).toBe("c");
        expect(listing.getPaginationItems()[1].name).toBe("b");
        expect(listing.getPaginationItems()[2].name).toBe("a");
    });

    it("should be able to sort by stars DESC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "a", stars: 2, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "b", stars: 1, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "c", stars: 3, forks: 0, updated: "2018-01-01T00:00:00Z" }
        ]);

        listing.sort(SortType.Stars, SortOrder.Descending);
        expect(listing.getPaginationItems()[0].name).toBe("c");
        expect(listing.getPaginationItems()[1].name).toBe("a");
        expect(listing.getPaginationItems()[2].name).toBe("b");
    });

    it("should be able to sort by forks DESC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "a", stars: 0, forks: 2, updated: "2018-01-01T00:00:00Z" },
            { name: "b", stars: 0, forks: 1, updated: "2018-01-01T00:00:00Z" },
            { name: "c", stars: 0, forks: 3, updated: "2018-01-01T00:00:00Z" }
        ]);

        listing.sort(SortType.Forks, SortOrder.Descending);
        expect(listing.getPaginationItems()[0].name).toBe("c");
        expect(listing.getPaginationItems()[1].name).toBe("a");
        expect(listing.getPaginationItems()[2].name).toBe("b");
    });

    it("should be able to sort by updated DESC", () => {
        let listing = new PackageListing();
        listing.setPaginationItems([
            { name: "a", stars: 0, forks: 0, updated: "2018-01-01T00:00:00Z" },
            { name: "b", stars: 0, forks: 0, updated: "2018-01-02T00:00:00Z" },
            { name: "c", stars: 0, forks: 0, updated: "2018-01-03T00:00:00Z" }
        ]);

        listing.sort(SortType.Updated, SortOrder.Descending);
        expect(listing.getPaginationItems()[0].name).toBe("c");
        expect(listing.getPaginationItems()[1].name).toBe("b");
        expect(listing.getPaginationItems()[2].name).toBe("a");
    });
});