/// <reference path="../lib/typings/angular/angular.d.ts" />
/// <reference path="directives.ts" />
/// <reference path="filters.ts" />
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
    value('version', '0.1');
