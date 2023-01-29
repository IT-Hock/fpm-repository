require 'json'

module Jekyll
  class JSONPages < Generator
    safe true
    priority :highest

    def generate(site)
      generate_package_sites(site, "packages", "packages.json")
      generate_package_sites(site, "themes", "themes.json")
    end

    private

    def generate_package_sites(site, out_path, file)
      json_file = File.join(site.source, '_data', file)

      if File.exist?(json_file)
        json = JSON.parse(File.read(json_file))

        json.each do |package_name, package|
          site.pages << JSONPage.new(site, out_path, site.source, package_name, package)
        end
      end
    end
  end

  class JSONPage < Page
    def initialize(site, out_path, base, package_name, package)
      @site = site
      @base = base
      @name = package_name + '.html'
      #@dir = url
      @dir = out_path

      # Read Full package from _data/packages/package_name/fpm.json
      full_package_path = File.join(base, '_data', "_packages", package_name, 'fpm.json')
      if File.exist?(full_package_path)
        full_package = JSON.parse(File.read(full_package_path))
        package.merge!(full_package)
      end

      self.process(@name)
      self.read_yaml(base, '_package_details.html.liquid')
      package['name'] = package_name
      self.data['package'] = package
      self.data['title'] = package_name
    end

    def html?
      true
    end
  end
end