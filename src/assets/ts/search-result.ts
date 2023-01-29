declare var BASE_URL: string;

export function getSearchResultHtml(pkg: any): string {
    let normalizedPkgName = pkg.name
        .toLowerCase()
        .replace(/(plugin-|-plugin|-theme|theme-)/, "");
    let slug = normalizedPkgName
        .replace("/", "-")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");

    let pkgLink = `${BASE_URL}/packages/${slug}`;

    let image = `<svg class="card-img card-img-top user-select-none" style="object-fit: cover; height: 200px;">
    <g>
      <text x="50%" y="50%" text-anchor="middle" alignment-baseline="middle" fill="var(--greySecondary)"
            font-size="1.5rem" font-style="italic">
        ${normalizedPkgName}
      </text>
      <text x="50%" y="65%" text-anchor="middle" alignment-baseline="middle" fill="var(--greySecondary)"
            font-style="italic">
        has no image
      </text>
    </g>
  </svg>`;
    if (pkg.image) {
        image = `<img class="drac-bg-grey card-img card-img-top user-select-none" style="object-fit: cover;height: 200px;" src="${pkg.image}" alt="${pkg.name}">`;
    }

    let versionBadge = '';
    if (pkg.version) {
        versionBadge = `<span class="badge badge-pill badge-secondary user-select-none"><i class="fa fa-tag"></i> ${pkg.version}</span>`;
    }

    let starsBadge = '';
    if (pkg.stars) {
        starsBadge = `<span class="badge badge-pill badge-secondary user-select-none"><i class="fa fa-star"></i> ${pkg.stars}</span>`;
    }

    let description = 'No description';
    if (pkg.description) {
        description = pkg.description;
        if (description.length > 100) {
            description = description.substring(0, 100) + '...';
        }
    }

    let updatedBadge = '';
    if (pkg.updated) {
        let date = new Date(pkg.updated);
        updatedBadge = `
<span class="badge badge-pill drac-bg-grey user-select-none">
  <i class="fa fa-calendar"></i> ${date.toLocaleDateString()}
</span>
`;
    }
    return `<div class="drac-box drac-card drac-bg-purple drac-glow-none mt-5" style="height: 500px;">
<div style="min-height: 200px; background:var(--grey);">
  <a href="${pkgLink}">
    ${image}
  </a>
  </div>
  <div class="card-body p-0">
    <h5 class="card-title text-center" style="padding: 0 1.25rem 0 1.25em;">
      <a href="${pkgLink}" class="badge drac-bg-black-secondary drac-text-cyan user-select-none">${normalizedPkgName}</a>
    </h5>
    <p style="padding: 0 1.25rem 0 1.25em;">
        <a href="${BASE_URL}/users/${pkg.author}">
          <span class="badge badge-pill drac-text-grey drac-bg-pink user-select-none">
          <i class="fa fa-user"></i> ${pkg.author}
          </span>
        </a>
    </p>
    <p style="padding: 0 1.25rem 0 1.25em;">
            ${updatedBadge}
            ${versionBadge}
            ${starsBadge}
    </p>
    
    <div class="w-100 bg-info text-black-50" style="padding: 1.25rem;">
        ${description}
    </div>
  </div>
</div>
`;
}