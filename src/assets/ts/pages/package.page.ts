import {Page} from "./page";
import {PackageListingPage} from "../package_listings";

declare var app: any;

export class PackagePage extends Page {
    // @ts-ignore
    private packageListingPage: PackageListingPage;

    constructor() {
        super();
    }

    override init(): void {
        this.packageListingPage = new PackageListingPage(app.packages());
    }
}