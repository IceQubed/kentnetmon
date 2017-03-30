function generateGraphTCP(date, throughputReceived, throughputSent) {
    var chart,
        length = throughputReceived.length;

    for (var i = 0; i < length; i++) {
        throughputReceived[i] /= 1000000;
        throughputSent[i] /= 1000000;
    }

    throughputReceived.unshift('Throughput Received');
    throughputSent.unshift('Throughput Sent');
    date.unshift('Dates');

    chart = c3.generate({
        bindto: container,
        data: {
            x: 'Dates',
            xFormat: '%Y %m %d %H %M',
            columns: [date, throughputReceived, throughputSent]
        },
        subchart: { //subchart for chart zoom interaction
            show: true
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%d/%m',
                    count: 5
                }
            },
            y: {
                label: {
                    text: 'Throughput (Mbps)',
                    position: 'outer-top'
                },
                tick: {
                    format: d3.format('.2f')
                },
                min: 0,
                padding: {
                    bottom: 0
                }
            }
        },
        grid: {
            y: {
                lines: [
                    {
                        value: 5,
                        text: 'HD Video Streaming'
                    },
                    {
                        value: 80,
                        text: 'Target'
                    }
                ]
            }
        },
        tooltip: {
            format: {
                title: function (d) {
                    return d;
                },
                value: function (value, ratio, id) {
                    return parseFloat(value).toFixed(4) + " Mbps";
                }
            },
            position: function (data, width, height, element) {
                return {
                    top: -100,
                    left: 70
                };
            }
        }
    });

}
