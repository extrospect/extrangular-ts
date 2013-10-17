define(["require", "exports", 'appController', 'appService', 'appDirective', 'consoleTextService'], function(require, exports, __appController__, __appService__, __appDirective__, __consoleTextService__) {
    /// <reference path="../../lib/typings/angular/angular.d.ts" />
    /// <reference path="../../lib/typings/requirejs/require.d.ts" />
    'use strict';

    // NOTE: Using import/require to tell Typescript to add this to the AMD module definition it creates
    var appController = __appController__;
    var appService = __appService__;
    var appDirective = __appDirective__;
    var consoleTextService = __consoleTextService__;
    function start() {
        var providerCache = {}, eagerAngular = angular, lazyAngular = {}, lazyModules = {};

        // Declare app level module which depends on filters, and services
        angular.module('testApp', []).directive('appDirective', [
            function () {
                return new appDirective.AppDirective();
            }
        ]).service('appService', appService.AppService).service('consoleTextService', consoleTextService.ConsoleTextService).value('inputPromptText', 'C:/Extrali/WebClient/AngularJS> ').controller('AppController', [
            '$scope',
            '$document',
            'inputPromptText',
            'appService',
            'consoleTextService',
            appController.AppController
        ]).config([
            '$provide',
            '$compileProvider',
            '$filterProvider',
            '$controllerProvider',
            function ($provide, $compileProvider, $filterProvider, $controllerProvider) {
                providerCache.$provide = $provide;
                providerCache.$compileProvider = $compileProvider;
                providerCache.$filterProvider = $filterProvider;
                providerCache.$controllerProvider = $controllerProvider;
            }
        ]);

        // NOTE: Bootstrap is being applied manually here - I believe angular has a 'trick' to defer automatic bootstrap
        // when using require.js (involves setting window.name to NG_DEFER_BOOTSTRAP or something similar).
        angular.bootstrap(document.body, ['testApp']);

        // NOTE: This is the key - we replace the real angular with a modified version that has a different module() function
        angular.extend(lazyAngular, eagerAngular);
        lazyAngular.module = function (name, requires, configFn) {
            var lazyModule;
            if (typeof requires === 'undefined') {
                if (lazyModules.hasOwnProperty(name)) {
                    lazyModule = lazyModules[name];
                } else {
                    lazyModule = eagerAngular.module(name);
                }
            } else {
                if (configFn != null) {
                    throw new Error('config function unimplemented yet, module: ' + name);
                }

                lazyModule = makeLazyModule(name, providerCache);
                lazyModules[name] = lazyModule;
                lazyModule.realModule = eagerAngular.module(name, requires, configFn);
            }

            return lazyModule;
        };

        // NOTE: Replaced the real angular with the fake version that supports lazy loading
        (window).angular = lazyAngular;

        // NOTE: This is the function that returns a faux module that has it's component registration methods forwarded to
        // this (eager) module, avoiding the problems with lazy registration.
        function makeLazyModule(name, providerCache) {
            var lazyModule = {
                name: name,
                realModule: null,
                __runBlocks: [],
                factory: function () {
                    providerCache.$provide.factory.apply(null, arguments);
                    return lazyModule;
                },
                directive: function () {
                    providerCache.$compileProvider.directive.apply(null, arguments);
                    return lazyModule;
                },
                filter: function () {
                    providerCache.$filterProvider.register.apply(null, arguments);
                    return lazyModule;
                },
                controller: function () {
                    providerCache.$controllerProvider.register.apply(null, arguments);
                    return lazyModule;
                },
                provider: function () {
                    providerCache.$provide.provider.apply(null, arguments);
                    return lazyModule;
                },
                service: function () {
                    providerCache.$provide.service.apply(null, arguments);
                    return lazyModule;
                },
                value: function () {
                    providerCache.$provide.value.apply(null, arguments);
                    return lazyModule;
                },
                run: function (r) {
                    this.__runBlocks.push(r);
                    return lazyModule;
                }
            };
            return lazyModule;
        }
    }
    exports.start = start;
});
