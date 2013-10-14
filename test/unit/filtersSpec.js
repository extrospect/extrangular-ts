/// <reference path="../../app/lib/typings/angular/angular.d.ts" />
/// <reference path="../lib/typings/jasmine/jasmine.d.ts" />
/// <reference path="../lib/typings/angular/angular-mocks.d.ts" />
'use strict';
/* jasmine specs for filters go here */
describe('filter', function () {
    beforeEach(module('myApp.filters'));

    describe('interpolate', function () {
        beforeEach(module(function ($provide) {
            $provide.value('version', 'TEST_VER');
        }));

        it('should replace VERSION', inject(function (interpolateFilter) {
            expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
            expect(1).toBe(3);
        }));
    });
});
//# sourceMappingURL=filtersSpec.js.map