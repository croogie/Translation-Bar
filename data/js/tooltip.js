var formatData = function(arr) {
    var i = 1;
    var narr = [];
    $.each(arr, function(index, value){
        narr.push([i++, value]);
    });
    return narr;
};

var lastData, lastTitle;

var rebuildChart = function(title, data) {
    lastData = data;
    lastTitle = title;
    var chartTitle = title || 'DomContentLoaded Chart';
    
    var line1 = data ? formatData(data[0]) : [];
    var line2 = data ? formatData(data[1]) : [];
    var line3 = data ? formatData(data[2]) : [];
    var line4 = data ? formatData(data[3]) : [];

    $('#chart-container').empty();
    var tbody = $('#table table tbody');
    tbody.empty();
    buildTable(line1, line2).appendTo(tbody);
    
    var plot1 = $.jqplot('chart-container', [line1, line2, line3, line4], {
        title: title,
        highlightMouseOver: false,
        highlightMouseDown: true,
        highlighter: {
            show: true,
            tooltipAxes: 'y',
            tooltipFormatString: '$%.2f[ms]'
        },
        axes: {
            xaxis: {
                pad: 0.5
            },
            y2axis: {
                pad: 0.5
            }
        },
        series: [
            {show: $('#check-dcl').is(':checked'),     color: '#E01414'},
            {show: $('#check-dcl-avg').is(':checked'), color: '#F48484'},
            {show: $('#check-ol').is(':checked'),      color: '#1376D3'},
            {show: $('#check-ol-avg').is(':checked'),  color: '#84BEF4'}
        ],
        cursor: {
            show: false
        }
    });

    $('#table .data, #chart-container').stop().fadeTo('fast', 1);

//    $('#chart-container').bind(
//        'jqplotDataClick',
//        function (ev, seriesIndex, pointIndex, data) {
//            console.info('series: ' + seriesIndex + ', point: ' + pointIndex + ', data: ' + data);
//        }
//    );
};

var buildTable = function(dcl, avg) {
    var row = $('<tbody><tr><td>${no}</td><td>${dcl}</td><td>${avg}</td></tr></tbody>');
    var data = [];
    var a = 0;
    
    for (var i in dcl){
        data.push({
            no: a+1,
            dcl: dcl[a][1],
            avg: avg[a][1].toFixed(2)
        });
        a++;
    }
    var tbody = $(row).tmpl(data);
    
    return tbody;
};

$('#widget-switch').click(function() {
    if ($(this).data('enabled') == 1) {
        self.port.emit('widgetSwitch', 0);
    } else {
        self.port.emit('widgetSwitch', 1);
    }
});

$('#clear-data').click(function(){
    self.port.emit('clear');
});

$('.chart-options input').change(function(){
    rebuildChart(lastTitle, lastData);
});

self.port.on("widgetSwitched", function(state) {
    var button = $('#widget-switch');
    if (state) {
        button.text('Disable widget').data('enabled', 1);
    } else {
        button.text('Enable widget').data('enabled', 0);
    }
});

self.port.on('loading', function(){
    $('#table .data, #chart-container').stop().fadeTo('fast', 0.2);
});

self.port.on("reloadContent", function(title, data) {
    rebuildChart(title, data);
});