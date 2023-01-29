# A filter to sort the posts by a given attribute
# Usage: {% assign sorted_posts = site.posts | sort_by: 'title' %}
module Jekyll
    module SortByFilter
        def sort_by(input, sortBy, reverse = false)
            # The key is irrelevant, the value is the post we need foreach
            # Value to hold the sorted posts
            sorted = Hash.new

            input.each { |post|
                # post[1] holds the object, post[0] holds the key
                sorted[post[1][sortBy]] = post[1]
            }
            if reverse
                return sorted.sort.reverse
            else
                sorted = sorted.sort
            end
            # Return the sorted posts
            sorted
        end
    end
end
Liquid::Template.register_filter(Jekyll::SortByFilter)