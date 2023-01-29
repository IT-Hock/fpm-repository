import * as $ from "jquery";
import {ENVIRONMENT} from "../generated/constants";
import {Environment} from "../environment";

export default class Paginating<T> {
    protected paginationItems: T[] = [];
    private currentPage: number = 1;
    private itemsPerPage: number = 10;
    private pages: number = 0;
    private paginationEvent: ((page: number) => void) | null = null;

    constructor(paginationItems: T[] = [], itemsPerPage: number = 10) {
        this.setPaginationItems(paginationItems);
        this.itemsPerPage = itemsPerPage;
    }

    public setPaginationItems(paginationItems: T[]): void {
        this.paginationItems = paginationItems.slice();
        this.pages = Math.ceil(this.paginationItems.length / this.itemsPerPage);
        this.currentPage = 1;
    }

    /**
     * Returns a copy of the pagination items.
     */
    public getPaginationItems(): T[] {
        return this.paginationItems.slice();
    }

    public getItemsPerPage(): number {
        return this.itemsPerPage;
    }

    public setItemsPerPage(itemsPerPage: number): void {
        this.itemsPerPage = itemsPerPage;
        this.pages = Math.ceil(this.paginationItems.length / this.itemsPerPage);
    }

    public getPages(): number {
        return this.pages;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    public getItemsOnPage(page: number): T[] | null {
        if (page < 1 || page > this.pages) {
            return null;
        }
        let start: number = (page - 1) * this.itemsPerPage;
        let end: number = start + this.itemsPerPage;
        return this.paginationItems.slice(start, end);
    }

    public getItemCountOnCurrentPage(): number {
        let itemsOnCurrentPage: T[] | null = this.getItemsOnCurrentPage();
        if(itemsOnCurrentPage == null)
        {
            return 0;
        }

        return itemsOnCurrentPage.length;
    }

    public getItemsOnCurrentPage(): T[] | null {
        return this.getItemsOnPage(this.currentPage);
    }

    public setPaginationEvent(callback: (page: number) => void): void {
        this.paginationEvent = callback;
    }

    public hasPreviousPage(): boolean {
        return this.currentPage > 1;
    }

    public getStartPage(): number {
        return Math.max(1, this.currentPage - 2);
    }

    public getEndPage(): number {
        return Math.min(this.getPages(), this.currentPage + 2);
    }

    private hasNextPage(): boolean {
        return this.currentPage < this.pages;
    }

    public getPaginationContainer(): JQuery {
        let $pagination: JQuery<HTMLElement> = $("<ul>").addClass("pagination");
        let totalPages = this.getPages();

        if (this.hasPreviousPage()) {
            $pagination.append(this.getItemLink("<i class=\"fa fa-angle-left\"></i>", this.currentPage - 1));
        }
        if (this.getStartPage() > 1) {
            $pagination.append(this.getItemLink("1", 1));
            $pagination.append(this.getItemLink("...", totalPages).addClass("disabled"));
        }

        for (let page: number = this.getStartPage(); page <= this.getEndPage(); page++) {
            let $itemLink: JQuery<HTMLElement> = this.getItemLink(page.toString(), page);
            if (page === this.currentPage) {
                $itemLink.addClass("active");
            }
            $pagination.append($itemLink);
        }

        if (this.getEndPage() < totalPages) {
            $pagination.append(this.getItemLink("...", totalPages).addClass("disabled"));
            $pagination.append(this.getItemLink(totalPages.toString(), totalPages));
        }

        if (this.hasNextPage()) {
            $pagination.append(this.getItemLink("<i class=\"fa fa-angle-right\"></i>", this.currentPage + 1));
        }

        return $pagination;
    }

    private getItemLink(text: string, page: number) {
        if (page === this.currentPage) {
            return $("<li>")
                .addClass("page-item")
                .append(
                    $("<a>")
                        .addClass("page-link")
                        .html(text)
                );
        }
        let $pageLink = $("<a>")
            .addClass("page-link")
            .attr("href", "#")
            .attr("data-page", page)
            .html(text);
        $pageLink.on("click", this.onPageLinkClick.bind(this));

        return $("<li>")
            .addClass("page-item")
            .append(
                $pageLink
            );
    }

    private onPageLinkClick(evt: JQuery.ClickEvent): void {
        evt.preventDefault();
        if ($(evt.target).data("page") === undefined) {
            // This is a weird bug where the click event is triggered for the icon....
            $(evt.target).parents("a").first().trigger("click");
            return;
        }
        let pageStr = $(evt.target).data("page");
        let pageNum = parseInt(pageStr);
        if (pageNum > this.getPages() || pageNum < 1 || isNaN(pageNum)) {
            if (ENVIRONMENT === Environment.Development) {
                console.log(evt.target);
                throw new Error("Invalid page number: " + pageStr);
            }
            return;
        }

        this.currentPage = pageNum;
        if (this.paginationEvent !== null) {
            this.paginationEvent(this.currentPage);
        }
    }
}