package main

import (
	"encoding/json"
	"os"
	"path"
)

func writePackages(packageFile string) {
	if _, err := os.Stat(packageFile); err != nil {
		println("Package File was not found: " + err.Error())
		return
	}

	file, err := os.ReadFile(packageFile)
	if err != nil {
		println(err.Error())
		return
	}

	var packages PackageMap
	err = json.Unmarshal(file, &packages)
	if err != nil {
		println(err.Error())
		return
	}

	packageOutDir := "packages"
	if _, err := os.Stat(packageOutDir); err != nil {
		err := os.MkdirAll(packageOutDir, 0755)
		if err != nil {
			println(err.Error())
			return
		}
	} else {
		err := os.RemoveAll(packageOutDir)
		if err != nil {
			println(err.Error())
			return
		}

		err = os.MkdirAll(packageOutDir, 0755)
		if err != nil {
			println(err.Error())
			return
		}
	}

	for _, pkg := range packages.Packages {
		println("Writing package: " + pkg.Name)

		pkgOut, err := json.Marshal(pkg)
		if err != nil {
			println(err.Error())
			continue
		}
		err = os.WriteFile(path.Join(packageOutDir, pkg.Name+".json"), pkgOut, 0644)
		if err != nil {
			println(err.Error())
			continue
		}
	}

	themeOutDir := "themes"
	if _, err := os.Stat(themeOutDir); err != nil {
		err := os.MkdirAll(themeOutDir, 0755)
		if err != nil {
			println(err.Error())
			return
		}
	} else {
		err := os.RemoveAll(themeOutDir)
		if err != nil {
			println(err.Error())
			return
		}
		err = os.MkdirAll(themeOutDir, 0755)
		if err != nil {
			println(err.Error())
			return
		}
	}
	for _, pkg := range packages.Themes {
		println("Writing theme: " + pkg.Name)

		theme, err := json.Marshal(pkg)
		if err != nil {
			println(err.Error())
			continue
		}

		err = os.WriteFile(path.Join(themeOutDir, pkg.Name+".json"), theme, 0644)
		if err != nil {
			println(err.Error())
			continue
		}
	}
}
