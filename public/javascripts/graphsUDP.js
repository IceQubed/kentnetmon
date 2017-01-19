'use strict';

function generateChartUDP(container, agentId) {
    var request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function () {
        if (this.readyState == 4) {
            var jitter = JSON.parse(this.responseText).jitter,
                lostpackets = JSON.parse(this.responseText).lostpackets,
                chart;

            jitter.unshift('Jitter (%)');
            lostpackets.unshift('Packet loss (%)');



            chart = c3.generate({
                bindto: container,
                data: {
                    //                    columns: [jitter]
                    columns: [
                        jitter,
                        lostpackets
                    ],
                    axes: {
                        [jitter[0]]: 'y',
                        [lostpackets[0]]: 'y2'
                    }
                },
                axis: {
                    x: {
                        label: 'Test No.'
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
