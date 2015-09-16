'use strict';

var handlebars = require('handlebars');

function indent() {
    var indentString = '&nbsp;&nbsp;&nbsp;&nbsp;';
    var result = "";
    for(var i = 0; i < this.level; ++i) {
        result += indentString;
    }

    return new handlebars.SafeString(result);
}

module.exports = indent;