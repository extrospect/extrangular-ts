/// <reference path="../lib/typings/angular/angular.d.ts" />

export function init() {
    angular.module('lazyModuleA', [])
        .directive('lazyDirectiveA', ['appService', function(appService) {
            var t = appService.test(<any>7);
        return {
            template: '<div>[LAZY MODULE A][AppService] 7 => ' + t + '</div>'
        };
    }]).config(function($provide) {
            console.log('configging!');
        }).factory('lazyServiceA', function() {
            return {
                test: function(n) {
                    return n * 5;
                },
                setupLateDirective: function() {
                    setupLateDirective();
                }
            };
        });

    var setupLateDirective = function() {
        angular.module('lazyModuleA').directive('lazyDirectiveA2', ['lazyServiceB', function(lazyServiceB) {
            var t = lazyServiceB.test(<any>7);
            return {
                template: '<div>[LAZY MODULE A][LazyServiceB] 7 => ' + t + '</div>'
            };
        }]);

        // create an injector to get at the compile, document, and rootScope services
        // IMPORTANT: This has to be excuted against the root/application module (the parent of this module
        // and the module that the injected services comes from
        var $injector = angular.injector(['ng', 'testApp']);

        // use the injector to trigger a re-compile and digest on the application/document
        $injector.invoke(function($rootScope, $compile, $document){
            $compile($document)($rootScope);
            $rootScope.$digest();
        });

        setupLateDirective = function() {};
    }

    // Declare a dependency from the main app module to this late loaded module (seems unnecessary)

    angular.module('testApp').requires = angular.module('testApp').requires.concat(['lazyModuleA']);

    // create an injector for the late-loading module ('ng' must ALWAYS be the first module listed in angular.injector)
    var $injector = angular.injector(['ng', 'testApp']);

    // use the injector to trigger a re-compile and digest on the application/document
    $injector.invoke(function($rootScope, $compile, $document){
        $compile($document)($rootScope);
        $rootScope.$digest();
    });
}
