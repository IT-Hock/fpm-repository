import * as $ from "jquery";
import {ENVIRONMENT} from "./generated/constants";
import {Environment} from "./environment";

export default class Pagination {
    private currentPage: number = 1;
    private totalPages: number = 1;
    private paginationEvent: (page: number) => void;

    constructor(currentPage: number, totalPages: number, paginationEvent: (page: number) => void) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.paginationEvent = paginationEvent;
    }

    public setPaginationEvent(callback: (page: number) => void): void {
        this.paginationEvent = callback;
    }

    public setTotalPages(totalPages: number): void {
        this.currentPage = 1;
        this.totalPages = totalPages;
        this.paginationEvent(this.currentPage);
    }

    public getTotalPages(): number {
        return this.totalPages;
    }

    public setCurrentPage(currentPage: number): void {
        this.currentPage = currentPage;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public getPreviousPage(): number {
        return this.currentPage - 1;
    }

    public getNextPage(): number {
        return this.currentPage + 1;
    }

    public hasPreviousPage(): boolean {
        return this.currentPage > 1;
    }

    public hasNextPage(): boolean {
        return this.currentPage < this.totalPages;
    }

    public getStartPage(): number {
        return Math.max(1, this.currentPage - 2);
    }

    public getEndPage(): number {
        return Math.min(this.totalPages, this.currentPage + 2);
    }

    public getPageArray(): number[] {
        let pages = [];
        for (let i = this.getStartPage(); i <= this.getEndPage(); i++) {
            pages.push(i);
        }
        return pages;
    }

    public getPreviousPagesArray(): number[] {
        let pages = [];
        for (let i = this.getStartPage() - 1; i >= 1; i--) {
            pages.push(i);
        }
        return pages;
    }

    public getNextPagesArray(): number[] {
        let pages = [];
        for (let i = this.getEndPage() + 1; i <= this.totalPages; i++) {
            pages.push(i);
        }
        return pages;
    }

    getContainer(): JQuery {
        let $pagination = $("<ul>").addClass("pagination");
        if (this.hasPreviousPage()) {
            $pagination.append(this.getItemLink("<i class=\"fa fa-angle-left\"></i>", this.getPreviousPage()));
        }
        if (this.getStartPage() > 1) {
            $pagination.append(this.getItemLink("1", 1));
            $pagination.append(this.getItemLink("...", this.totalPages).addClass("disabled"));
        }

        for (let page of this.getPageArray()) {
            let $itemLink = this.getItemLink(page.toString(), page);
            if (page === this.currentPage) {
                $itemLink.addClass("active");
            }
            $pagination.append($itemLink);
        }

        if (this.getEndPage() < this.totalPages) {
            $pagination.append(this.getItemLink("...", this.totalPages).addClass("disabled"));
            $pagination.append(this.getItemLink(this.totalPages.toString(), this.totalPages));
        }

        if (this.hasNextPage()) {
            $pagination.append(this.getItemLink("<i class=\"fa fa-angle-right\"></i>", this.getNextPage()));
        }

        $pagination.find("a").on("click", (event) => {
            event.preventDefault();
            if($(event.target).data("page") === undefined) {
                // This is a weird bug where the click event is triggered for the icon....
                $(event.target).parents("a").first().trigger("click");
                return;
            }
            let pageStr = $(event.target).data("page");
            let pageNum = parseInt(pageStr);
            if (pageNum > this.totalPages || pageNum < 1 || isNaN(pageNum)) {
                if(ENVIRONMENT === Environment.Development){
                    console.log(event.target);
                    throw new Error("Invalid page number: " + pageStr);
                }
                return;
            }

            this.currentPage = pageNum;
            this.paginationEvent(this.currentPage);
        });

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
        return $("<li>")
            .addClass("page-item")
            .append(
                $("<a>")
                    .addClass("page-link")
                    .attr("href", "#")
                    .attr("data-page", page)
                    .html(text)
            );
    }
}