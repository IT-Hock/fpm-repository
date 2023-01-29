# filter to sort posts by date and then stars
module Jekyll
  module FeaturedFilter
    def most_starred(input)
      sorted = input.sort_by { |entry| entry[1]['stars'] }
      sorted.reverse!
      sorted.take(3)
    end

    def recent_update(input)
      sorted = input.sort_by { |entry| entry[1]['updated'] }
      sorted.reverse!
      sorted.take(3)
    end

    def featured(input)
      recent_updated_entries = recent_update(input)

      # remove 3 recent update from input
      recent_updated_entries.each do |entry|
        input.delete(entry[0])
      end

      most_starred_entries = most_starred(input)

      # create object with 3 most starred and 5 recent update
      featured_list = {}
      featured_list['mostStarred'] = most_starred_entries
      featured_list['recentUpdated'] = recent_updated_entries

      featured_list
    end
  end
end
Liquid::Template.register_filter(Jekyll::FeaturedFilter)