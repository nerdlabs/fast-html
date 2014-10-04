var assert = require('chai').assert;

var camelCase = require('../lib/utils/camelCase');

describe('camelCase utility', function () {
    describe('when called with an empty string', function(){
        it('should return an empty string', function () {
            var returnVal = camelCase('');
            assert.equal(returnVal, '');
        });
    });

    describe('when called with a kebapcased string', function () {
        describe('with one part', function(){
            it('should return the same string', function () {
                var returnVal = camelCase('kebap-');
                assert.equal(returnVal, 'kebap-');
            });
        });

        describe('with two parts', function(){
            it('should return a camelCased string', function () {
                var returnVal = camelCase('kebap-case-string');
                assert.equal(returnVal, 'kebapCaseString');
            });
        });

        describe('with n parts', function(){
            it('should return a camelCased string', function () {
                var returnVal = camelCase('kebap-case-string-kebap-case-string-kebap-case-string');
                assert.equal(returnVal, 'kebapCaseStringKebapCaseStringKebapCaseString');
            });
        });
    });

    describe('when called with a non-kepabcased string', function () {
        it('should return the same string', function () {
            var returnVal = camelCase('kebapcase');
            assert.equal(returnVal, 'kebapcase');
        });
    });
});
