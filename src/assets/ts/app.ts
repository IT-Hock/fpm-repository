import {API_URL, BASE_URL, ENVIRONMENT, GIT} from "./generated/constants";

import * as $ from 'jquery';
import "jqueryui";

import 'select2';
import 'sweetalert2';
import 'clipboard';
import * as chartjs from 'chart.js';
import * as momentjs from 'moment';

import 'bootstrap';
import '../sass/app.scss';

import './package_listing';
import './pages/package.page';
import {Environment} from "./environment";
import {Package} from "./package";
import {Page} from "./pages/page";
import ClipboardJS from "clipboard";

export let query: string = "";
export let allPackages: Set<Package> = new Set<Package>();
let pageInit: (() => void) | null = null;
let currentPage:Page|null = null;

export function init(): void {
    if (ENVIRONMENT === Environment.Development) {
        console.log("Loading version: " + GIT.head.short_id + " (" + GIT.last_commit.date + ")");
    }

    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    $('[data-clipboard-target]').each(function () {
        let clipboard = new ClipboardJS(this);
        clipboard.on('success', function (e) {
            $(e.trigger).attr("title", "Copied!").tooltip("show");
            e.clearSelection();
        });
    });

    $('.select2').each(function () {
        let searchVal: string = $(this).data('search');
        let placeholderVal: string = $(this).data('placeholder');
        let search: boolean = searchVal === undefined ? true : searchVal === 'true';
        $(this).select2({
            theme: "flat",
            placeholder: placeholderVal,
            minimumResultsForSearch: search ? 0 : -1
        });
    });

    $.when(
        $.getJSON(API_URL + "/packages/all.json"),
        $.getJSON(API_URL + "/themes/all.json")
    ).then((packagesJson: any[], themesJson: any[]): void => {
        // Join packages and themes
        let packages: Package[] = [];
        packagesJson[0].forEach((pkgObject: any): void => {
            packages.push(new Package(pkgObject));
        });
        themesJson[0].forEach((pkgObject: any): void => {
            let pkg: Package = new Package(pkgObject);
            pkg.setIsTheme(true);
            packages.push(pkg);
        });
        packages.forEach((pkg: Package): void => {
            allPackages.add(pkg);
        });

        // Extend autocomplete with custom renderer
        $.ui.autocomplete.prototype._renderMenu = function( ul:any, items:any ):void {
            const that = this;
            $.each( items, function( _index:number, item:any ) {
                that._renderItemData( ul, item );
            });

            if ($(ul).data("more") > 0) {
                $( ul )
                    .append(`<li class="ui-autocomplete-more" aria-label="+ ${$(ul).data("more")} more">+ ${$(ul).data("more")} more</li>`)
                    .on("click", "li.ui-autocomplete-more", function() {
                        $("ul.ui-autocomplete").show();
                    });
            }
        }

        $.ui.autocomplete.prototype._renderItem = function (ul: any, item: any): any {
            /* Display name and floating left the author */
            let $li = $("<li></li>")
            let $a = $("<a></a>")
                .text(item.label);
            if (item.isTheme) {
                $a.attr("href", BASE_URL + "/themes/" + item.slug)
            } else {
                $a.attr("href", BASE_URL + "/packages/" + item.slug)
            }
            let $div = $("<div class='row'></div>")
                .addClass("autocomplete-item")
                .append($("<div class='col-12'></div>")
                    .addClass("autocomplete-item-name")
                    .text(item.name))
                .append($("<div class='col-12'></div>").addClass("autocomplete-item-author").html(
                    `<span class="badge badge-pill drac-bg-pink drac-text-black user-select-none"><i class="fa fa-user"></i> ${item.author}</span>` +
                    `&nbsp;<span class="badge badge-pill drac-bg-blue drac-text-black user-select-none"><i class="fa fa-code-fork"></i> ${item.forks}</span>` +
                    `&nbsp;<span class="badge badge-pill drac-bg-green drac-text-black user-select-none"><i class="fa fa-star"></i> ${item.stars}</span>`
                ));
            $li
                .attr("title", item.description)
                .attr("data-value", item.slug)

            $a.append($div);
            $li.append($a);
            return $li.appendTo(ul);
        };

        if (pageInit !== null) {
            pageInit();
        }

        if (currentPage !== null) {
            currentPage.init();
        }
    });
}

export function themes(): Package[] {
    let themes: Package[] = [];
    allPackages.forEach((pkg: Package): void => {
        if (pkg.isTheme) {
            themes.push(pkg);
        }
    });
    return themes;
}

export function packages(): Package[] {
    let packages: Package[] = [];
    allPackages.forEach((pkg: Package): void => {
        if (!pkg.isTheme) {
            packages.push(pkg);
        }
    });
    return packages;
}

export function setPageInit(func: () => void): void {
    pageInit = func;
}

export function setPage(page: Page): void {
    currentPage = page;
}

export {
    $, ClipboardJS, momentjs, chartjs
};
export {PackagePage} from "./pages/package.page";
export {ThemePage} from "./pages/theme.page";
export {HomePage} from "./pages/home.page";
export {DetailsPage} from "./pages/details.page";