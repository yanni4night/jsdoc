/**
 * Copyright (C) 2014 yanni4night.com
 * test.js
 *
 * changelog
 * 2014-08-12[18:31:36]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

'use strict';

var grunt = require('grunt');
var jsdoc = require('../src/jsdoc');
/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.jsdoc = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    html: function(test) {

        var comment = grunt.file.read(__dirname + '/source/demo.js');
        var docs = jsdoc(comment);

        test.deepEqual(2, Object.keys(docs.classes).length);

        test.ok(!!docs.classes.Parser);
        test.ok(!docs.classes.Parser._def);
        test.deepEqual(2, docs.classes.Parser._methods.length);
        test.deepEqual(2, docs.classes.Parser._attrs.length);

        test.ok(!!docs.classes.Cat);
        test.ok(!!docs.classes.Cat._def);
        test.deepEqual(1, docs.classes.Cat._attrs.length);

        test.deepEqual(1, docs.methods.length);
        test.done();
    }
};