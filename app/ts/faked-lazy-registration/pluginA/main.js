/// <reference path="../../../lib/typings/angular/angular.d.ts" />
define(["require", "exports", 'pluginA/Services/serviceA', 'pluginA/pluginADirective'], function(require, exports, __serviceA__, __pluginADirective__) {
    // NOTE: Using import/require to tell Typescript to add this to the AMD module definition it creates
    var serviceA = __serviceA__;
    var pluginADirective = __pluginADirective__;
    function init() {
        angular.module('pluginA', []).factory('pluginAServiceA', ['consoleTextService', serviceA.PluginAServiceA]).directive('pluginADirective', [
            'consoleTextService',
            function (consoleTextService) {
                return new pluginADirective.PluginADirective(consoleTextService);
            }
        ]);
    }
    exports.init = init;
});
