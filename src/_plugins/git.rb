# Plugin to inject git information into the site
module Jekyll
    class GitGenerator < Generator
        safe true

        Jekyll.logger.info "Git:", "GIT:::: " + `git rev-list --tags --max-count=1`

        def generate(site)
            site.config['git'] = {
                'head' => {
                    'id' => `git rev-parse HEAD`.strip,
                    'short_id' => `git rev-parse --short HEAD`.strip.empty? ? "00000" : `git rev-parse --short HEAD`.strip,
                    'branch' => `git rev-parse --abbrev-ref HEAD`.strip.empty? ? "unknown" : `git rev-parse --abbrev-ref HEAD`.strip,
                    'tag' => `git describe --tags --exact-match`.strip.empty? ? "unknown" : `git describe --tags --exact-match`.strip,
                    'message' => `git --no-pager show -s --format="%s" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%s" HEAD`.strip,
                    'author' => {
                        'name' => `git --no-pager show -s --format="%an" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%an" HEAD`.strip,
                        'email' => `git --no-pager show -s --format="%ae" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%ae" HEAD`.strip,
                        'date' => `git --no-pager show -s --format="%ad" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%ad" HEAD`.strip,
                    },
                    'committer' => {
                        'name' => `git --no-pager show -s --format="%cn" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%cn" HEAD`.strip,
                        'email' => `git --no-pager show -s --format="%ce" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%ce" HEAD`.strip,
                        'date' => `git --no-pager show -s --format="%cd" HEAD`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%cd" HEAD`.strip,
                    },
                },
                'last_commit' => {
                    'id' => `git rev-parse HEAD~1`.strip.empty? ? "0000000000000000000000000000000000000000" : `git rev-parse HEAD~1`.strip,
                    'short_id' => `git rev-parse --short HEAD~1`.strip.empty? ? "00000" : `git rev-parse --short HEAD~1`.strip,
                    'branch' => `git rev-parse --abbrev-ref HEAD~1`.strip.empty? ? "unknown" : `git rev-parse --abbrev-ref HEAD~1`.strip,
                    'tag' => `git describe --tags --exact-match HEAD~1`.strip.empty? ? "unknown" : `git describe --tags --exact-match HEAD~1`.strip,
                    'message' => `git --no-pager show -s --format="%s" HEAD~1`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%s" HEAD~1`.strip,
                    'date' => `git --no-pager show -s --format="%ad" HEAD~1`.strip.empty? ? "unknown" : `git --no-pager show -s --format="%ad" HEAD~1`.strip,
                    'author' => {
                        'name' => `git log -1 --format=%an`.strip.empty? ? "unknown" : `git log -1 --format=%an`.strip,
                        'email' => `git log -1 --format=%ae`.strip.empty? ? "unknown" : `git log -1 --format=%ae`.strip,
                    },
                },
                'last_tag' => {
                    'id' => `git rev-list --tags --max-count=1`.strip.empty? ? "0000000000000000000000000000000000000000" : `git rev-list --tags --max-count=1`.strip,
                    'short_id' => `git rev-list --tags --max-count=1 --abbrev-commit`.strip.empty? ? "00000" : `git rev-list --tags --max-count=1 --abbrev-commit`.strip,
                    'name' => `git describe --tags --abbrev=0`.strip.empty? ? "unknown" : `git describe --tags --abbrev=0`.strip,
                    'date' => `git log -1 --format=%cd --date=iso --tags --abbrev=0`.strip.empty? ? "unknown" : `git log -1 --format=%cd --date=iso --tags --abbrev=0`.strip,
                    'message' => `git log -1 --format=%s --tags --abbrev=0`.strip.empty? ? "unknown" : `git log -1 --format=%s --tags --abbrev=0`.strip,
                    'author' => {
                        'name' => `git log -1 --format=%an --tags --abbrev=0`.strip.empty? ? "unknown" : `git log -1 --format=%an --tags --abbrev=0`.strip,
                        'email' => `git log -1 --format=%ae --tags --abbrev=0`.strip.empty? ? "unknown" : `git log -1 --format=%ae --tags --abbrev=0`.strip,
                    },
                }
            }
        end
    end
end