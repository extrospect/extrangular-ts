define(["require", "exports"], function(require, exports) {
    var PluginAServiceA = (function () {
        function PluginAServiceA(consoleTextService) {
            this.consoleTextService = consoleTextService;
        }
        PluginAServiceA.prototype.writeMessage = function (msg) {
            this.consoleTextService.writeLine(msg);
        };
        return PluginAServiceA;
    })();
    exports.PluginAServiceA = PluginAServiceA;
});
