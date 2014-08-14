jsdoc
=====

Create doc from javascript source files.

We support the regular javascript block comment syntax.

What we changed is you have to indicate the class name instead of 
parsing it,because javascript syntax is so flexible.


This library just output the base comment object structure instead of some HTML pages.

usage
=====

    var jsdoc = require('yjsdoc');
    var docs = jsdoc([filecontent1,filecontent2...]);
    console.log(docs);

We will get a object:

    {
        "classes": {
            "Cat": {
                "_def": {
                    "type": "func",
                    "descs": [
                        "This is the demo description for Cat class.",
                        ""
                    ],
                    "attr": {
                        "name": null
                    },
                    "func": {
                        "name": "Cat",
                        "params": ""
                    },
                    "clazz": "",
                    "zuper": null,
                    "tags": {}
                },
                "_methods": {},
                "_attrs": {
                    "smile": {
                        "type": "attr",
                        "descs": [
                            "Smail cat",
                            ""
                        ],
                        "attr": {
                            "name": "smile"
                        },
                        "func": {
                            "name": null,
                            "params": null
                        },
                        "clazz": "Cat",
                        "zuper": null,
                        "tags": {}
                    }
                }
            },
            "Parser": {
                "_def": null,
                "_methods": {
                    "parse": {
                        "type": "func",
                        "descs": [
                        "This is the demo description for the method 'parse'    of class 'Parser'.",
                            ""
                        ],
                        "attr": {
                            "name": null
                        },
                        "func": {
                            "name": "parse",
                            "params": "d, x"
                        },
                        "clazz": "Parser",
                        "zuper": null,
                        "tags": {
                            "param": [
                                "{String} d",
                                "{String} x"
                            ],
                            "throws": [
                                "{Error} If [this condition is met]",
                                "{Error} If [this condition is met]"
                            ],
                            "return": "{String} The out put string parsed.",
                            "since": "0.1.0"
                        }
                    },
                    "out": {
                        "type": "func",
                        "descs": [
                        "This is the demo description for the method 'out' of   class 'Parser'.",
                            ""
                        ],
                        "attr": {
                            "name": null
                        },
                        "func": {
                            "name": "out",
                            "params": "mark, deep"
                        },
                        "clazz": "Parser",
                        "zuper": null,
                        "tags": {
                            "param": [
                                "{String} mark The marker.",
                                "{Boolean} deep If need deep."
                            ],
                            "return": "{String} The output string."
                        }
                    }
                },
                "_attrs": {
                    "version": {
                        "type": "attr",
                        "descs": [
                            "Version description.",
                            ""
                        ],
                        "attr": {
                            "name": "version"
                        },
                        "func": {
                            "name": null,
                            "params": null
                        },
                        "clazz": "Parser",
                        "zuper": null,
                        "tags": {}
                    },
                    "multiple": {
                        "type": "attr",
                        "descs": [
                            "Multiple",
                            ""
                        ],
                        "attr": {
                            "name": "multiple"
                        },
                        "func": {
                            "name": null,
                            "params": null
                        },
                        "clazz": "Parser",
                        "zuper": null,
                        "tags": {}
                    }
                }
            }
        },
        "methods": {
            "fly": {
                "type": "func",
                "descs": [
                    "This is a demo description for fly function",
                    ""
                ],
                "attr": {
                    "name": null
                },
                "func": {
                    "name": "fly",
                    "params": "name"
                },
                "clazz": null,
                "zuper": null,
                "tags": {
                    "param": [
                        "{String} name The name of object."
                    ],
                    "return": "{Boolean} True"
                }
            }
        }
    }

`classes` means the *class* defination,each has a `_methods` member and a `_attrs` member,_may_ has a `_def` member.

`methods` means the *function* that not belongs to any class.

For each *function* or *attr*,it has a `descs` member which is an array,a `type` member equals _func_ or _attr_,a `func` member stores the function infomation if its type equals 'func',an `attr` member stores the attribute information if its type equals 'attr',a `tag` member stores the @tags,like "@param","@since" etc,a `clazz` member indicates the class it belongs to,a `zuper` indicates its super class if it is a constructor.

syntax
=====

We support multiple comment template:

###### Functions
    /**
     * Parse the source text to Comment structure.
     *
     * @since 0.1.0
     * @class SourceTextParser
     * @return {Undefined}
     */
    parse: function() {}

    /**
     * Parse the source text to Comment structure.
     *
     * @since 0.1.0
     * @class SourceTextParser
     * @return {Undefined}
     */
    var parse = function() {}

    /**
     * Parse the source text to Comment structure.
     *
     * @since 0.1.0
     * @return {Undefined}
     */
    function parse () {}


###### Attributes

    /**
     * Version description.
     * 
     * @type {Integer}
     * @class Parser
     * @since 0.1.0
     */
    version : 0x0810

    /**
     * Version description.
     * 
     * @type {Integer}
     * @class Parser
     * @since 0.1.0
     */
    Parser.version = 0x0810


*Remember tag the `class` if the function/attribute belongs to a class defination.*

tags
=====

The following tags are allowed to show only once:
`return`,`copyright`,`author`,`since`,`description`,`example`,`version`,`override`,`todo`,`deprecated`

The following tags are allowd to show twice and more:
`param`,`see`,`throws`

we ignore other tags

changelog
=====
 - 2014-08-14[11:33:27]:first publish version,better format output

contact
=====
- <yanni4night@gmail.com>