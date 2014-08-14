/**
 * Copyright (C) 2014 yanni4night.com
 * jsdoc.js
 *
 * changelog
 * 2014-08-12[18:41:03]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.1
 * @since 0.1.0
 */

"use strict";

var extend = require('extend');
require('string.prototype.startswith');


function isNullOrUndefined(obj) {
    return null === obj || undefined === obj;
}

/**
 * Comment is a block of source comemnt.
 *
 * As comment is only for function(class) and attribute,
 * so we define a type which indicates what type it is.
 * For different,'attr'/'func' saves the real payload data.
 *
 * @class
 * @since 0.1.0
 * @version 0.1.0
 */
function Comment() {
    this.type = 'func'; //func or attr

    this.descs = [];
    this.attr = {
        name: null
    };
    this.func = {
        name: null,
        params: null
    };

    this.clazz = null; //class
    this.zuper = null; //super
    this.tags = {
        /*
        name:[val1,val2]
    */
    };
}


Comment.prototype = {
    /**
     * Set the function
     *
     * @param {String} name
     * @param {String} params
     * @class Comment
     * @since 0.1.0
     */
    setFunc: function(name, params) {
        this.func.name = name;
        this.func.params = params;

        this.type = 'func';
    },
    /**
     * Get function
     *
     * @return {Object}
     * @since 0.1.0
     * @class  Comment
     */
    getFunc: function() {
        return this.func;
    },
    /**
     * Set the attribute.
     *
     * @param {String} name
     * @since 0.1.0
     * @class Comment
     */
    setAttr: function(name) {
        this.attr.name = name;
        this.type = 'attr';
    },
    /**
     * Get the attributes
     *
     * @class  Comment
     * @since 0.1.0
     * @return {Object}
     */
    getAttr: function() {
        return this.attr;
    },
    /**
     * Add a description.
     *
     * @param {String} desc
     * @class Comment
     * @since 0.1.0
     */
    addDesc: function(desc) {
        this.descs.push(desc);
    },
    /**
     * Add a tag except 'class','extends'
     *
     * @param {String} name
     * @param {String} value
     * @class Comment
     * @since 0.1.0
     */
    addTag: function(name, value) {
        name = name.trim();
        value = (value || "").trim();
        switch (name) {
            //The following are single allowed.
            case 'return':
            case 'copyright':
            case 'author':
            case 'since':
            case 'description':
            case 'example':
            case 'version':
            case 'override':
            case 'todo':
            case 'ignore':
            case 'deprecated':
                this.tags[name] = value;
                break;
                //The following are multiple allowed
            case 'param':
            case 'see':
            case 'throws':
                if (!Array.isArray(this.tags[name])) {
                    this.tags[name] = [value];
                } else {
                    this.tags[name].push(value);
                }
                break;
                //The following are meaning stuff.
            case 'class':
                this.clazz = value;
                break;
            case 'extends':
                this.zuper = value;
                break;
            default:
                //ignore others
        }
    },
    /**
     * Get the tag named [name]
     *
     * @param  {String} name
     * @return {String}
     * @since 0.1.0
     * @class Comment
     */
    getTag: function(name) {
        return this.tags[name];
    },
    /**
     * Remove a tag
     *
     * @param  {String} name
     * @return {Boolean} If removed succeed
     * @class Comment
     * @since 0.1.0
     */
    removeTag: function(name) {
        return delete this.tags[name];
    }
};

/**
 * Source text parser.
 *
 * @class
 * @param {String} sourceText
 * @param {Object} classes
 * @param {Object} methods
 * @since 0.1.0
 */
function SourceTextParser(sourceText, classes, methods) {
    this.Comments = [];
    this.sourceText = sourceText;

    this.classes = classes;
    this.methods = methods;
}

SourceTextParser.prototype = {
    /**
     * Parse the source text to Comment structure.
     *
     * @since 0.1.0
     * @class SourceTextParser
     * @return {Undefined}
     */
    parse: function() {
        var line, lines = this.sourceText.split(/\n/mg),
            lineLen = lines.length;

        var inCommenting, curComment, closeCommentIdx;

        for (var i = 0; i < lineLen; ++i) {
            line = lines[i].trim();
            if (line.startsWith('/**')) {
                inCommenting = true;
                curComment = new Comment();
                //Comment closed has to starts with "*/"
            } else if (line.startsWith('*/')) {
                inCommenting = false;
                closeCommentIdx = i;
            } else if (!inCommenting && (1 === i - closeCommentIdx) && /(\bfunction\b\s*?(\w+?)\s*\(([^\(\)]*)\))|((\w+)?\s*(?::|=)\s*function\s*\(([^\(\)]*)\))/.test(line)) {
                curComment.setFunc(RegExp.$2 || RegExp.$5, RegExp.$3 || RegExp.$6);
                if ('string' !== typeof curComment.getTag('ignore')) {
                    this.Comments.push(curComment);
                }
                curComment = null;
            } else if (!inCommenting && (1 === i - closeCommentIdx) && /(\w+)\s*(?::|=)(?!\s*function)/.test(line)) {
                curComment.setAttr(RegExp.$1);
                if ('string' !== typeof curComment.getTag('ignore')) {
                    this.Comments.push(curComment);
                }
                curComment = null;
            } else if (inCommenting) {
                line = line.replace(/^\*/, '').trim();
                if (/^@(\w+)([^\r\n]*)/.test(line)) {
                    curComment.addTag(RegExp.$1, RegExp.$2 || "");
                } else {
                    curComment.addDesc(line);
                }
            }

        } //for

        this._merge();
    }, //parse
    _merge: function() {
        this.Comments.forEach(function(Comment) {
            var className, clazObj, method, isConstructor = false;
            if (!isNullOrUndefined(Comment.clazz)) {
                if (!Comment.clazz) {
                    //empty string class means it's a defination
                    isConstructor = true;
                    if ('func' === Comment.type) {
                        className = Comment.getFunc().name;
                    } else {
                        className = Comment.getAttr().name;
                    }
                } else {
                    //Or just a member of a class
                    className = Comment.clazz;
                }
                clazObj = this.classes[className] = this.classes[className] || {
                    _def: null,
                    _methods: {},
                    _attrs: {}
                };
                if (isConstructor) {
                    //this is class function
                    clazObj._def = Comment;
                } else {
                    if ('func' === Comment.type) {
                        clazObj._methods[Comment.func.name] = Comment;
                    } else {
                        clazObj._attrs[Comment.attr.name] = Comment;
                    }
                }

            } else {
                //without clazz,we see it as a homeless method
                if ('func' === Comment.type) {
                    this.methods[Comment.func.name] = Comment;
                }
                //we ignore homeless vars
            }
        }, this);
    } //_merge
};

module.exports = function(source, options) {

    var opt = extend({
        //default options 
    }, options || {});

    var classes = {
            /*
        className:{
            _def:
            _methods:
            _attrs:
        }
    */
        },
        homelessMethods = {};

    if (!Array.isArray(source)) {
        source = [source];
    }

    source.forEach(function(s) {
        new SourceTextParser(s, classes, homelessMethods).parse();
    });

    return {
        classes: classes,
        methods: homelessMethods
    };
};