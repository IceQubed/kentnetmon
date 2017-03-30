/*jslint browser: true */
/*global c3, d3, console */

/*
i)  upload udp to server
ii) recursive deletion


1. DONE-----------------------------Query page for each graph container in the constructor
                                    self.graphUdpContainer = self.container.querySelector('.graphUDP');

2. DONE???--------------------------For both types of graph, create functions that fetch & return data in c3 format using the defined column names
                                    use a callback and actually query backend for data - this will be where you'll do date filtering
                                    return chart.columns through callback. See runUdpTest
                                    columns: >>>>> [date, jitter, lostpackets] <<<<<<,
                                    callback([date, jitter, lostpackets]);

3. DONE???--------------------------As part of bind, create two functions (tcp, udp) to actually generate charts - querySelector for chart class
                                    use previously created callbacks to populate the necessary data
                                    store chart on self - self.tcpChart self.udpChart

4. DONE-----------------------------Create another two functions to update the saved chart with new data from step 2. self.chart.unload(); self.chart.load(STEP2DATA)

5. DONE-----------------------------Create datetime controls in the agent hbs template

6. DONE-----------------------------Bind to these controls in the bind function - querySelector with the change event

7. Why not just pass directly??-----Handle change event to store the date range on self - self.toDate, self.fromDate

8. Update step 2 function to read saved dates and use them as query parameters - 'toDate=' + date.getTime();

9. Actually implement filtering in graph routes - already skeleton'd for TCP!!

*/

var jitterColumnName = 'Jitter (%)';
var packetLossColumnName = 'Packet loss (%)';
var dateColumnName = 'Dates';
var throughputReceivedColumnName = 'Throughput Received';
var throughputSentColumnName = 'Throughput Sent';

var Agent = function (container) {
    var self = this;

    self.container = container;
    self.id = self.container.getAttribute('data-id');

    self.bind();
};

Agent.prototype.bind = function () {
    var self = this;

    //Find UI buttons on page and attach event listeners
    self.buttonRunTests = self.container.querySelector('[data-action~=run-tests]');
    self.buttonRunTests.addEventListener('click', function () {
        self.onRunTestsClick();
    });

    self.buttonRunTestTcp = self.container.querySelector('[data-action~=run-test-tcp]');
    self.buttonRunTestTcp.addEventListener('click', function () {
        self.onRunTestTcpClick();
    });

    self.buttonRunTestUdp = self.container.querySelector('[data-action~=run-test-udp]');
    self.buttonRunTestUdp.addEventListener('click', function () {
        self.onRunTestUdpClick();
    });

    self.buttonDelete = self.container.querySelector('[data-action~=delete]');
    self.buttonDelete.addEventListener('click', function () {
        self.onDeleteClick();
    });


    //Find status text on page
    self.statusContainer = self.container.querySelector('[data-purpose=status]');


    //Find graphs and date range selection inputs, add event listeners to inputs

    self.graphTcpContainer = self.container.querySelector('.graphTCP');

    self.fromDateTcp = self.container.querySelector('input[name$="fromDateTCP"]');
    self.toDateTcp = self.container.querySelector('input[name$="toDateTCP"]');

    self.fromDateTcp.value = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)).toDateInputValue();
    self.toDateTcp.value = new Date(new Date().getTime() + (1000 * 60 * 60 * 24)).toDateInputValue();

    self.fromDateTcp.addEventListener('change', function () {
        self.getTcpData(self.updateTcpChart, self.fromDateTcp.value, self.toDateTcp.value);
    });
    self.toDateTcp.addEventListener('change', function () {
        self.getTcpData(self.updateTcpChart, self.fromDateTcp.value, self.toDateTcp.value);
    });

    self.getTcpData(self.generateTcpChart, self.fromDateTcp.value, self.toDateTcp.value);


    //self.graphUdpContainer = self.container.querySelector('.graphUDP');
    //
    //self.fromDateUdp = self.container.querySelector('input[name$="fromDateUDP"]');
    //self.fromDateUdp.addEventListener('change', function () {
    //    self.getUdpData(self.updateUdpChart, self.fromDateUdp.value, self.toDateUdp.value);
    //});
    //self.toDateUdp = self.container.querySelector('input[name$="toDateUDP"]');
    //self.toDateUdp.addEventListener('change', function () {
    //    self.getUdpData(self.updateUdpChart, self.fromDateUdp.value, self.toDateUdp.value);
    //});
    //
    //self.getUdpData(self.generateUdpChart, self.fromDateUdp.value, self.toDateUdp.value);
};


//GRAPHING-------------------------------------------------

//TCP--------
Agent.prototype.getTcpData = function (callback, fromDate, toDate) {
    var self = this,
        request = new XMLHttpRequest(),
        uri = '/graphs/' + self.id,
        parameters = [];

    callback = callback || function () {};

    if (fromDate) {
        parameters.push('fromDate=' + encodeURIComponent(fromDate));
    }
    if (toDate) {
        parameters.push('toDate=' + encodeURIComponent(toDate));
    }

    request.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            self.setStatus(false);

            var date = JSON.parse(this.responseText).date,
                throughputReceived = JSON.parse(this.responseText).throughputReceived,
                throughputSent = JSON.parse(this.responseText).throughputSent;

            callback.call(self, date, throughputReceived, throughputSent);
        }
    });
    request.open('GET', uri + '?' + parameters.join('&'), true);
    request.send();
    self.setStatus(true, 'Fetching TCP data');
};

Agent.prototype.generateTcpChart = function (date, throughputReceived, throughputSent) {
    var self = this,
        container = self.graphTcpContainer;

    self.processTcpData(date, throughputReceived, throughputSent);

    self.tcpChart = c3.generate({
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
};

Agent.prototype.updateTcpChart = function (date, throughputReceived, throughputSent) {
    var self = this;

    self.processTcpData(date, throughputReceived, throughputSent);

    self.tcpChart.load({
        unload: true,
        columns: [date, throughputReceived, throughputSent]
    });
};

Agent.prototype.processTcpData = function (date, throughputReceived, throughputSent) {
    for (var i = 0; i < throughputReceived.length; i++) {
        throughputReceived[i] /= 1000000;
        throughputSent[i] /= 1000000;
    }

    throughputReceived.unshift(throughputReceivedColumnName);
    throughputSent.unshift(throughputSentColumnName);
    date.unshift(dateColumnName);
};



//---------------------------------------------------------



Agent.prototype.onRunTestsClick = function () {
    var self = this;

    self.runTcpTest(function () {
        self.runUdpTest(function () {
            self.setStatus(false, 'Tests finished');
            location.reload();
        });
    });
};
Agent.prototype.onRunTestTcpClick = function () {
    var self = this;

    self.runTcpTest(function () {
        self.setStatus(false, 'TCP test finished');
        location.reload();
    });
};
Agent.prototype.onRunTestUdpClick = function () {
    var self = this;

    self.runUdpTest(function () {
        self.setStatus(false, 'UDP test finished');
        location.reload();
    });
};

Agent.prototype.onDeleteClick = function () {
    var self = this;

    self.deleteSelf(function () {
        self.setStatus(true, 'Deleted');

        setTimeout(function () {
            self.container.parentNode.removeChild(self.container);
        }, 1000);
    });
};


Agent.prototype.setStatus = function (isBusy, message) { //controls status text next to agent name
    var self = this;

    self.statusContainer.textContent = message ? ' (' + message + ')' : ''; //if message set message otherwise blank

    if (isBusy) { //disable inputs when busy
        self.buttonRunTests.setAttribute('disabled', '');
        self.buttonRunTestTcp.setAttribute('disabled', '');
        self.buttonRunTestUdp.setAttribute('disabled', '');
        self.buttonDelete.setAttribute('disabled', '');
    } else { //otherwise enable inputs
        self.buttonRunTests.removeAttribute('disabled');
        self.buttonRunTestTcp.removeAttribute('disabled');
        self.buttonRunTestUdp.removeAttribute('disabled');
        self.buttonDelete.removeAttribute('disabled');
    }
};


Agent.prototype.runTcpTest = function (callback) {
    var self = this,
        request = new XMLHttpRequest();

    callback = callback || function () {}; //ensure that 'callback' is a function

    request.addEventListener('readystatechange', function () {
        if (request.readyState !== 4) { //don't run next lines unless request complete
            return;
        }

        if (request.status === 200) { //if status is 'OK'
            self.setStatus(false);
            callback.call(self);
        } else {
            self.setStatus(true, request.responseText);
        }
    });
    request.open('GET', '/iperf/' + self.id, true);
    request.send();
    self.setStatus(true, 'Running TCP test');
};
Agent.prototype.runUdpTest = function (callback) {
    var self = this,
        request = new XMLHttpRequest();

    callback = callback || function () {};

    request.addEventListener('readystatechange', function () {
        if (request.readyState === 4) {
            self.setStatus(false);
            callback.call(self);
        }
    });
    request.open('GET', '/iperfudp/' + self.id, true);
    request.send();
    self.setStatus(true, 'Running UDP test');
};

Agent.prototype.deleteSelf = function (callback) {
    var self = this,
        request = new XMLHttpRequest();

    callback = callback || function () {};

    if (!window.confirm('Are you sure you want to delete this agent? \nAgents cannot be undeleted and will have to be re-added!')) {
        return;
    }

    request.addEventListener('readystatechange', function () {
        if (request.readyState === 4) {
            self.setStatus(false);
            callback.call(self);
        }
    });
    request.open('GET', '/deleteagent/' + self.id, true);
    request.send();
    self.setStatus(true, 'Deleting');
};


Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});


var i,
    agents = [], //blank array to hold all agent objects
    agentContainers = document.querySelectorAll('.agents > .agent'); //find all agents

for (i = 0; i < agentContainers.length; i += 1) {
    agents.push(new Agent(agentContainers[i])); //build agent objects from agent list and add to array
}
