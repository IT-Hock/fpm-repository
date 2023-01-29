package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/go-github/v49/github"
	"golang.org/x/oauth2"
	"os"
	"strings"
)

var updateFromGithub = true

func main() {
	file, err := os.Open("packages.json")
	if err != nil {
		panic(err)
	}

	packages := make(map[string]Package)
	err = json.NewDecoder(file).Decode(&packages)
	if err != nil {
		panic(err)
	}

	token := os.Getenv("GITHUB_TOKEN")
	if token == "" {
		fmt.Println("GITHUB_TOKEN environment variable is not set")
		os.Exit(1)
	}
	fmt.Printf("Using token: ghp_%s\n", strings.Repeat("*", len(token)-10)+token[len(token)-6:])

	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: token},
	)
	tc := oauth2.NewClient(context.Background(), ts)

	githubClient := github.NewClient(tc)

	for key := range packages {
		var result bool
		var fullPackage FullPackage
		// Load fpm.json
		packageFile, err := os.Open(fmt.Sprintf("packages/%s/fpm.json", key))
		if err != nil {
			fullPackage.Package = packages[key]
			result = updatePackageInfo(githubClient, &fullPackage)

			err := os.Mkdir(fmt.Sprintf("packages/%s", key), 0755)
			if err != nil {
				continue
			}

			_, err = os.Create(fmt.Sprintf("packages/%s/fpm.json", key))
			if err != nil {
				continue
			}
		} else {
			err = json.NewDecoder(packageFile).Decode(&fullPackage)
			if err != nil {
				panic(err)
			}

			if updateFromGithub {
				result = updatePackageInfo(githubClient, &fullPackage)
			} else {
				result = true
			}
		}

		if result {
			packages[key] = fullPackage.Package
			packageFile2, err := os.Create(fmt.Sprintf("packages/%s/fpm.json", key))
			if err != nil {
				panic(err)
			}

			err = json.NewEncoder(packageFile2).Encode(fullPackage)
			if err != nil {
				panic(err)
			}
		} else {
			delete(packages, key)
		}
	}

	// Save to new file
	file2, err := os.Create("packages.json")
	if err != nil {
		panic(err)
	}

	err = json.NewEncoder(file2).Encode(packages)
	if err != nil {

	}
}
