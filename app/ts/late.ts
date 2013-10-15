/// <reference path="../lib/typings/angular/angular.d.ts" />

export function init() {
    angular.module('lateModule', []).service('lateService', [
        function() {
            this.test = function() {
                alert('Test OK');
            };
        }]);/*directive('lateDirective', function() {
        return {
            template: '<div>Sorry I am late!</div>'
        };
    });*/
    angular.module('testApp').requires = angular.module('testApp').requires.concat(['lateModule']);
    (<any>angular.element(document.body)).scope().$digest();
}
