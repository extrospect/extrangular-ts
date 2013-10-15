/// <reference path="../lib/typings/angular/angular.d.ts" />
/// <reference path="../lib/typings/requirejs/require.d.ts" />
'use strict';

export function start() {
    // Declare app level module which depends on filters, and services
    angular.module('testApp', []).
        directive('testDirective', function() {
            return {
                template: '<div>HELLO!!!</div><br /><button ng-click="loadLate()">Load Late Module</button>',
                link: function(scope) {
                    scope.loadLate = function() {
                        require(["late"], function(lateModule) {
                            lateModule.init();
                        });
                    };
                }
            }
        });

    angular.bootstrap(document.body, ['testApp']);
}
