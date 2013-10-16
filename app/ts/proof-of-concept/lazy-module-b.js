/// <reference path="../../lib/typings/angular/angular.d.ts" />
define(["require", "exports"], function(require, exports) {
    function init() {
        angular.module('lazyModuleB', []).directive('lazyDirectiveB', [
            'lazyServiceA',
            function (lazyServiceA) {
                var t = lazyServiceA.test(7);
                return {
                    template: '<div>[LAZY MODULE B][LazyServiceA] 7 => ' + t + '</div>'
                };
            }
        ]).config(function ($provide) {
            console.log('configging!');
        }).factory('lazyServiceB', function () {
            return {
                test: function (n) {
                    return n * 10;
                }
            };
        });

        // Declare a dependency from the main app module to this late loaded module (seems unnecessary)
        angular.module('testApp').requires = angular.module('testApp').requires.concat(['lazyModuleB']);

        // create an injector for the late-loading module ('ng' must ALWAYS be the first module listed in angular.injector)
        var $injector = angular.injector(['ng', 'testApp']);

        // use the injector to trigger a re-compile and digest on the application/document
        $injector.invoke(function ($rootScope, $compile, $document) {
            $compile($document)($rootScope);
            $rootScope.$digest();
        });
    }
    exports.init = init;
});
