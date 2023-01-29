package main

import (
	"context"
	"fmt"
	"github.com/google/go-github/v49/github"
	"regexp"
	"strings"
)

type PackageRelease struct {
	Version     string `json:"version"`
	Description string `json:"description"`
	CommitHash  string `json:"commit_hash"`
	ReleaseDate int64  `json:"release_date"`
}

type Dependency struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

type Activity struct {
	Date  int64 `json:"date"`
	Count int   `json:"count"`
}

type User struct {
	Avatar string `json:"avatar"`
	Name   string `json:"name"`
}

type FullPackage struct {
	Package
	LatestVersion *PackageRelease   `json:"latest_version"`
	Versions      []*PackageRelease `json:"versions"`
	License       string            `json:"license"`
	Dependencies  []*Dependency     `json:"dependencies"`
	Readme        string            `json:"readme"`
	Activity      []*Activity       `json:"activity"`
	Contributors  []*User           `json:"contributors"`
}

type Package struct {
	Name        string   `json:"name"`
	Repository  string   `json:"repository"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
	Author      string   `json:"author"`
	Image       string   `json:"image"`
	Stars       int      `json:"stars"`
	Forks       int      `json:"forks"`
	Issues      int      `json:"issues"`
	Updated     int64    `json:"updated"`
}

type PackageMap struct {
	Packages map[string]FullPackage `json:"packages"`
	Themes   map[string]FullPackage `json:"themes"`
}

func updatePackageInfo(client *github.Client, pkg *FullPackage) bool {
	if strings.Contains(pkg.Repository, "github.com") {
		results := regexp.MustCompile(`github.com/([^/]+)/([^/]+)`).FindStringSubmatch(pkg.Repository)
		owner := results[1]
		repo := results[2]

		repository, _, err := client.Repositories.Get(context.Background(), owner, repo)
		if err != nil {
			return false
		}

		// Get readme
		readme, _, err := client.Repositories.GetReadme(context.Background(), owner, repo, nil)
		if err != nil {
			readme = nil
		}

		// Get latest release
		release, _, err := client.Repositories.GetLatestRelease(context.Background(), owner, repo)
		if err != nil {
			release = nil
		}

		releases, _, err := client.Repositories.ListReleases(context.Background(), owner, repo, nil)
		if err != nil {
			releases = nil
		}

		// 3 months activity chart
		activity, _, err := client.Repositories.ListCommitActivity(context.Background(), owner, repo)
		if err != nil {
			fmt.Println(err)
			activity = nil
		}

		// Get contributors
		contributors, _, err := client.Repositories.ListContributors(context.Background(), owner, repo, nil)
		if err != nil {
			contributors = nil
		}

		updatePackage(pkg, repository, readme, release, releases, activity, contributors)

		return true
	}

	return false
}

func updatePackage(
	pkg *FullPackage,
	repository *github.Repository,
	readme *github.RepositoryContent,
	release *github.RepositoryRelease,
	releases []*github.RepositoryRelease,
	activity []*github.WeeklyCommitActivity,
	contributors []*github.Contributor,
) {
	pkg.Name = strings.ReplaceAll(
		strings.ReplaceAll(
			strings.ReplaceAll(
				strings.ReplaceAll(
					strings.ReplaceAll(
						strings.ReplaceAll(
							strings.ReplaceAll(
								*repository.Name,
								"plugin-", "",
							),
							"fish-", ""),
						"-plugin", ""),
					"-fish", ""),
				".git", ""),
			"omf-", ""),
		"-omf", "",
	)
	pkg.Stars = *repository.StargazersCount
	pkg.Forks = *repository.ForksCount
	pkg.Issues = *repository.OpenIssuesCount
	pkg.Updated = repository.UpdatedAt.Unix()
	pkg.Author = *repository.Owner.Login

	pkg.Contributors = make([]*User, 0)
	for _, contributor := range contributors {
		pkg.Contributors = append(pkg.Contributors, &User{
			Avatar: *contributor.AvatarURL,
			Name:   *contributor.Login,
		})
	}

	// Update latest version info
	if release != nil {
		pkg.LatestVersion = &PackageRelease{}
		pkg.LatestVersion.Version = *release.TagName
		pkg.LatestVersion.Description = *release.Name
		pkg.LatestVersion.CommitHash = *release.TargetCommitish
		pkg.LatestVersion.ReleaseDate = release.PublishedAt.Unix()
	} else {
		pkg.LatestVersion = nil
	}

	if releases != nil {
		pkg.Versions = make([]*PackageRelease, 0)
		for _, release := range releases {
			pkg.Versions = append(pkg.Versions, &PackageRelease{
				Version:     *release.TagName,
				Description: *release.Name,
				CommitHash:  *release.TargetCommitish,
				ReleaseDate: release.PublishedAt.Unix(),
			})
		}
	}

	pkg.Tags = repository.Topics

	if readme != nil {
		// Update full description
		content, err := readme.GetContent()
		if err == nil {
			pkg.Readme = content
		}
	}

	if activity != nil {
		pkg.Activity = make([]*Activity, 0)
		for _, week := range activity {
			pkg.Activity = append(pkg.Activity, &Activity{
				Date:  week.Week.Unix(),
				Count: *week.Total,
			})
		}
	}
}
