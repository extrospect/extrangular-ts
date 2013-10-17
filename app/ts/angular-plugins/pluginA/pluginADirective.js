define(["require", "exports"], function(require, exports) {
    var PluginADirective = (function () {
        function PluginADirective(consoleTextService) {
            var _this = this;
            this.consoleTextService = consoleTextService;
            this.template = '<div>Check Em</div>';
            this.link = function (scope) {
                _this.consoleTextService.writeLine('Plugin A loaded OK!');
                _this.consoleTextService.writeLine('Plugin A - Service A registered OK!');
            };
        }
        return PluginADirective;
    })();
    exports.PluginADirective = PluginADirective;
});
