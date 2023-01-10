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
});