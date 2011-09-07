var translateMe = function(e){
    e.preventDefault();
    self.port.emit('translationRequest', $(this).text());
};

var parser = {
    megaslownik: function(content){

        returnedContent = $('<div class="megaslownik" />');

        $('.definicja', content).each(function(i, def){
            var definicja = $('<li />', {
                class: 'definicja'
            });
            $('a:not(.ikona_sluchaj2)', def).each(function(i, el){
                $(el).attr('href', '#').attr('title', 'przetłumacz...').click(translateMe).addClass('definition').appendTo(definicja);
            })

            $(def).nextUntil('.definicja').each(function(i, el){
                // przykłady
                if ($(el).hasClass('example')) {
                    $('span:first', el).remove();
                    definicja.append($(el).text($(el).text()).prepend($('<span class="right">przykład</span>')));
                }

                // zobacz również
                if ($(el).hasClass('zobaczrowniez')) {
                    var zobaczrowniez = $('<div class="zobaczrowniez"><span class="right">zobacz również</span></div>', {
                        class: 'zobaczrowniez'
                    });

                    $('a', el).each(function(i, el){
                        $(el).attr('href', '#').attr('title', 'przetłumacz...').click(translateMe);
                        $(el).appendTo(zobaczrowniez);
                    });

                    definicja.append(zobaczrowniez);
                }
            });

            if ($(def).next)

            returnedContent.append(definicja);
        });

        return returnedContent;
    },
    ling: function(content){
        return content;
    }
}

self.port.on('translationResponse', function(data){
    var content = '';

    switch(data.type){
        case 'megaslownik':
            console.log('tłumaczenie: ', $('#word2', $(data.content)).html())
            content = parser.megaslownik($('#word2', $(data.content)));
            break;

        default:
            content = $(data.content);
    }

    $('h1.phrase').html(data.phrase+' &nbsp; <small>MegaSlownik.pl</small>');
    $('.'+data.type).html(content);
});