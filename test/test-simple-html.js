var assert = require('chai').assert;

var parse = require('../').parse;
var createElementNode = require('./lib/createElementNode');
var createTextNode = require('./lib/createTextNode');


describe('Simple examples', function () {
    describe('when called with empty string', function () {
        it('should return an empty root-node', function () {
            var returnVal = parse('', createElementNode, createTextNode);
            assert.equal(returnVal.tagName, null);
            assert.deepEqual(returnVal.attributes, {});
            assert.deepEqual(returnVal.childNodes, []);
        });
    });

    describe('when called with just one element', function () {
        var returnVal = null;

        beforeEach(function () {
            returnVal = parse('<div></div>', createElementNode, createTextNode);
        });

        afterEach(function () {
            returnVal = null;
        });

        it('should parse the string and return the element as childNode of root-node', function () {
            assert.equal(returnVal.childNodes.length, 1, 'create just one childNode');
            assert.equal(returnVal.childNodes[0].tagName, 'div');
        });

        it('should have empty attributes and childNodes', function () {
            assert.deepEqual(returnVal.childNodes[0].attributes, {});
            assert.equal(returnVal.childNodes[0].childNodes.length, 0);
        });
    });
});
