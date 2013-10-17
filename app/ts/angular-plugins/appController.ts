/// <reference path="../../lib/typings/requirejs/require.d.ts" />

// NOTE: When you export a class, the constructor is accessed via <importedModuleVar>.<className>()
export class AppController {
    constructor(private $scope,
                private $document,
                private inputPromptText,
                private appService,
                private consoleTextService) {
        this.$scope.inputPromptText = inputPromptText;

        this.$scope.textLog = [];
        this.$scope.commandLog = [];
        this.$scope.commandHistoryIndex = -1;

        this.$scope.currentCommand = '';
        this.$scope.currentCommandBackup = '';

        $document.bind("keydown keypress", function(event){
            if( event.keyCode === 8 ) {
                // Stop browser navigating back
                event.preventDefault();
            }
        });

        $document.bind('keyup', (event) => {
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
                                this.$scope.currentCommand = this.$scope.currentCommand.slice(0, -1);
                            };
                            break;
                        case 32:
                            // Space
                            commandModification = ' ';
                            break;
                        case 13:
                            // Return
                            commandModification = function() {
                                this.$scope.execCommand();
                            };
                            break;
                        case 38:
                            // Up arrow
                            commandModification = function() {
                                this.commandHistoryLoop(-1);
                            };
                            break;
                        case 40:
                            // Down arrow
                            commandModification = function() {
                                this.commandHistoryLoop(1);
                            };
                            break;
                    }
                }

                if(commandModification) {
                    this.$scope.$apply(() => {
                        if(typeof commandModification === 'string') {
                            this.$scope.currentCommand += commandModification;
                        } else {
                            commandModification.call(this);
                        }
                    });
                }
            }
        });

        this.$scope.execCommand = () => {
            var command = <string>this.$scope.currentCommand;
            this.$scope.commandLog.push(command);
            this.$scope.textLog.push(this.inputPromptText + command);

            this.$scope.currentCommand = '';
            this.$scope.commandHistoryIndex = -1;

            command = command.trim();
            this.getCommandAction(command)();
        };

        (<any>consoleTextService.addListener)(function(text) {
            (<any>this).$scope.$apply(() => {
                (<any>this).$scope.textLog.push(text);
            });
        }, this);
    }

    private getCommandAction(command): Function {
        var output = function() { (<any>this).badCommand(command); };

        if(command.indexOf('load pluginA') === 0) {
            output = this.loadPluginA;
        } else if(command.indexOf('load pluginA') === 0) {
            output = this.loadPluginB;
        } else if(command.indexOf('apptest') === 0) {
            output = function() {
                var text = command.slice(8);
                this.appService.test(text);
            };
        } else if(command.indexOf('restart') === 0) {
            output = function() {
                location.reload();
            };
        } else if(command.indexOf('quit') === 0) {
            output = function() {
                window.location.assign("http://www.google.com");
            };
        }

        return output.bind(this);
    }

    private commandHistoryLoop(delta) {
        var maxIndex = this.$scope.commandLog.length - 1;

        if(this.$scope.commandHistoryIndex === -1) {
            this.$scope.currentCommandBackup = this.$scope.currentCommand;
        }

        this.$scope.commandHistoryIndex += delta;
        if(this.$scope.commandHistoryIndex < -1) {
            this.$scope.commandHistoryIndex = maxIndex;
        } else
        if(this.$scope.commandHistoryIndex > maxIndex) {
            this.$scope.commandHistoryIndex = -1;
        }

        if(this.$scope.commandHistoryIndex === -1) {
            this.$scope.currentCommand = this.$scope.currentCommandBackup;
        } else {
            this.$scope.currentCommand = this.$scope.commandLog[this.$scope.commandHistoryIndex];
        }
    }

    private loadPluginB() {
        alert('Loading Plugin B...');
    }

    private loadPluginA = () => {

        require(["pluginA/main"], function(pluginModule) {
            pluginModule.init();
        });

        // Make this a one-shot function so it can't be re-invoked
        this.loadPluginA = function() {};
    }

    private badCommand(command) {
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
                errorMsg = <string>'R Tape loading error';
                break;
            case 3:
                errorMsg = <string>'I\'m busy, try again later!';
                break;
            default:
                errorMsg = <string>'¿¿¿Why would you do that???';
                break;
        }

        this.$scope.textLog.push(errorMsg);
    }
}
