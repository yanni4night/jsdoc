/**
 * Copyright (C) 2014 yanni4night.com
 * Gruntfile.js
 *
 * changelog
 * 2014-08-12[18:17:11]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                multistr: true,
                strict: true, //use strict
                node: true //module,require,console
            },
            js: ['src/*.js', 'test/*.js']
        },
        watch: {
            libjs: {
                files: ['src/*.js', 'test/*.js', 'test/source/*'],
                tasks: ['test']
            }
        },
        nodeunit: {
            js: ['test/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('test', ['jshint', 'nodeunit']);
};