import {PackageListing, SortType} from "./package_listing";
import {Package} from "./package";
import {SortDirection} from "./objects/sorting";
import * as $ from "jquery";
import {BASE_URL, ENVIRONMENT} from "./generated/constants";
import {Environment} from "./environment";

export class PackageListingPage extends PackageListing {
    constructor(packages: Package[]) {
        super([], 8, SortType.Name, SortDirection.Ascending);

        this.setPaginationEvent(this.onPaginate.bind(this));

        if (!this.isLoading()) {
            this.showLoading();
        }
        this.onLoadingPackagesSuccess(packages);
    }

    private onLengthChange(evt: Event): void {
        evt.preventDefault();
        if (evt.currentTarget === null) {
            return;
        }

        this.showLoading();

        let val = $(evt.currentTarget).val() as number;
        this.setItemsPerPage(val);
        this.renderPagination();
        this.renderPage();
    }

    private onSortChange(evt: Event): void {
        evt.preventDefault();
        if (evt.currentTarget === null) {
            return;
        }
        this.showLoading();

        let sortType: string = $(evt.currentTarget).val() as string;
        let sortValue: number = parseInt(sortType) as SortType;

        this.sort(sortValue).then((): void => {
            this.renderPage();
            this.renderPagination();
        });
    }

    private onSortDirectionChange(direction: SortDirection): void {
        this.showLoading();

        if (direction === SortDirection.Ascending) {
            $('#sort-asc').show();
            $('#sort-desc').hide();
        } else {
            $('#sort-asc').hide();
            $('#sort-desc').show();
        }

        this.sort(null, direction).then((packages: Package[]) => {
            this.setPaginationItems(packages);
            this.renderPagination();
            this.renderPage();
        });
    }

    private onFilterChange(evt: Event): void {
        evt.preventDefault();
        if (evt.currentTarget === null) {
            this.hideLoading();
            return;
        }
        this.showLoading();

        let $searchInput: any = $(evt.currentTarget).find('input');
        if ($searchInput === undefined || $searchInput === null || $searchInput.val() === undefined) {
            $searchInput = $(evt.currentTarget);
        }

        if ($searchInput === undefined || $searchInput === null || $searchInput.val() === undefined) {
            this.hideLoading();
            return;
        }

        let val: string = $searchInput.val() as string;
        if(val === undefined || val === null) {
            this.hideLoading();
            return;
        }

        if (this.currentFilter !== "" && val === this.currentFilter) {
            this.hideLoading();
            return;
        }

        this.filter(val).then((packages: Package[]): void => {
            if (packages.length === 0) {
                if (this.hasError()) {
                    this.hideError();
                }
                this.showError(`No packages matched your filter.<br/>Please try again with a different filter.`);
                return;
            }
            if ($('#sort-by').attr('disabled')) {
                this.hideError();
            }

            this.setPaginationItems(packages);
            this.renderPagination();
            this.renderPage();
        }).catch((err): void => {
            console.warn(err);
            this.showError(`The entered filter is invalid.<br/>Please refer to the <a href="${BASE_URL}/docs/filtering" class="text-black-50">documentation</a> for more information.`)
        });
    }

    private showError(message: string = "An error occurred while loading packages"): void {
        let $searchInput: JQuery<HTMLElement> = $('#search-input');
        let $messageContainer: JQuery<HTMLElement> = $('#message-container');

        if (ENVIRONMENT === Environment.Development) {
            console.warn(message);
        }

        $('#listing').hide();
        $('#loading-spinner').hide();

        $searchInput.removeAttr('disabled');
        let $messageElem: JQuery<HTMLElement> = $(`<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Error</h4>${message}</div>`);

        $messageContainer.find('#message').append($messageElem);
        $messageContainer.show();
    }

    private hideError(): void {
        let $messageContainer: JQuery<HTMLElement> = $('#message-container');
        $messageContainer.hide();
        $messageContainer.find('#message').empty();
    }

    private hasError() {
        return $('#message-container').is(':visible');
    }

    private onLoadingPackagesSuccess(packages: Package[]): void {
        this.setItems(packages).then((p: Package[]): void => {
            this.setPaginationItems(p);

            this.renderPage();
            this.renderPagination();

            $('#page-length').on('change', this.onLengthChange.bind(this));
            $('#sort-by').on('change', this.onSortChange.bind(this));
            $('#search-form').on('submit', this.onFilterChange.bind(this));

            $('#sort-asc').on('click', (): void => {
                this.onSortDirectionChange(SortDirection.Descending);
            });

            $('#sort-desc').on('click', (): void => {
                this.onSortDirectionChange(SortDirection.Ascending);
            });

            this.hideLoading();
        });
    }

    private renderPagination(): void {
        let $pagination: JQuery<HTMLElement> = $(".pagination");
        $pagination.empty();
        $pagination.append(this.getPaginationContainer());

        $('.page-start').text(this.getCurrentPage() * this.getItemsPerPage() - this.getItemsPerPage() + 1);
        if (this.getCurrentPage() * this.getItemsPerPage() > this.getItemCountOnCurrentPage()) {
            $('.page-end').text(this.getItemCountOnCurrentPage());
        } else {
            $('.page-end').text(this.getCurrentPage() * this.getItemsPerPage());
        }
        $('.total').text(this.paginationItems.length);
    }

    private renderPage(): void {
        if (this.hasError()) {
            this.hideError();
        }

        $("#listings").empty();
        let itemsOnPage: Package[] | null = this.getItemsOnCurrentPage();
        if (itemsOnPage === null) {
            if (ENVIRONMENT === Environment.Development) {
                console.warn("No items on page");
            }
            this.showError();
            return;
        }

        itemsOnPage.forEach((item: Package): void => {
            let $element: JQuery<HTMLElement> = $(`<div class="col-6 col-md-4 col-lg-4 col-xl-3 mb-3 d-flex align-items-stretch"></div>`);
            item.getContainer().appendTo($element);
            $("#listings").append($element);
        });

        if (this.isLoading()) {
            this.hideLoading();
        }
    }

    private showLoading(): void {
        $('#loading-spinner').show();
        $('#listing').hide();
        $('#search-input').attr('disabled', 'disabled');
    }

    private isLoading(): boolean {
        return $('#loading-spinner').is(':visible');
    }

    private hideLoading(): void {
        if (!this.isLoading()) {
            return;
        }

        $('#loading-spinner').hide();

        if (!this.hasError()) {
            $('#listing').show();
        }
        $('#search-input').removeAttr('disabled');
    }

    public onPaginate(): void {
        this.renderPagination();
        this.renderPage();
    }
}
