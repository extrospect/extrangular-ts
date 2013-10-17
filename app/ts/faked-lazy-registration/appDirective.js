define(["require", "exports"], function(require, exports) {
    var AppDirective = (function () {
        function AppDirective() {
            this.template = '<div ng-repeat="text in textLog">' + '<span class="consoleText">{{text}}</span></div>' + '<div><table><tr><td>{{inputPromptText}}</td><td>' + '<span class="consoleText">{{currentCommand}}</span>' + '<span class="blink">&nbsp;</span>' + '</td></tr></table></div>';
            this.controller = 'AppController';
        }
        return AppDirective;
    })();
    exports.AppDirective = AppDirective;
});
