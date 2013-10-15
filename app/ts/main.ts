/// <reference path="../lib/typings/requirejs/require.d.ts" />
require.config({
    baseUrl: 'ts',
    paths: {
        jquery: '../lib/jquery'
    }
});

// Start the app: 
require(['app'], function (app) {
    app.start();
});
