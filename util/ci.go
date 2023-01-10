package main

import (
	"encoding/json"
	"os"
	"path"
	"strings"
)

func ContinuousIntegration(pkgDir *string, themesDir *string, outputDir *string) bool {
	println("Running CI with the following arguments:")
	println("packagesDir: " + *pkgDir)
	println("themesDir: " + *themesDir)
	println("outputDir: " + *outputDir)

	packagesDir := *pkgDir
	if _, err := os.Stat(packagesDir); err != nil {
		println("Packages directory does not exist")
		return false
	}

	themesDirectory := *themesDir
	if _, err := os.Stat(themesDirectory); err != nil {
		println("Themes directory does not exist")
		return false
	}

	packageOutDir := *outputDir
	if packageOutDir == "" {
		println("No output dir provided")
		return false
	}

	if _, err := os.Stat(packageOutDir); err != nil {
		err := os.MkdirAll(packageOutDir, 0755)
		if err != nil {
			println(err.Error())
			return false
		}
	} else {
		err := os.RemoveAll(packageOutDir)
		if err != nil {
			println(err.Error())
			return false
		}

		err = os.MkdirAll(packageOutDir, 0755)
		if err != nil {
			println(err.Error())
			return false
		}
	}

	var packages PackageMap
	packages.Packages = getPackages(packagesDir)
	packages.Themes = getPackages(themesDirectory)

	packagesJson, err := json.Marshal(packages.Packages)
	if err != nil {
		return false
	}

	err = os.WriteFile(path.Join(packageOutDir, "packages.json"), packagesJson, 0644)
	if err != nil {
		println(err.Error())
		return false
	}

	themesJson, err := json.Marshal(packages.Themes)
	if err != nil {
		return false
	}

	err = os.WriteFile(path.Join(packageOutDir, "themes.json"), themesJson, 0644)
	if err != nil {
		println(err.Error())
		return false
	}

	return true
}

func getPackages(dir string) map[string]Package {
	packages := make(map[string]Package)
	files, err := os.ReadDir(dir)
	if err != nil {
		println(err.Error())
		return packages
	}

	for _, file := range files {
		packageFile := ""
		if !file.IsDir() {
			if !strings.HasSuffix(file.Name(), ".json") {
				continue
			}

			packageFile = path.Join(dir, file.Name())
			packageDir := packageFile[:len(packageFile)-len(".json")]
			err := os.MkdirAll(packageDir, 0755)
			if err != nil {
				continue
			}

			err = os.Rename(packageFile, path.Join(packageDir, "package.json"))
			if err != nil {
				continue
			}
		}
		packageDir := path.Join(dir, file.Name())
		packageFile = path.Join(packageDir, "fish.package.json")

		if _, err := os.Stat(packageFile); err == nil {
			packageJson, err := os.ReadFile(packageFile)
			if err != nil {
				println(err.Error())
				continue
			}

			var pkg Package
			err = json.Unmarshal(packageJson, &pkg)
			if err != nil {
				println(err.Error())
				continue
			}

			packages[pkg.Name] = pkg

		}
	}

	return packages
}
