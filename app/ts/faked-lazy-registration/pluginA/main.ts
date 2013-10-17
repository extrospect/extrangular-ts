/// <reference path="../../../lib/typings/angular/angular.d.ts" />

// NOTE: Using import/require to tell Typescript to add this to the AMD module definition it creates
import serviceA = require('pluginA/Services/serviceA');
import pluginADirective = require('pluginA/pluginADirective');
export function init() {
    angular.module('pluginA', [])
        .factory('pluginAServiceA', ['consoleTextService', serviceA.PluginAServiceA])
        .directive('pluginADirective', ['consoleTextService', function(consoleTextService) {
            return new pluginADirective.PluginADirective(consoleTextService);
        }]);
}