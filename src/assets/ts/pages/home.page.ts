import * as $ from 'jquery';

import {Page} from "./page";
import {Package} from "../package";
import {allPackages} from "../app";
import {getFilteredPackages} from "../utils/search";

export class HomePage extends Page {
    override init(): void {
        let autocompleteData: string[] = [];

        allPackages.forEach((pkg: Package): void => {
            autocompleteData.push(pkg.name);
        });

        $('#searchInput').autocomplete({
            source: function (request: any, response: any): void {
                new Promise<Package[]>((resolve: any, reject: any): void => {
                    let filteredPackages: Package[] | null = getFilteredPackages(Array.from(allPackages), request.term);
                    if (filteredPackages == null) {
                        reject();
                    }

                    resolve(filteredPackages);
                }).then((filteredPackages: Package[]): void => {
                    let items = filteredPackages.map((pkg: Package): any => {
                        return {
                            name: pkg.name,
                            slug: pkg.slug,
                            description: pkg.description,
                            isTheme: pkg.isTheme,
                            stars: pkg.stars,
                            forks: pkg.forks,
                            updated: pkg.updated,
                            author: pkg.author,
                        };
                    });
                    if(items.length > 10) {
                        $('#ui-id-1').attr('data-more', items.length - 10);
                    }else{
                        $('#ui-id-1').attr('data-more', 0);
                    }
                    response(items.slice(0, 10));
                    $('[data-toggle="tooltip"]').tooltip();
                });
            },
            select: function( _event, _ui ) {
                return false;
            },
        });
    }
}