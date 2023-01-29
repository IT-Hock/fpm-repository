import { Listing } from "../listing";

describe("Listing", () => {
    it("should return the correct page", () => {
        let listing = new Listing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
        let page = listing.getPage(2);
        expect(page.getItems()).toEqual([6, 7, 8, 9, 10]);
    });

    it("should return the correct page count", () => {
        let listing = new Listing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
        expect(listing.getPageCount()).toEqual(2);
    });

    it("should set the items per page", () => {
        let listing = new Listing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
        listing.setItemsPerPage(2);
        expect(listing.getPageCount()).toEqual(5);
    });

    it("should set the items", () => {
        let listing = new Listing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
        listing.setItems([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        expect(listing.getPageCount()).toEqual(3);
    });

    it("should get the items", () => {
        let listing = new Listing([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
        expect(listing.getItems()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});