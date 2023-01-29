require 'net/http'

module Jekyll
end

=begin
"name": "plugin-python",
"description": "Set of shortcuts to Python based utilities (pybeatifyjson  clean JSON files, pyclean  remove old .pyc, pyhttp & pysmtp  simple HTTP & SMTP servers)",
"image": "",
"version": "",
"tags": [],
"author": "oh-my-fish",
"repository": "https://github.com/oh-my-fish/plugin-python",
"license": "MIT License",
"dependencies": [],
"stars": 9,
"forks": 5,
"watchers": 6,
"issues": 2,
"updated": "2018-12-18",
"release": ""
=end

def most_forked(input)
    sorted = input.select { |entry| entry['forks'] != nil and entry['forks'] > 0 }
    sorted = sorted.sort_by { |entry| entry['forks'] }
    sorted.reverse!
end

def most_starred(input)
    sorted = input.select { |entry| entry['stars'] != nil and entry['stars'] > 0 }
    sorted = sorted.sort_by { |entry| entry['stars'] }
    sorted.reverse!
    sorted
end

def recent_update(input)
    sorted = input.select { |entry| entry['updated'] != nil and entry['updated'] != '' }
    sorted = sorted.sort_by { |entry| entry['updated'] }
    sorted.reverse!
    sorted
end

def authors(input)
    input.map { |_, entry|
        entry['author'].downcase.gsub(' ', '')
    }.uniq
end

def packages_by_author(packages, themes, site)
    FileUtils.mkdir_p(site.dest + '/api/packages/authors')
    FileUtils.mkdir_p(site.dest + '/api/themes/authors')

    authors(packages).each do |author|
        File.open(site.dest + "/api/packages/authors/" + author + ".json", 'w') do |file|
            file.write(packages.select { |_, entry| entry['author'] == author }.to_json)
        end
    end

    authors(themes).each do |author|
        File.open(site.dest + "/api/themes/authors/" + author + ".json", 'w') do |file|
            file.write(themes.select { |_, entry| entry['author'] == author }.to_json)
        end
    end
end

def packages(data, site, folder)
    FileUtils.mkdir_p(site.dest + '/api/' + folder)

    # Verify all images return 200, if not remove the image
    verified = []
    data.each { |entry|
        entry[1]['repository_name'] = entry[0]
        if entry[1]['image'] != nil and entry[1]['image'] != ''
            begin
                # do a HEAD request to the image, timeout 1 second
                # only in release
                if ENV['JEKYLL_ENV'] == 'production'
                    uri = URI(entry[1]['image'])
                    response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https', read_timeout: 1) do |http|
                        http.head(uri.request_uri)
                    end
                    if response.code != '200'
                        entry[1]['image'] = ''
                    end
                end
                verified.push(entry[1])
            rescue
                entry[1]['image'] = ''
                verified.push(entry[1])
            end
        else
            verified.push(entry[1])
        end
    }

    File.open(site.dest + "/api/" + folder + "/all.json", 'w') do |file|
        file.write(verified.to_json)
    end

    File.open(site.dest + "/api/" + folder + "/most_starred.json", 'w') do |file|
        file.write(most_starred(verified).to_json)
    end

    File.open(site.dest + "/api/" + folder + "/recent_update.json", 'w') do |file|
        file.write(recent_update(verified).to_json)
    end

    File.open(site.dest + "/api/" + folder + "/most_forked.json", 'w') do |file|
        file.write(most_forked(verified).to_json)
    end
end

Jekyll::Hooks.register :site, :post_write do |site|
    FileUtils.mkdir_p(site.dest + '/api')

    Jekyll.logger.info "Generating API for #{site.data['packages'].length} packages"
    packages(site.data['packages'], site, "packages")

    Jekyll.logger.info "Generating API for #{site.data['themes'].length} themes"
    packages(site.data['themes'], site, "themes")

    packages_by_author(site.data['packages'], site.data['themes'], site)
end