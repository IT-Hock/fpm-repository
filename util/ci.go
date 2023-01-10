package main

import (
	"encoding/json"
	"os"
	"path"
)

func ContinuousIntegration(inputFile *string, outputDir *string) bool {
	println("Running CI")
	packageFile := *inputFile
	if packageFile == "" {
		println("No package file provided")
		return false
	}

	if _, err := os.Stat(packageFile); err != nil {
		println("Package File was not found: " + err.Error())
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

	file, err := os.ReadFile(packageFile)
	if err != nil {
		println(err.Error())
		return false
	}

	var packages PackageMap
	err = json.Unmarshal(file, &packages)
	if err != nil {
		println(err.Error())
		return false
	}

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
