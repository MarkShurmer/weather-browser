'use strict';
var GulpConfig = (function () {
    function gulpConfig() {

        this.source = './app/src';
        this.output = './build';

        this.mainOutputPath = this.output;
        this.libOutputPath = this.output + '/lib';
        this.allJavaScript = [this.source + '/**/*.js'];
        this.allLess = [this.source + '/**/*.less'];

        this.typings = './typings/';
        this.libraryTypeScriptDefinitions = './typings/**/*.ts';
    }
    return gulpConfig;
})();
module.exports = GulpConfig;
