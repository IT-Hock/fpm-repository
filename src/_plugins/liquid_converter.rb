module Jekyll
  class LiquidConverter < Converter
    safe true
    priority :high

    def matches(ext)
      ext =~ /^\.liquid$/i
    end

    def output_ext(ext)
      ""
    end

    def convert(content)
        content
    end
  end
end

# Jekyll plugin to rename *.html.liquid to *.html
Jekyll::Hooks.register :pages, :post_render do |page|
    if page.path.end_with?(".html.liquid")
        # Use LiquidConverter
        page.output = Jekyll::LiquidConverter.new.convert(page.output)
    end
end