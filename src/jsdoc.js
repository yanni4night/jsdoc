/**
 * Copyright (C) 2014 yanni4night.com
 * jsdoc.js
 *
 * changelog
 * 2014-08-12[18:41:03]:authorized
 *
 * @author yanni4night@gmail.com
 * @version 0.1.0
 * @since 0.1.0
 */

"use strict";

var extend = require('extend');
require('string.prototype.startswith');

//create a new comment model

/**
 * [Comment description]
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
     * [setFunc description]
     * @param {[type]} name
     * @param {[type]} params
     * @class Comment
     */
    setFunc: function(name, params) {
        this.func.name = name;
        this.func.params = params;

        this.type = 'func';
    },
    /**
     * [getFunc description]
     *
     * @return {Object}
     */
    getFunc: function() {
        return this.func;
    },
    /**
     * [setAttr description]
     *
     * @param {[type]} name
     * @param {[type]} desc
     * @class Comment
     * @method
     */
    setAttr: function(name) {
        this.attr.name = name;
        this.type = 'attr';
    },
    /**
     * [getAttr description]
     *
     * @return {Object}
     */
    getAttr: function() {
        return this.attr;
    },
    /**
     * [addDesc description]
     * @param {[type]} desc
     * @class Comment
     */
    addDesc: function(desc) {
        this.descs.push(desc);
    },
    /**
     * [addTag description]
     * @param {[type]} name
     * @param {[type]} value
     * @class Comment
     */
    addTag: function(name, value) {
        name = name.trim();
        value = (value || "").trim();
        switch (name) {
            case 'class':
                this.clazz = value;
                break;
            case 'extends':
                this.zuper = value;
                break;
            default:
                //Array
                if (!Array.isArray(this.tags[name])) {
                    this.tags[name] = value;
                } else {
                    this.tags[name].push(value);
                }
        }
    },
    /**
     * [getTag description]
     * @param  {[type]} name
     * @return {[type]}
     * @class Comment
     */
    getTag: function(name) {
        return this.tags[name];
    },
    /**
     * [removeTag description]
     * @param  {String} name
     * @return {Boolean}
     */
    removeTag: function(name) {
        return delete this.tags[name];
    }
};

/**
 * [SourceTextParser description]
 *
 * @class
 * @param {String} sourceText
 * @param {Object} classes
 * @param {Object} methods
 */
function SourceTextParser(sourceText, classes, methods) {
    this.Comments = [];
    this.sourceText = sourceText;

    this.classes = classes;
    this.methods = methods;
}

SourceTextParser.prototype = {
    /**
     * [parse description]
     * @class SourceTextParser
     * @method
     * @return
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
            } else if (!inCommenting && (1 === i - closeCommentIdx) && /(\bfunction\b\s*?(\w+?)\s*\(([^\(\)]*)\))|((\w+)?\s*(?::|=)\s*function\(([^\(\)]*)\))/.test(line)) {
                curComment.setFunc(RegExp.$2 || RegExp.$5, RegExp.$3 || RegExp.$6);
                this.Comments.push(curComment);
                curComment = null;
            } else if (!inCommenting && (1 === i - closeCommentIdx) && /(\w+)\s*(?::|=)(?!\s*function)/.test(line)) {
                curComment.setAttr(RegExp.$1);
                this.Comments.push(curComment);
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
        // console.log(this.Comments);
        this._merge();
    }, //parse
    _merge: function() {
        this.Comments.forEach(function(Comment) {
            var clazz, clazObj, method, isConstructor;
            if (null !== Comment.clazz && undefined !== Comment.clazz) {
                if ('' === Comment.clazz && 'func' === Comment.type) {
                    clazz = Comment.getFunc().name;
                    isConstructor = true;
                } else if ('' === Comment.clazz && 'attr' === Comment.type) {
                    clazz = Comment.getAttr().name;
                } else {
                    clazz = Comment.clazz;
                }
                clazObj = this.classes[clazz] = this.classes[clazz] || {
                    _def: null,
                    _methods: [],
                    _attrs: []
                };
                if (isConstructor) {
                    //this is class function
                    clazObj._def = Comment;
                }

                if (Comment.type === 'func') {
                    clazObj._methods.push(Comment);
                } else if (Comment.type === 'attr') {
                    clazObj._attrs.push(Comment);
                }
            } else {
                //without class,we see it as a homeless method
                this.methods.push(Comment);
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
        homelessMethods = [];

    if (!Array.isArray(source)) {
        source = [source];
    }

    source.forEach(function(s) {
        new SourceTextParser(s, classes, homelessMethods).parse();
    });

    //console.log(classes);
    //console.log(homelessMethods);

    return {
        classes: classes,
        methods: homelessMethods
    };
};