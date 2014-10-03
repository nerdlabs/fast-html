var assert = require('chai').assert;

var parser = require('../');


describe('Basic usage', function () {
    describe('when called without any arguments', function () {
        it('should return undefined', function () {
            var returnVal = parser.parse();
            assert.equal(returnVal, undefined);
        });
    });
});