var input = $('input');

input.keydown(
        function(e) {
            if (e.keyCode == 13) {
                self.port.emit('translationRequest', $(this).val());
            }
        }).click(function(e) {
            $(this)[0].focus();
            $(this)[0].select();
        });

self.port.on('focusInput', function(data) {
    var i = $('input')[0];
    i.focus();
    i.select();
});

self.port.on('translationResponse', function(data) {
    input.val(data.phrase);
});