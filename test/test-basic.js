var assert = require('chai').assert;

var parse = require('../');


describe('Basic usage', function () {
    describe('when called without any arguments', function () {
        it('should return undefined', function () {
            var returnVal = parse();
            assert.equal(returnVal, undefined);
        });
    });
});
