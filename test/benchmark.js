var parser = require('../')();

var benchmark = require('htmlparser-benchmark');

var bench = benchmark(function (html, callback) {
    parser.parse(html);
    callback();
});

bench.on('result', function (stat) {
    var mean = stat.mean().toPrecision(6);
    console.log(mean + ' ms/file ± ' + stat.sd().toPrecision(6));

    if (mean >= 4) {
        console.log('Meh, this is slow and you should feel bad.');
    }

    process.exit(0);
});

