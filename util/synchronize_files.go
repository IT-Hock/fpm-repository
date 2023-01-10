package main

import (
	"encoding/json"
	"flag"
	"os"
	"path"
)

/*
func main() {
	flag.Parse()
	if flag.NArg() == 0 {
		println("No arguments")
		return
	}

	createPackageMap()
}
*/

func createPackageMap() {
	repositoryDir := flag.Arg(0)
	packageDir := path.Join(repositoryDir, "packages")
	themeDir := path.Join(repositoryDir, "themes")

	dir, err := os.ReadDir(packageDir)
	if err != nil {
		return
	}

	packageMap := PackageMap{
		Packages: make(map[string]Package),
		Themes:   make(map[string]Package),
	}
	for _, file := range dir {
		if !file.IsDir() {
			continue
		}

		file, err := os.ReadFile(path.Join(packageDir, file.Name(), "fpm.json"))
		if err != nil {
			println(err.Error())
			continue
		}

		var pkg Package
		err = json.Unmarshal(file, &pkg)
		if err != nil {
			println(err.Error())
			continue
		}

		packageMap.Packages[pkg.Name] = pkg
	}

	dir, err = os.ReadDir(themeDir)
	if err != nil {
		return
	}

	for _, file := range dir {
		if !file.IsDir() {
			continue
		}

		file, err := os.ReadFile(path.Join(themeDir, file.Name(), "fpm.json"))
		if err != nil {
			println(err.Error())
			continue
		}

		var pkg Package
		err = json.Unmarshal(file, &pkg)
		if err != nil {
			println(err.Error())
			continue
		}

		packageMap.Themes[pkg.Name] = pkg
	}

	file, err := json.Marshal(packageMap)
	if err != nil {
		println(err.Error())
		return
	}

	workPath, err := os.Getwd()
	if err != nil {
		println(err.Error())
		return
	}

	err = os.WriteFile(path.Join(workPath, "packages.json"), file, 0644)
	if err != nil {
		println(err.Error())
		return
	}

	println("Done")
}
