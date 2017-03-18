/*
i)  upload udp to server
ii) recursive deletion


1. Query page for each graph container in the constructor
 - self.graphUdpContainer = self.container.querySelector('.graphUDP');

2. For both types of graph, create functions that fetch & return data in c3 format using the defined column names
   use a callback and actually query backend for data - this will be where you'll do date filtering
   return chart.columns through callback. See runUdpTest
   columns: >>>>> [date, jitter, lostpackets] <<<<<<,
   callback([date, jitter, lostpackets]);

3. As part of bind, create two functions (tcp, udp) to actually generate charts - querySelector for chart class
   use previously created callbacks to populate the necessary data
   store chart on self - self.tcpChart self.udpChart

4. Create another two functions to update the saved chart with new data from step 2. self.chart.unload(); self.chart.load(STEP2DATA)

5. Create datetime controls in the agent hbs template

6. Bind to these controls in the bind function - querySelector with the change event

7. Handle change event to store the date range on self - self.toDate, self.fromDate

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

    self.statusContainer = self.container.querySelector('[data-purpose=status]');
};


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


Agent.prototype.setStatus = function (isBusy, message) {
    var self = this;

    self.statusContainer.textContent = message ? ' (' + message + ')' : '';

    if (isBusy) {
        self.buttonRunTests.setAttribute('disabled', '');
        self.buttonRunTestTcp.setAttribute('disabled', '');
        self.buttonRunTestUdp.setAttribute('disabled', '');
        self.buttonDelete.setAttribute('disabled', '');
    } else {
        self.buttonRunTests.removeAttribute('disabled');
        self.buttonRunTestTcp.removeAttribute('disabled');
        self.buttonRunTestUdp.removeAttribute('disabled');
        self.buttonDelete.removeAttribute('disabled');
    }
};


Agent.prototype.runTcpTest = function (callback) {
    var self = this,
        request = new XMLHttpRequest();

    callback = callback || function () {};

    request.addEventListener('readystatechange', function () {
        if (request.readyState !== 4) { //when complete continue
            return;
        }

        if (request.status === 200) {
            self.setStatus(false);
            callback();
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
            callback();
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
            callback();
        }
    });
    request.open('GET', '/deleteagent/' + self.id, true);
    request.send();
    self.setStatus(true, 'Deleting');
};


var i,
    agents = [],
    agentContainers = document.querySelectorAll('.agents > .agent');

for (i = 0; i < agentContainers.length; i += 1) {
    agents.push(new Agent(agentContainers[i]));
}
