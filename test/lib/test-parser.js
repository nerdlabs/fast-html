var sinon = require('sinon');
var createParser = require('../../');


module.exports = function (options) {
    var parser = createParser(options);

    var onStart = sinon.spy();
    var onEnd = sinon.spy();
    var onData = sinon.spy();

    parser.on('start', onStart);
    parser.on('end', onEnd);
    parser.on('data', onData);

    return {
        start: onStart,
        end: onEnd,
        data: onData,
        parser: parser
    };
};
