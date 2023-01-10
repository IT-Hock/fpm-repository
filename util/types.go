package main

type Package struct {
	Name          string `json:"name"`
	Description   string `json:"description"`
	Image         string `json:"image"`
	LatestVersion struct {
		Version     string `json:"version"`
		Description string `json:"description"`
		CommitHash  string `json:"commit_hash"`
		ReleaseDate int    `json:"release_date"`
	} `json:"latest_version"`
	Versions        interface{}   `json:"versions"`
	Tags            []interface{} `json:"tags"`
	Author          string        `json:"author"`
	Repository      string        `json:"repository"`
	License         string        `json:"license"`
	Dependencies    []interface{} `json:"dependencies"`
	Stars           int           `json:"stars"`
	Forks           int           `json:"forks"`
	Watchers        int           `json:"watchers"`
	Issues          int           `json:"issues"`
	Updated         int           `json:"updated"`
	FullDescription string        `json:"full_description"`
}

type PackageMap struct {
	Packages map[string]Package `json:"packages"`
	Themes   map[string]Package `json:"themes"`
}
