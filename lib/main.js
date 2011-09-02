// Import the APIs we need.
const data = require("self").data;
const panel = require("panel");
const request = require("request");

exports.main = function(options, callbacks) {
    console.log(options.loadReason);
};



var appPanel = panel.Panel({
    contentURL: data.url('panel.html'),
    width: 500,
    height: 280
});

var widgets = require("widget");
var tabs = require("tabs");

var widget = widgets.Widget({
    id: "mozilla-link",
    label: "Translator",
    width: 200,
    contentURL: data.url('widget.html'),
    contentScriptFile: [
        data.url('js/jquery-1.6.2.js'),
        data.url('js/jquery.tmpl.min.js'),
        data.url('widget/widget.js')
    ]
});

widget.port.on('translationRequest', function(data){
    console.log("Requested translation: ", data);

    widget.port.emit('translationResponse', 'Response from '+data+' request!');
});



tabs.open('http://www.gamesgames.com.family-git.croogie.rmt/');