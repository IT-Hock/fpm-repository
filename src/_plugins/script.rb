# Generate a javascript file with constants
Jekyll::Hooks.register :site, :post_write do |site|
    File.open("src/assets/ts/generated/constants.ts", "w") do |f|
        f.write("import { Git } from \"../git\";\n")
        f.write("import { Environment } from \"../environment\";\n")
        f.write("export const BASE_URL:string = '#{site.config['baseurl_root']}';\n")
        f.write("export const API_URL:string = '#{site.config['baseurl_root']}/api';\n")
        f.write("export const ASSET_URL:string = '#{site.config['baseurl_root']}/assets';\n")
        f.write("export const GIT_JSON:string = '#{site.config['git'].to_json}';\n")
        f.write("export const GIT:Git = JSON.parse(GIT_JSON);\n")
        f.write("export const ENVIRONMENT: Environment = ")
        if site.config['environment'] == 'production'
            f.write("Environment.Production;\n")
        else
            f.write("Environment.Development;\n")
        end
    end
end