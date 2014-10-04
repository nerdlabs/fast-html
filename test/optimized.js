var parse = require('../');
var createElement = require('./lib/createElementNode');
var createTextNode = require('./lib/createTextNode');

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
parse('<div></div>', createElement, createTextNode);

%OptimizeFunctionOnNextCall(parse);
//The next call
parse('<div></div>', createElement, createTextNode);

//Check
var status = getOptimizationStatus(parse);
console.log(status.message);

if (status.status !== 1 && status.status !== 3) {
    process.exit(1);
}
process.exit(0);
