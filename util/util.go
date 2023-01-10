package main

import (
	"flag"
	"net/http"
	"os"
)

func main() {

	packagesDir := flag.String("p", "../packages", "packages directory")
	themesDir := flag.String("t", "../themes", "themes directory")
	outputDir := flag.String("o", "./_data", "output dir")

	flag.Parse()

	if flag.NArg() == 0 {
		println("No arguments provided")
		return
	}

	switch flag.Arg(0) {
	case "ci":
		if *packagesDir == "" {
			println("No packages directory provided")
			return
		}

		if *themesDir == "" {
			println("No themes directory provided")
			return
		}

		if *outputDir == "" {
			println("No output dir provided")
			return
		}

		if ContinuousIntegration(packagesDir, themesDir, outputDir) {
			return
		}
	case "packages":
		packageFile := "packages.json"
		packageDownloadUrl := "https://raw.githubusercontent.com/IT-Hock/fpm-repository/main/packages.json"
		if flag.NArg() > 1 {
			packageFile = flag.Arg(1)
		}
		if flag.NArg() > 2 {
			packageDownloadUrl = flag.Arg(2)
		}

		if _, err := os.Stat(packageFile); err != nil {
			// Download packages.json
			println("Downloading packages.json")
			response, err := http.DefaultClient.Get(packageDownloadUrl)
			if err != nil {
				println(err.Error())
				return
			}

			file, err := os.Create(packageFile)
			if err != nil {
				println(err.Error())
				return
			}

			_, err = file.ReadFrom(response.Body)
			if err != nil {
				println(err.Error())
				return
			}

			err = file.Close()
			if err != nil {
				println(err.Error())
				return
			}

			err = response.Body.Close()
			if err != nil {
				println(err.Error())
				return
			}
		}

		writePackages(packageFile)
	}
}
