var translateMe = function(e){
    e.preventDefault();
    self.port.emit('translationRequest', $(this).text());
};

jlog = function(jq){
    var t = $('<div />').append($(jq).clone()).remove().html();
    console.log(t);
}

var parser = {
    megaslownik: function(content){

        returnedContent = $('<div class="megaslownik" />');

        $znaczenia = $('.znaczenie', content);

        console.log('Znaleziono ', $znaczenia.length, ' znaczenia');

        $znaczenia.each(function(i, znaczenie){
            var znaczenieContent = $('<div />', {
                class: 'znaczenie',
                html: $(znaczenie).html()
            });
            var znaczenieToProcess;
            
            if (i+1 == $znaczenia.length) {
                // ostatnie znaczenie (czytamy do końca)
                znaczenieToProcess = $(znaczenie).nextAll();
            } else {
                znaczenieToProcess = $(znaczenie).nextUntil('.znaczenie');
            }
            znaczenieToProcess = $('<div />').append(znaczenieToProcess).clone();

            $('.definicja', znaczenieToProcess).each(function(i, def){
                var definicja = $('<div />', {
                    class: 'definicja'
                });
                $('a:not(.ikona_sluchaj2)', def).each(function(i, el){
                    $(el).attr('href', '#').click(translateMe).addClass('definition').appendTo(definicja);
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

                znaczenieContent.append(definicja);
            });

            returnedContent.append(znaczenieContent);
        })

        jlog(returnedContent);
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


// events binding
$('.znaczenie h3').live('click', function(e){
    $(this).nextAll().stop().slideToggle();
    $(this).toggleClass('disabled');
})