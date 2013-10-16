/// <reference path="../../../lib/typings/angular/angular.d.ts" />
define(["require", "exports"], function(require, exports) {
    function init() {
        angular.module('pluginA', []);

        // Declare a dependency from the main app module to this late loaded module
        angular.module('testApp').requires = angular.module('testApp').requires.concat(['pluginA']);

        // create an injector for the late-loading module ('ng' must ALWAYS be the first module listed in angular.injector)
        var $injector = angular.injector(['ng', 'testApp']);

        // use the injector to trigger a re-compile and digest on the application/document
        $injector.invoke(function ($rootScope, $compile, $document) {
            // IMPORTANT: Compile clears all data from the DOM/scopes it processes
            //$compile($document)($rootScope);
            $rootScope.$digest();
        });

        alert('Plugin A Loaded!');
    }
    exports.init = init;
});
