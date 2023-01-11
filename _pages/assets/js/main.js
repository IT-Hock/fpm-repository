$(document).ready(function() {
    $('.copy-clipboard').click(function () {
        let code = $('#code');
    
        /* Animate the background color to flash green */
        code.animate({
            backgroundColor: '#50fa7b'
        }, 100, function () {
            code.animate({
                backgroundColor: '#44475a'
            }, 1000);
        });
    
        navigator.clipboard.writeText($(this).data('clipboard'));
    });
    
    var timeout;
    $('img.thumbnail').hover(function (evt) {
        let preview_name = "#" + $(this).data("name");
        let container = $(this).parent().find(preview_name).first();
        var pos = $(this).parent().position();
        var width = $(this).outerWidth();
        
        timeout = setTimeout(function () {
            container.css({
                position: "absolute",
                top: (pos.top) + "px",
                left: (pos.left + width + 15) + "px"
            }).fadeIn(100);
        }, 150);
    }, function () {
        let preview_name = "#" + $(this).data("name")
        let container = $(this).parent().find(preview_name).first()
        container.fadeOut(250);
        clearTimeout(timeout);
    });
});
