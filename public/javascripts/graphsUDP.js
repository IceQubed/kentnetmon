'use strict';

function generateChartUDP(container, agentId) {
    var request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function () {
        if (this.readyState == 4) {
            var jitter = JSON.parse(this.responseText).jitter,
                lostpackets = JSON.parse(this.responseText).lostpackets,
                date = JSON.parse(this.responseText).date,
                chart;

            jitter.unshift('Jitter (%)');
            lostpackets.unshift('Packet loss (%)');
            date.unshift('Dates');


            chart = c3.generate({
                bindto: container,
                data: {
                    x: 'Dates',
                    xFormat: '%Y %m %d %H %M',
                    columns: [date, jitter, lostpackets],
                    axes: {
                        [jitter[0]]: 'y',
                        [lostpackets[0]]: 'y2'
                    }
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
                            text: 'Jitter (%)',
                            position: 'outer-top'
                        },
                        tick: {
                            format: d3.format('.2f')
                        }
                    },
                    y2: {
                        show: true,
                        label: {
                            text: 'Packet loss (%)',
                            position: 'outer-top'
                        },
                        tick: {
                            format: d3.format('.2f')
                        }
                    }
                },
                tooltip: {
                    format: {
                        title: function (d) {
                            return d;
                        },
                    },
                    position: function (data, width, height, element) {
                        return {
                            top: -100,
                            left: 70
                        }
                    }
                }
            });
        }
    });
    request.open('GET', '/graphsUDP/' + agentId, true);
    request.send();
}

window.addEventListener('load', function () {
    var graphContainers = document.querySelectorAll('.graphUDP'),
        i;

    for (i = 0; i < graphContainers.length; i += 1) {
        generateChartUDP(graphContainers[i], graphContainers[i].getAttribute('data-agent-udp-id')); //Iterate through agents generating a graph for each
    }
});
