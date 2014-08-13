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
/**
 * [Block description]
 * @class [description]
 */
function Block() {
    this.descs = [];
    this.tags = {};
}

Block.prototype = {
    /**
     * [addDesc description]
     * @param {[type]} desc [description]
     * @class
     * @method
     */
    addDesc: function(desc) {
        this.descs.push(desc);
    },
    /**
     * [addTag description]
     * @param {[type]} name  [description]
     * @param {[type]} value [description]
     * @method [name]
     * @class [description]
     */
    addTag: function(name, value) {
        this.tags[name] = value;
    },
    /**
     * [getTag description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     * @method
     * @class [description]
     */
    getTag: function(name) {
        return this.tags[name];
    }
};

/**
 * [parse description]
 * @param  {[type]} blockStr [description]
 * @return {[type]}          [description]
 */
function parse(blockStr) {
    var block = new Block();
    var lines = blockStr.split(/\n/mg);
    var lineReg = /^\s*\*\s*/;
    lines.forEach(function(line) {
        if (lineReg.test(line)) {
            if (/^\s*\*\s*@(\w+)\s*([^\r\n]+)?/.test(line)) {
                block.addTag(RegExp.$1, RegExp.$2 || "");
            } else {
                block.addDesc(line.replace(lineReg, ''));
            }
        }
    });

    return block;
}

module.exports = function(source, options) {

    var opt = extend({
        //default options 
    }, options || {});

    var blocks = [];

    var line, lines = source.split(/\n/mg),
        lineLen = lines.length;

    var inBlocking, curBlock, closeBlockIdx;

    for (var i = 0; i < lineLen; ++i) {
        line = lines[i].trim();
        if (line.startsWith('/**')) {
            inBlocking = true;
            curBlock = new Block();
        } else if (line.startsWith('*/')) {
            inBlocking = false;
            closeBlockIdx = i;
        } else if (!inBlocking && (1 === i - closeBlockIdx) && /(\bfunction\b\s*?(\w+?)\s*\(([^\(\)]*)\))|((\w+)?\s*(?::|=)\s*function\(([^\(\)]*)\))/.test(line)) {
            curBlock.function = RegExp.$2 || RegExp.$5;
            curBlock.funcParams = RegExp.$3 || RegExp.$6;
            blocks.push(curBlock);
            curBlock = null;
        } else if (inBlocking) {
            line = line.replace(/^\*/, '').trim();
            if (/^@(\w+)?\s*([^\r\n]+)?/.test(line)) {
                curBlock.addTag(RegExp.$1, RegExp.$2);
            } else {
                curBlock.addDesc(line);
            }
        }

    }//for

    //handle
    //doc based on methods
    //split out classes with their own methods,methods without own class
    
    //todo

    console.log("\nLINE:" + lines.length);
    console.log(blocks);

    return blocks;
};