var assert = require('chai').assert;

var parse = require('../');

var createElementNode = require('./lib/createElementNode');
var createTextNode = require('./lib/createTextNode');

describe('Simple examples', function () {
    describe('when called with empty string', function () {
        it('should return an empty array', function () {
            var returnVal = parse('', createElementNode, createTextNode);
            assert.deepEqual(returnVal, []);
        });
    });

    describe('when called with string containing only a comment', function () {
        it('should return an empty array', function () {
            var returnVal = parse('<!-- foobar -->', createElementNode, createTextNode);
            assert.deepEqual(returnVal, []);
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

        it('should parse the string and return an array containing the element', function () {
            assert.lengthOf(returnVal, 1, 'create just one childNode');
            assert.equal(returnVal[0].tagName, 'div');
        });

        it('the parsed element should not have other children or attributes', function () {
            assert.deepEqual(returnVal[0].attributes, {});
            assert.lengthOf(returnVal[0].childNodes, 0);
        });
    });


    describe('when called with just one element carrying attributes', function () {
        it('should have a corresponding attribute object', function () {
            var returnVal = parse('<div bar="foo" foo="bar" foobar></div>', createElementNode, createTextNode);
            assert.deepEqual(returnVal[0].attributes, { 'foo': 'bar' , 'bar': 'foo', 'foobar': true });
        });
    });

    describe('when called with just one element containing text', function () {
        var TextNode = require('./lib/TextNode');
        var returnVal = null;

        beforeEach(function () {
            returnVal = parse('<div bar="foo" foo="bar" foobar>foobar</div>', createElementNode, createTextNode);
        });

        afterEach(function () {
            returnVal = null;
        });

        it('should return an array of one element with one text childNode', function () {
            assert.lengthOf(returnVal[0].childNodes, 1);
            assert.instanceOf(returnVal[0].childNodes[0], TextNode);
        });

        it('should return an array of one element with one text childNode with corresponding contents', function () {
            assert.deepEqual(returnVal[0].childNodes[0], new TextNode('foobar'));
        });
    });

    describe('when called with self-closing elements', function () {
        var elements = require('../lib/elements');

        var markup = null;
        var tagNames = null;
        var returnVal = null;

        beforeEach(function () {
            tagNames = Object.keys(elements.selfClosing);

            markup = tagNames.map(function(tagName){
                return '<' + tagName + ' />';
            }).join('');

            returnVal = parse(markup, createElementNode, createTextNode);
        });

        afterEach(function () {
            returnVal = null;
            tagNames = null;
            markup = null;
        });

        it('should return an array of elements with the correct length', function () {
            assert.lengthOf(returnVal, Object.keys(elements.selfClosing).length);
        });


        it('should return an array with an element for each passed childNode', function () {
            var returnedTagNames = returnVal.map(function(childNode){
                return childNode.tagName;
            });

            assert.sameMembers(returnedTagNames, Object.keys(elements.selfClosing));
        });
    });

});
