'use strict';

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
        if (request.readyState === 4) {
            // Report status
            console.log('Fuck yeah');

            self.setStatus(false);
            callback();
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
            // Report status
            console.log('Fuck yeah');

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

    if (!confirm('Are you sure you want to delete this agent? \nAgents cannot be undeleted and will have to be re-added!')) {
        return;
    }

    request.addEventListener('readystatechange', function () {
        if (request.readyState === 4) {
            // Report status
            console.log('Fuck yeah');

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
