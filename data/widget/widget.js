$('input').keydown(function(e){
    if (e.keyCode == 13){
        self.port.emit('translationRequest', $(this).val());
    }
});

self.port.on('translationResponse', function(data){
    console.log(request);
});