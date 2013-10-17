/// <reference path="../../lib/typings/requirejs/require.d.ts" />
define(["require", "exports"], function(require, exports) {
    // NOTE: When you export a class, the constructor is accessed via <importedModuleVar>.<className>()
    var AppController = (function () {
        function AppController($scope, $document, inputPromptText, appService, consoleTextService, $rootScope, $compile) {
            var _this = this;
            this.$scope = $scope;
            this.$document = $document;
            this.inputPromptText = inputPromptText;
            this.appService = appService;
            this.consoleTextService = consoleTextService;
            this.$rootScope = $rootScope;
            this.$compile = $compile;
            this.loadPluginA = function () {
                require(["pluginA/main"], function (pluginModule) {
                    pluginModule.init();

                    var directiveElement = _this.$document[0].getElementById('pluginADirective');
                    _this.$compile(directiveElement)(_this.$rootScope);
                    _this.$rootScope.$digest();
                });

                // Make this a one-shot function so it can't be re-invoked
                _this.loadPluginA = function () {
                };
            };
            this.$scope.inputPromptText = inputPromptText;

            this.$scope.textLog = [];
            this.$scope.commandLog = [];
            this.$scope.commandHistoryIndex = -1;

            this.$scope.currentCommand = '';
            this.$scope.currentCommandBackup = '';

            $document.bind("keydown keypress", function (event) {
                if (event.keyCode === 8) {
                    // Stop browser navigating back
                    event.preventDefault();
                }
            });

            $document.bind('keydown', function (event) {
                var keyCode = event.keyCode, keyChar = String.fromCharCode(event.keyCode), shiftHeld = event.shiftKey, commandModification;

                if (keyChar.length) {
                    if (keyCode >= 65 && keyCode <= 90) {
                        // A-Z
                        commandModification = (shiftHeld ? keyChar : keyChar.toLowerCase());
                    } else if (keyCode >= 48 && keyCode <= 57) {
                        // 0-9
                        commandModification = (shiftHeld ? '' : keyChar);
                    } else {
                        switch (keyCode) {
                            case 8:
                                // Backspace
                                commandModification = function () {
                                    this.$scope.currentCommand = this.$scope.currentCommand.slice(0, -1);
                                };
                                break;
                            case 32:
                                // Space
                                commandModification = ' ';
                                break;
                            case 13:
                                // Return
                                commandModification = function () {
                                    this.$scope.execCommand();
                                };
                                break;
                            case 38:
                                // Up arrow
                                commandModification = function () {
                                    this.commandHistoryLoop(-1);
                                };
                                break;
                            case 40:
                                // Down arrow
                                commandModification = function () {
                                    this.commandHistoryLoop(1);
                                };
                                break;
                        }
                    }

                    if (commandModification) {
                        _this.$scope.$apply(function () {
                            if (typeof commandModification === 'string') {
                                _this.$scope.currentCommand += commandModification;
                            } else {
                                commandModification.call(_this);
                            }
                        });
                    }
                }
            });

            this.$scope.execCommand = function () {
                var command = _this.$scope.currentCommand;
                _this.$scope.commandLog.push(command);
                _this.$scope.textLog.push(_this.inputPromptText + command);

                _this.$scope.currentCommand = '';
                _this.$scope.commandHistoryIndex = -1;

                command = command.trim();
                _this.getCommandAction(command)();
            };

            (consoleTextService.addListener)(function (text) {
                var _this = this;
                (this).$scope.$apply(function () {
                    (_this).$scope.textLog.push(text);
                });
            }, this);
        }
        AppController.prototype.getCommandAction = function (command) {
            var output = function () {
                (this).badCommand(command);
            };

            if (command.indexOf('load pluginA') === 0) {
                output = this.loadPluginA;
            } else if (command.indexOf('load pluginA') === 0) {
                output = this.loadPluginB;
            } else if (command.indexOf('apptest') === 0) {
                output = function () {
                    var text = command.slice(8);
                    this.appService.test(text);
                };
            } else if (command.indexOf('restart') === 0) {
                output = function () {
                    location.reload();
                };
            } else if (command.indexOf('quit') === 0) {
                output = function () {
                    window.location.assign("http://www.google.com");
                };
            }

            return output.bind(this);
        };

        AppController.prototype.commandHistoryLoop = function (delta) {
            var maxIndex = this.$scope.commandLog.length - 1;

            if (this.$scope.commandHistoryIndex === -1) {
                this.$scope.currentCommandBackup = this.$scope.currentCommand;
            }

            this.$scope.commandHistoryIndex += delta;
            if (this.$scope.commandHistoryIndex < -1) {
                this.$scope.commandHistoryIndex = maxIndex;
            } else if (this.$scope.commandHistoryIndex > maxIndex) {
                this.$scope.commandHistoryIndex = -1;
            }

            if (this.$scope.commandHistoryIndex === -1) {
                this.$scope.currentCommand = this.$scope.currentCommandBackup;
            } else {
                this.$scope.currentCommand = this.$scope.commandLog[this.$scope.commandHistoryIndex];
            }
        };

        AppController.prototype.loadPluginB = function () {
            alert('Loading Plugin B...');
        };

        AppController.prototype.badCommand = function (command) {
            var errorMsg = '', pick = Math.floor(Math.random() * 5);

            switch (pick) {
                case 0:
                    errorMsg = 'Incorrect syntax near \'' + command + '\'';
                    break;
                case 1:
                    errorMsg = 'Something went wrong';
                    break;
                case 2:
                    errorMsg = 'R Tape loading error';
                    break;
                case 3:
                    errorMsg = 'I\'m busy, try again later!';
                    break;
                default:
                    errorMsg = '¿¿¿Why would you do that???';
                    break;
            }

            this.$scope.textLog.push(errorMsg);
        };
        return AppController;
    })();
    exports.AppController = AppController;
});
