var assert = require('chai').assert;
var testParser = require('./lib/test-parser')();


describe('Basic usage', function () {
    describe('when called without any arguments', function () {
        it('should not execute any callbacks', function () {
            testParser.parser.parse();
            assert.isFalse(testParser.start.called);
            assert.isFalse(testParser.end.called);
            assert.isFalse(testParser.data.called);
        });
    });
});
