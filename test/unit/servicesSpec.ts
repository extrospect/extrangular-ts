/// <reference path="../../app/lib/typings/angular/angular.d.ts" />
/// <reference path="../lib/typings/jasmine/jasmine.d.ts" />
/// <reference path="../lib/typings/angular/angular-mocks.d.ts" />
'use strict';

/* jasmine specs for services go here */

describe('service', function () {
    beforeEach(module('myApp.services'));

    describe('version', function () {
        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.1');
        }));
    });
});
