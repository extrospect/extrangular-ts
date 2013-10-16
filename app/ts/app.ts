/// <reference path="../lib/typings/angular/angular.d.ts" />
/// <reference path="../lib/typings/requirejs/require.d.ts" />
'use strict';

export function start() {
    // Declare app level module which depends on filters, and services
    angular.module('testApp', [])
        .directive('appDirective', ['appService', function(appService) {
            return {
                template: '<div>[APP][AppService] 7 => {{test}}</div>',
                link: function(scope) {
                    scope.test = appService.test(7);
                }
            }
        }])
        .directive('testDirective', function() {
            return {
                template: '<button ng-click="loadLateModuleA()">Load Lazy Module A</button>',
                link: function(scope) {
                    scope.loadLateModuleA = function() {
                        loadLateModuleA();
                    }
                }
            }
        }).factory('appService', function() {
            return {
                test: function(n) {
                    return n * 2;
                }
            };
        });

    angular.bootstrap(document.body, ['testApp']);

    var loadLateModuleA = function() {
        require(["lazy-module-a"], function(lateModule) {
            lateModule.init();
            lateRegDirective();
        });

        // Make this a one-shot function so it can't be re-invoked
        loadLateModuleA = function() {};
    }

    function lateRegDirective() {
        angular.module('testApp').directive('lazyAppDirective', ['lazyServiceA', function(lazyServiceA) {
            var t = lazyServiceA.test(<any>7);
            return {
                template: '<div>[APP][LazyServiceA] 7 => ' + t + '</div>' +
                    '<br />' +
                    '<button ng-click="loadLateModuleB()">Load Lazy Module B</button>',
                link: function(scope) {
                    scope.loadLateModuleB = function() {
                        loadLateModuleB(lazyServiceA.setupLateDirective);
                    }
                }
            };
        }]);

        // create an injector to get at the compile, document, and rootScope services
        var $injector = angular.injector(['ng', 'testApp']);

        // use the injector to trigger a re-compile and digest on the application/document
        $injector.invoke(function($rootScope, $compile, $document){
            $compile($document)($rootScope);
            $rootScope.$digest();
        });
    }

    var loadLateModuleB = function(setupLateDirective) {
        require(["lazy-module-b"], function(lateModule) {
            lateModule.init();
            setupLateDirective();
        });

        // Make this a one-shot function so it can't be re-invoked
        loadLateModuleB = function() {};
    }
}
