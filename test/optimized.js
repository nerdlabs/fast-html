var parser = require('../')();

var optimizationStatusMessages = [
    'undefined behaviour',
    'Function is optimized',
    'Function is not optimized',
    'Function is always optimized',
    'Function is never optimized',
    'Function is maybe deoptimized'
];

function getOptimizationStatus(fn) {
    var status = %GetOptimizationStatus(fn);
    return {
        status: status,
        message: optimizationStatusMessages[status]
    };
}

//Fill type-info
parser.parse('<div></div>');

%OptimizeFunctionOnNextCall(parser.parse);
//The next call
parser.parse('<div></div>');

//Check
var status = getOptimizationStatus(parser.parse);
console.log(status.message);

if (status.status !== 1 && status.status !== 3) {
    process.exit(1);
}
process.exit(0);
