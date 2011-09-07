// Import the APIs we need.
const data = require("self").data;
const panel = require("panel");
const request = require("request");
const widgets = require("widget");
const tabs = require("tabs");
const hotkeys = require("hotkeys");
const translate = require("translate");

var appPanel = panel.Panel({
    contentURL: data.url('panel/panel.html'),
    contentScriptFile: [
        data.url('js/jquery-1.6.2.js'),
        data.url('js/jquery.tmpl.min.js'),
        data.url('panel/panel.js')
    ],
    width: 574,
    height: 450
});

var widget = widgets.Widget({
    id: "mozilla-link",
    label: "Translator",
    width: 200,
    contentURL: data.url('widget/widget.html'),
    contentScriptFile: [
        data.url('js/jquery-1.6.2.js'),
        data.url('js/jquery.tmpl.min.js'),
        data.url('widget/widget.js')
    ]
});


appPanel.port.on('translationRequest', function(data){
    console.log('Translation has been requested');
    appPanel.hide();
    translate.megaslownik(data, function(response){
        appPanel.port.emit('translationResponse', response);
        widget.port.emit('translationResponse', response);
        appPanel.show();
    });
});

widget.port.on('translationRequest', function(data) {
    console.log("Requested translation: ", data);
//    translate.ling(data, function(response){
//        appPanel.port.emit('translationResponse', response);
//        widget.port.emit('translationResponse', 'Response from ' + data + ' request!');
//        appPanel.show();
//    });
    translate.megaslownik(data, function(response){
        appPanel.port.emit('translationResponse', response);
        widget.port.emit('translationResponse', response);
        appPanel.show();
    });
});

var focusInput = hotkeys.Hotkey({
    combo: "accel-shift-i",
    onPress: function() {
        widget.port.emit('focusInput');
    }
});
var panelShow = hotkeys.Hotkey({
    combo: "accel-alt-i",
    onPress: function(){
        appPanel.show();
    }
})

//tabs.open('http://www.gamesgames.com.family-git.croogie.rmt/');