var parse = require('../');
var createElement = require('./lib/createElementNode');
var createTextNode = require('./lib/createTextNode');

var benchmark = require('htmlparser-benchmark');

var bench = benchmark(function (html, callback) {
    parse(html, createElement, createTextNode);
    callback();
});

bench.on('progress', function (key) {
    console.log('finished parsing ' + key + '.html');
});

bench.on('result', function (stat) {
    var mean = stat.mean().toPrecision(6);
    console.log(mean + ' ms/file ± ' + stat.sd().toPrecision(6));

    if (mean >= 4) {
        console.log('Meh, this is slow and you should feel bad.')
    }

    process.exit(0);
});

