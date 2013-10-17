define(["require", "exports", 'appController'], function(require, exports, __appController__) {
    /// <reference path="../../lib/typings/angular/angular.d.ts" />
    /// <reference path="../../lib/typings/requirejs/require.d.ts" />
    'use strict';

    // NOTE: Using import/require to tell Typescript to add this to the AMD module definition it creates
    var appController = __appController__;
    function start() {
        // Declare app level module which depends on filters, and services
        angular.module('testApp', []).directive('appDirective', [
            function () {
                return {
                    template: '<div ng-repeat="text in textLog">' + '<span class="consoleText">{{text}}</span></div>' + '<div><table><tr><td>{{inputPromptText}}</td><td>' + '<span class="consoleText">{{currentCommand}}</span>' + '<span class="blink">&nbsp;</span>' + '</td></tr></table></div>',
                    controller: 'AppController'
                };
            }
        ]).factory('appService', function () {
            return {
                test: function (msg) {
                    alert('(AppService) ' + msg);
                }
            };
        }).factory('consoleTextService', function () {
            var currentId = 0, listeners = [];

            return {
                writeLine: function (text) {
                    var i = 0, len = listeners.length;
                    for (; i < len; i++) {
                        listeners[i].fn.call(listeners[i].scope || this, text);
                    }
                },
                addListener: function (listener, scope) {
                    var id = ++currentId, listenerObj;

                    listenerObj = {
                        id: ++currentId,
                        fn: listener,
                        scope: scope
                    };

                    listeners.push(listenerObj);

                    return function () {
                        var i = 0, len = listeners.length;
                        for (; i < len; i++) {
                            if (listeners[i].id === id) {
                                listeners.splice(i, 1);
                                break;
                            }
                        }
                    };
                }
            };
        }).value('inputPromptText', 'C:/Extrali/WebClient/AngularJS> ').controller('AppController', ['$scope', '$document', 'inputPromptText', 'appService', 'consoleTextService', appController.AppController]);

        // NOTE: Bootstrap is being applied manually here - I believe angular has a 'trick' to defer automatic bootstrap
        // when using require.js (involves setting window.name to NG_DEFER_BOOTSTRAP or something similar).
        angular.bootstrap(document.body, ['testApp']);
    }
    exports.start = start;
});
