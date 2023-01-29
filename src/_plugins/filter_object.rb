module Jekyll
  module ObjectFilter
    def filter_object(input, filter)
      # filter by first letter
      filtered = input.select { |entry| entry[0].start_with?(filter) }
      Jekyll.logger.debug "Filtering by #{filter}: #{filtered}"
      filtered
    end
  end
end
Liquid::Template.register_filter(Jekyll::ObjectFilter)