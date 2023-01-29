import * as $ from "jquery";
import {BASE_URL} from "./generated/constants";

export class Package {
    private readonly _name: string;
    private readonly _description: string | null;
    private readonly _image: string | null;
    private readonly _version: string | null;
    private readonly _tags: string[];
    private readonly _author: string;
    private readonly _repository: string;
    private readonly _license: string;
    private readonly _dependencies: string[];
    private readonly _stars: number;
    private readonly _forks: number;
    private readonly _watchers: number;
    private readonly _issues: number;
    private readonly _updated: string;
    private readonly _release: string;
    private readonly _repository_name: string;
    private _isTheme: boolean = false;

    constructor(jsonData: any) {
        this._name = jsonData.name;
        this._repository_name = jsonData.repository_name;
        this._description = jsonData.description;
        this._image = jsonData.image;
        this._version = jsonData.version;
        this._tags = jsonData.tags;
        this._author = jsonData.author;
        this._repository = jsonData.repository;
        this._license = jsonData.license;
        this._dependencies = jsonData.dependencies;
        this._stars = jsonData.stars;
        this._forks = jsonData.forks;
        this._watchers = jsonData.watchers;
        this._issues = jsonData.issues;
        this._updated = jsonData.updated;
        this._release = jsonData.release;
    }

    public setIsTheme(value: boolean) {
        this._isTheme = value;
    }

    public getContainer(): JQuery {
        let cardImage = $(`<a href="${this.link}" class="drac-bg-grey card-img card-img-top user-select-none" style="height: 200px;"></a>`);

        if (this.image != null) {
            cardImage.append(`<img src="${this.image}" class="card-img card-img-top user-select-none" loading="lazy" style="object-fit: cover; height: 200px;" alt="${this.name}">`);
        } else {
            cardImage.append(this.getNoImage());
        }

        let pills = $(`<div class="text-center mb-3"></div>`);

        let authorPill = $(`<div class="mb-1"><a href="${BASE_URL}/author/${this.author}" class="badge badge-pill drac-bg-pink drac-text-black user-select-none"><i class="fa fa-user"></i> ${this.author}</a></div>`);
        pills.append(authorPill);

        let updatedDatePill = $(`
          <div class="mb-1">
            <span class="badge badge-pill drac-bg-grey drac-text-white user-select-none"><i class="fa fa-calendar"></i> ${this.updated}</span>
          </div>`);
        pills.append(updatedDatePill);

        let miscPills = $(`<div class="mb-1"></div>`);

        if (this.stars > 0) {
            let starsPill = $(`<span class="badge badge-pill drac-bg-green drac-text-black user-select-none ml-1"><i class="fa fa-star"></i> ${this.stars}</span>`);
            miscPills.append(starsPill);
        }

        if (this.forks > 0) {
            let forksPill = $(`<span class="badge badge-pill drac-bg-green drac-text-black user-select-none ml-1"><i class="fa fa-code-fork"></i> ${this.forks}</span>`);
            miscPills.append(forksPill);
        }

        if (this.version != null) {
            let versionPill = $(`<span class="badge badge-pill drac-bg-green drac-text-black user-select-none ml-1"><i class="fa fa-tag"></i> ${this.version}</span>`);
            miscPills.append(versionPill);
        }

        if (miscPills.children().length == 0) {
            miscPills.append(`&nbsp;`);
        }

        pills.append(miscPills);

        let descriptionContainer = $(`<div class="card-text drac-text-white">${this.description}</div>`);

        let card = $(`<div class="card drac-box drac-card drac-bg-purple drac-glow-none w-100"></div>`);
        let cardBody = $(`<div class="card-body"></div>`);
        let cardTitle = $(`<div class="card-title" title="${this.name}" style="white-space: nowrap;overflow:hidden;">
<h5 class="text-center"><a href="${this.link}" class="drac-text-white drac-text-hover-purple">${this.name}</a></h5>
</div>`);

        cardBody.append(cardTitle);
        cardBody.append(pills);
        cardBody.append(descriptionContainer);
        card.append(cardImage);
        card.append(cardBody);

        return card;
    }

    private getNoImage(): string {
        return `<svg class="card-img card-img-top user-select-none" style="object-fit: cover; height: 200px;">
    <g>
      <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" fill="var(--greySecondary)"
            font-size="1.5rem" font-style="italic">
        ${this.name}
      </text>
      <text x="50%" y="65%" text-anchor="middle" alignment-baseline="middle" fill="var(--greySecondary)"
            font-style="italic">
        has no image
      </text>
    </g>
  </svg>`;
    }

    get name(): string {
        return this._name
            .toLowerCase()
            .replace(/(plugin-|-plugin|-theme|theme-|\.fish|omf_)/, "");
    }

    get slug(): string {
        return this._repository_name
            .replace("/", "-")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "");
    }

    get link(): string {
        if (this._isTheme) {
            return `${BASE_URL}/themes/${this.slug}`;
        }

        return `${BASE_URL}/packages/${this.slug}`;
    }

    get description(): string {
        return this._description === null || this._description == "" ? "No description provided." : this._description;
    }

    get image(): string | null {
        return this._image == "" ? null : this._image;
    }

    get version(): string | null {
        return this._version == "" ? null : this._version;
    }

    get tags(): string[] {
        return this._tags;
    }

    get author(): string {
        return this._author;
    }

    get repository(): string {
        return this._repository;
    }

    get license(): string {
        return this._license;
    }

    get dependencies(): string[] {
        return this._dependencies;
    }

    get stars(): number {
        return this._stars;
    }

    get forks(): number {
        return this._forks;
    }

    get watchers(): number {
        return this._watchers;
    }

    get issues(): number {
        return this._issues;
    }

    get updated(): string {
        return this._updated;
    }

    get release(): string {
        return this._release;
    }

    get isTheme(): boolean {
        return this._isTheme;
    }
}
