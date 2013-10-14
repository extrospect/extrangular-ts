/// <reference path="../../app/lib/typings/angular/angular.d.ts" />
/// <reference path="../lib/typings/jasmine/jasmine.d.ts" />
/// <reference path="../lib/typings/angular/angular-mocks.d.ts" />
'use strict';

/* jasmine specs for directives go here */

describe('directives', function () {
    beforeEach(module('myApp.directives'));

    describe('app-version', function () {
        it('should print current version', function () {
            module(function ($provide) {
                $provide.value('version', 'TEST_VER');
            });
            inject(function ($compile, $rootScope) {
                var element = $compile('<span app-version></span>')($rootScope);
                expect(element.text()).toEqual('TEST_VER');
            });
        });
    });
});
