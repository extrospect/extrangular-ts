define(["require", "exports"], function(require, exports) {
    var AppService = (function () {
        function AppService() {
        }
        AppService.prototype.test = function (msg) {
            alert('(AppService) ' + msg);
        };
        return AppService;
    })();
    exports.AppService = AppService;
});
