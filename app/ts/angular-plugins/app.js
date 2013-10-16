define(["require", "exports"], function(require, exports) {
    /// <reference path="../../lib/typings/angular/angular.d.ts" />
    /// <reference path="../../lib/typings/requirejs/require.d.ts" />
    'use strict';

    function start() {
        // Declare app level module which depends on filters, and services
        angular.module('testApp', []).directive('appDirective', [
            'appService',
            '$document',
            function (appService, $document) {
                var inputText = 'C:/Extrali/WebClient/AngularJS > ';
                return {
                    template: '<div ng-repeat="command in commands">{{command}}</div>' + '<div><table><tr><td>' + inputText + '</td><td>' + '<form ng-submit="execCommand()"><input type="text" ' + 'ng-model="data.currentCommand" /></form></td></tr></table></div>',
                    link: function (scope) {
                        scope.commands = [];

                        scope.data = {
                            currentCommand: ''
                        };

                        scope.execCommand = function () {
                            var command = scope.data.currentCommand;
                            scope.commands.push(inputText + command);
                            scope.data.currentCommand = '';

                            switch (command) {
                                case 'load pluginA':
                                    loadPluginA();
                                    break;
                                case 'load pluginB':
                                    loadPluginB();
                                    break;
                                default:
                                    badCommand(command);
                                    break;
                            }

                            function loadPluginB() {
                                alert('Loading Plugin B...');
                            }

                            function badCommand(command) {
                                var errorMsg = '', pick = Math.floor(Math.random() * 0);

                                switch (pick) {
                                    case 0:
                                        errorMsg = 'Incorrect syntax near \'' + command + '\'';
                                        break;
                                }

                                scope.commands.push(errorMsg);
                            }
                        };
                    }
                };
            }
        ]).factory('appService', function () {
            return {
                test: function (msg) {
                    console.log('(AppMessage) ' + msg);
                }
            };
        });

        angular.bootstrap(document.body, ['testApp']);

        var loadPluginA = function () {
            require(["pluginA/main"], function (pluginModule) {
                pluginModule.init();
                pluginModule.varTest();
            });

            // Make this a one-shot function so it can't be re-invoked
            loadPluginA = function () {
            };
        };
    }
    exports.start = start;
});
