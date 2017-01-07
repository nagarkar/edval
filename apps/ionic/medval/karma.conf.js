// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html


module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'angular-cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-mocha-reporter'),
      require('angular-cli/plugins/karma')
    ],
    files: [
      "./src/assets/js/Winwheel.js",
      "./src/assets/js/jsbn.js",
      "./src/assets/js/jsbn2.js",
      "./src/assets/js/sjcl.js",
      "./src/assets/js/moment.js",
      "./src/assets/js/aws-sdk.js",
      "./src/assets/js/aws-cognito-sdk.js",
      "./src/assets/js/amazon-cognito-identity.min.js",
      { pattern: './src/test.ts', watched: false }
    ],

    preprocessors: {
      './src/test.ts': ['angular-cli']
    },

    mime: {
      'text/x-typescript': ['ts','tsx']
    },

    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['mocha', 'karma-remap-istanbul']
              : ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
