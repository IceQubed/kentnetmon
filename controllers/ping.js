var child_process = require('child_process');

// execFile: executes a file with the specified arguments
child_process.execFile('ping', ['192.168.1.102'], function (error, stdout, stderr) {
    console.log(stdout);
});
