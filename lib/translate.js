// Import the APIs we need.
var request = require("request");

// Define the 'translate' function using Request
function megaslownik(text, callback) {
    if (text.length === 0) {
        throw ("Text to translate must not be empty");
    }
    var req = request.Request({
        url: "http://megaslownik.pl/slownik/" + text,
        onComplete: function (response) {
            callback({
                type: 'megaslownik',
                content: response.text,
                phrase: text
            });
        }
    });
    req.get();
}

function ling(text, callback) {
    if (text.length === 0) {
        throw ("Text to translate must not be empty");
    }
    var req = request.Request({
        url: "http://ling.pl/php/lingfeed-30.php",
        content: {
            sType: 0,
            word: text
        },
        onComplete: function (response) {
            callback({
                type: 'ling',
                content: response.text,
                phrase: text
            });
        }
    });
    req.get();
}

// Export the 'translate' function
exports.megaslownik = megaslownik;
exports.ling = ling;