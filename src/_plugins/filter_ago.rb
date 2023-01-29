# A jekyll filter to convert a unix timestamp to a human readable time
# Usage: {{ 1400000000 | ago }}

module Jekyll
  module AgoFilter
    def ago(input)
      # x minutes / hours / days / months / years ago
      seconds = Time.now.to_i - input.to_i
      minutes = seconds / 60
      hours = minutes / 60
      days = hours / 24
      months = days / 30
      years = months / 12

      if years > 0
        "#{years} year#{years > 1 ? 's' : ''} ago"
      elsif months > 0
        "#{months} month#{months > 1 ? 's' : ''} ago"
      elsif days > 0
        "#{days} day#{days > 1 ? 's' : ''} ago"
      elsif hours > 0
        "#{hours} hour#{hours > 1 ? 's' : ''} ago"
      elsif minutes > 0
        "#{minutes} minute#{minutes > 1 ? 's' : ''} ago"
      else
        "#{seconds} second#{seconds > 1 ? 's' : ''} ago"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::AgoFilter)