
module Jellyfish
  module Linkify
    def linkify(input, link)
      if input.start_with?('/')
        return link + input
      elsif input.start_with?('http')
        return input
      end

      # Replace relative links with absolute links
      input.gsub(/href="([^"]+)"/) do |match|
        if $1 == nil
          next
        end

        if $1.start_with?('/')
          "href=\"#{link}#{$1}\""
        else
          match
        end
      end
    end
  end
end

Liquid::Template.register_filter(Jellyfish::Linkify)