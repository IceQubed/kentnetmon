var child_process = require('child_process');

// execFile: executes a file with the specified arguments
child_process.execFile('iperf3', ['-c', '192.168.1.102', '-u', '-b', '1000M'], function (error, stdout, stderr) {
    console.log(stdout);
});
