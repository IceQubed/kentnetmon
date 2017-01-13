'use strict';

function generateChart(container, agentId) {
    var request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function () {
        if (this.readyState == 4) {
            var results = JSON.parse(this.responseText).results,
                chart;

            results.unshift('bps');

            chart = c3.generate({
                bindto: container,
                data: {
                    columns: [results]
                }
            });
        }
    });
    request.open('GET', '/graphs/' + agentId, true);
    request.send();
}

window.addEventListener('load', function () {
    var graphContainers = document.querySelectorAll('.agent .graph'),
        i;

    for (i = 0; i < graphContainers.length; i += 1) {
        generateChart(graphContainers[i], graphContainers[i].getAttribute('data-agent-id'));
    }
});
