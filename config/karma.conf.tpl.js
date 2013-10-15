module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
                <% scripts.forEach( function ( file ) { %>'<%= file %>',
                    <% }); %>
        ],

        autoWatch: false,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        logLevel: config.LOG_DEBUG,

         loggers: [{type: 'console'}],

        /**
         * How to report, by default.
         */
        reporters: 'dots',

        /**
         * On which port should the browser connect, on which port is the test runner
         * operating, and what is the URL path for the browser to use.
         */
        ///port: 9018,
        ///runnerPort: 9100,
    })
}
