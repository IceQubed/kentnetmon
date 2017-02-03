function generateChartTCP(container, agentId) {
    var request = new XMLHttpRequest();


    request.addEventListener('readystatechange', function () {
        if (this.readyState == 4) {
            var throughputReceived = JSON.parse(this.responseText).throughputReceived,
                throughputSent = JSON.parse(this.responseText).throughputSent,
                date = JSON.parse(this.responseText).date,
                chart,
                length = throughputReceived.length;

            for (var i = 0; i < length; i++) {
                throughputReceived[i] /= 1000000;
                throughputSent[i] /= 1000000;
                //                date[i] = moment(date[i]).format("YYYY MM DD hh ss");
            }

            throughputReceived.unshift('Throughput Received');
            throughputSent.unshift('Throughput Sent');
            date.unshift('Dates');

            chart = c3.generate({
                bindto: container,
                data: {
                    x: 'Dates',
                    xFormat: '%Y %m %d %H %M',
                    //                    xFormat: '%Y %m %d',
                    columns: [date, throughputReceived, throughputSent]
                },
                axis: {
                    x: {
                        //                        label: 'Test No.'
                        type: 'timeseries',
                        tick: {
                            format: '%d/%m',
                            //                            fit: false,
                            count: 5,
                            //                            centered: true
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
                                value: 50,
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
    });
    request.open('GET', '/graphs/' + agentId, true);
    request.send();
}

window.addEventListener('load', function () {
    var graphContainers = document.querySelectorAll('.graphTCP'),
        i;

    for (i = 0; i < graphContainers.length; i += 1) {
        generateChartTCP(graphContainers[i], graphContainers[i].getAttribute('data-agent-tcp-id')); //Iterate through agents generating a graph for each
    }
});
