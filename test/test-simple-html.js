var assert = require('chai').assert;
var createTestParser = require('./lib/test-parser');



describe('Simple examples', function () {
    describe('when called with string containing only a comment', function () {
        it('should not execute any callbacks', function () {
            var testParser = createTestParser();

            testParser.parser.parse('<!-- foobar -->');
            assert.isFalse(testParser.start.called);
            assert.isFalse(testParser.end.called);
            assert.isFalse(testParser.data.called);
        });
    });

    describe('when called with just one element', function () {
        var testParser = null;

        beforeEach(function () {
            testParser = createTestParser();
            testParser.parser.parse('<div></div>');
        });

        it('should execute start and end callbacks once', function () {
            assert.equal(testParser.start.callCount, 1);
            assert.equal(testParser.end.callCount, 1);
        });

        it('should execute start callback with tagname', function () {
            assert.isTrue(testParser.start.calledWith('div'));
        });
    });


    describe('when called with just one element carrying attributes', function () {

        it('should execute start callback with attribute string', function () {
            var testParser = createTestParser();

            testParser.parser.parse('<div bar="foo" foo="bar" foobar></div>');
            assert.equal(testParser.start.firstCall.args[1], 'bar="foo" foo="bar" foobar');
        });
    });

    describe('when called with just one element containing text', function () {
        var testParser = null;

        beforeEach(function () {
            testParser = createTestParser();
            testParser.parser.parse('<div>foobar</div>');
        });

        it('should execute data callback once', function () {
            assert.equal(testParser.data.callCount, 1);
        });

        it('should pass text content to data callback', function () {
            assert.equal(testParser.data.firstCall.args[0], 'foobar');
        });
    });

    describe('when called with self-closing elements', function () {
        var selfClosing = require('../lib/elements/selfClosing');
        var testParser = null;

        beforeEach(function () {
            testParser = createTestParser();
            tagNames = Object.keys(selfClosing);

            markup = tagNames.map(function(tagName){
                return '<' + tagName + ' />';
            }).join('');

            testParser.parser.parse(markup);
        });

        afterEach(function () {
            tagNames = null;
            markup = null;
        });

        it('should not execute end callbacks', function () {
            assert.isFalse(testParser.end.called);
        });


        it('should execute start callback once per element', function () {
            assert.equal(testParser.start.callCount, tagNames.length);
        });

        it('should execute start callback with correct tag names', function () {
            var encounteredTags = testParser.start.args.map(function (args) {
                return args[0];
            });
            assert.sameMembers(encounteredTags, tagNames);
        });
    });

    describe('when called with script/style element', function () {
        var testParser = null;

        beforeEach(function () {
            testParser = createTestParser();
        });

        it('should execute the data callback with the entire style content', function () {
            testParser.parser.parse('<style>body{font-size:16px;}h1{color:red;}</style>');
            assert.equal(testParser.data.firstCall.args[0], 'body{font-size:16px;}h1{color:red;}');
        });

        it('should not break when markup is present in script tags', function () {
            testParser.parser.parse('<script>var a="<p>test</p>";alert(a);</script>');
            assert.equal(testParser.data.firstCall.args[0], 'var a="<p>test</p>";alert(a);');
        });
    });

    describe('when instantiated with parseAttributes=true', function () {
        it('should execute start callback with arguments parsed as object', function () {
            var testParser = createTestParser({ parseAttributes: true });
            testParser.parser.parse('<div id="foo" class="bar baz" foo-bar-baz="baz"></div>');
            var attrs = {
                id: 'foo',
                class: 'bar baz',
                fooBarBaz: 'baz'
            };
            assert.deepEqual(testParser.start.firstCall.args[1], attrs);
        });
    });

});
