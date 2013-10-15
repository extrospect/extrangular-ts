/// <reference path="../lib/typings/angular/angular.d.ts" />
/// <reference path="controllers.ts" /> -ignore
'use strict';

/* Filters */

angular.module('myApp.filters', []).
    filter('interpolate', ['version', function (version) {
        return function (text) {
            var a = 1;
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);
