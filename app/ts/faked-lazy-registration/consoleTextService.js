define(["require", "exports"], function(require, exports) {
    var ConsoleTextService = (function () {
        function ConsoleTextService() {
            this.currentId = 0;
            this.listeners = [];
        }
        ConsoleTextService.prototype.writeLine = function (text) {
            var i = 0, len = this.listeners.length;
            for (; i < len; i++) {
                if (this.listeners[i].fn.call(this.listeners[i].scope || this, text) === false) {
                    break;
                }
            }
        };
        ConsoleTextService.prototype.addListener = function (listener, scope) {
            var _this = this;
            var id = ++this.currentId, listenerObj;

            listenerObj = {
                id: id,
                fn: listener,
                scope: scope
            };

            this.listeners.push(listenerObj);

            return function () {
                var i = 0, len = _this.listeners.length;
                for (; i < len; i++) {
                    if (_this.listeners[i].id === id) {
                        _this.listeners.splice(i, 1);
                        break;
                    }
                }
            };
        };
        return ConsoleTextService;
    })();
    exports.ConsoleTextService = ConsoleTextService;
});
