import {Page} from "./page";
import {PackageListingPage} from "../package_listings";

declare var app: any;

export class ThemePage extends Page {
    // @ts-ignore
    private packageListingPage: PackageListingPage;

    constructor() {
        super();
    }

    override init(): void {
        this.packageListingPage = new PackageListingPage(app.themes());
    }
}