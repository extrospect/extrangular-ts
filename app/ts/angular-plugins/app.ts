/// <reference path="../../lib/typings/angular/angular.d.ts" />
/// <reference path="../../lib/typings/requirejs/require.d.ts" />
'use strict';

export function start() {
    // Declare app level module which depends on filters, and services
    angular.module('testApp', [])
        .directive('appDirective', ['appService', '$document', function(appService, $document) {
            var inputText = 'C:/Extrali/WebClient/AngularJS> ';
            return {
                template: '<div ng-repeat="command in commands">' +
                    '<span class="consoleText">{{command}}</span></div>' +
                    '<div><table><tr><td>' + inputText + '</td><td>' +
                    '<span class="consoleText">{{data.currentCommand}}</span>' +
                    '<span class="blink">&nbsp;</span>' +
                    '</td></tr></table></div>',
                link: function(scope, element) {
                    scope.commands = [];

                    scope.data = {
                        currentCommand: ' '
                    };

                    $document.bind('keyup', function(event) {
                        var keyCode = event.keyCode,
                            keyChar = String.fromCharCode(event.keyCode),
                            shiftHeld = event.shiftKey,
                            commandModification;

                        if(keyChar.length) {
                            if(keyCode >= 65 && keyCode <= 90) {
                                // A-Z
                                commandModification = (shiftHeld ? keyChar : keyChar.toLowerCase());
                            } else if (keyCode >= 48 && keyCode <= 57) {
                                // 0-9
                                commandModification = (shiftHeld ? '' : keyChar);
                            } else {
                                // Special chars
                                switch(keyCode) {
                                    case 8:
                                        // Backspace
                                        commandModification = function() {
                                            scope.data.currentCommand = scope.data.currentCommand.slice(0, -1);
                                        };
                                        break;
                                    case 32:
                                        // Space
                                        commandModification = ' ';
                                        break;
                                    case 13:
                                        // Return
                                        commandModification = function() {
                                            scope.execCommand();
                                        };
                                        break;
                                }
                            }

                            if(commandModification) {
                                scope.$apply(function() {
                                    if(typeof commandModification === 'string') {
                                        scope.data.currentCommand += commandModification;
                                    } else {
                                        commandModification();
                                    }
                                });
                            }
                        }
                    });

                    scope.execCommand = function() {
                        var command = <string>scope.data.currentCommand;
                        scope.commands.push(inputText + command);
                        scope.data.currentCommand = '';

                        command = command.trim();
                        switch(command) {
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
                            var errorMsg = '',
                                pick = Math.floor(Math.random() * 5);

                            switch(pick) {
                                case 0:
                                    errorMsg = 'Incorrect syntax near \'' + command + '\'';
                                    break;
                                case 1:
                                    errorMsg = <string>'Something went wrong';
                                    break;
                                case 2:
                                    errorMsg = <string>'null';
                                    break;
                                case 3:
                                    errorMsg = <string>'I\'m busy, come back later!';
                                    break;
                                default:
                                    errorMsg = <string>'⸘⸘⸘Why did you do that‽‽‽';
                                    break;
                            }

                            scope.commands.push(errorMsg);
                        }
                    };
                }
            }
        }])
        .factory('appService', function() {
            return {
                test: function(msg) {
                    console.log('(AppMessage) ' + msg);
                }
            };
        });

    angular.bootstrap(document.body, ['testApp']);

    var loadPluginA = function() {

        require(["pluginA/main"], function(pluginModule) {
            pluginModule.init();
            pluginModule.varTest();
        });

        // Make this a one-shot function so it can't be re-invoked
        loadPluginA = function() {};
    }
}
