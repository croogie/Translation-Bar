var translateMe = function(e){
    e.preventDefault();
    self.port.emit('translationRequest', $(this).text());
};

jlog = function(jq){
    var t = $('<div />').append($(jq).clone()).remove().html();
    console.log(t);
}

var requestCopyToClipboard = function(e){
    var container = $(this).parent();
    var text = '';
    var textExample = [];

    $('.definicja', container).each(function(i, definicja){
        $('.typ_opis', definicja).each(function(i, typ){
            text += '|'+$(typ).text() + '| ';
        });

        $('a.definition', definicja).each(function(i, def){
            text += $(def).text() + '; ';
        });

        if ($('.podkategoria', definicja).length)
            text += '(kat.:' + $.map($('.podkategoria', definicja), function(el){
                return $(el).text();
            }).join(',') + ') ';

        $('.example', definicja).each(function(i, example){
            nextExample = textExample.length+1;
            text += '('+nextExample+') ';
            var tExample = $(example).clone();
            $('.right', tExample).remove();
            textExample.push('('+nextExample+') '+$.trim(tExample.text()));
        });

        text += '\n';
    });

    text += '\n'+$('h1 strong').text();
    if (textExample.length)
        text += '\n'+textExample.join('\n')

    self.port.emit('copyToClipboardRequest', text);
}

var parser = {
    megaslownik: function(content){

        returnedContent = $('<div class="megaslownik" />');

        $znaczenia = $('.znaczenie', content);

        $znaczenia.each(function(i, znaczenie){
            var znaczenieContent = $('<div />', {
                class: 'znaczenie'
            });
            znaczenieContent.append($('<a />', {
                href: 'javascript:void(0);',
                click: requestCopyToClipboard,
                text: 'copy',
                css: {
                    float: 'right',
                    fontSize: '10px',
                    padding: '3px 5px'
                }
            }));
            znaczenieContent.append($(znaczenie).html());

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

                var podKatPatt = /\(kat.:\s?([^\)]+)\)/g;
                $('span.podkategoria', def).each(function(i, el){
                    $.each(podKatPatt.exec($(el).text())[1].split(","), function(i, el){
                        definicja.append($('<span />', {text: el, 'class': 'podkategoria'}));
                    });
                });

                $('.typ_opis', def).each(function(i, el) {
                    definicja.append(el);
                });

                $('a:not(.ikona_sluchaj2)', def).each(function(i, el){
                    $(el).attr('href', '#').click(translateMe).addClass('definition').appendTo(definicja);
                });

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
            content = parser.megaslownik($('#word2', $(data.content)));
            break;

        default:
            content = $(data.content);
    }

    $('h1.phrase').html('<strong>'+data.phrase+'</strong> &nbsp; <small>MegaSlownik.pl</small>');
    $('.'+data.type).html(content);
});


// events binding
$('.znaczenie h3').live('click', function(e){
    $(this).nextAll().stop().slideToggle();
    $(this).toggleClass('disabled');
})