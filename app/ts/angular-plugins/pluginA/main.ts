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

    // NOTE: Declare a dependency from the main app module to this late loaded module
    angular.module('testApp').requires = angular.module('testApp').requires.concat(['pluginA']);

    // NOTE: Create an injector for the late-loading module ('ng' must ALWAYS be the first module listed in angular.injector)
    var $injector = angular.injector(['ng', 'testApp']);

    // Optionally, use the injector to trigger a re-compile and digest on the application/document
    $injector.invoke(function($rootScope, $compile, $document){
        // IMPORTANT: Compile clears all data from the DOM/scopes it processes
        var directiveElement = $document[0].getElementById('pluginADirective')
        $compile(directiveElement)($rootScope);
        $rootScope.$digest();
    });
}