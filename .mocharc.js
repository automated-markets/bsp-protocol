'use strict';

// This is a JavaScript-based config file containing every Mocha option plus others.
// If you need conditional logic, you might want to use this type of config.
// Otherwise, JSON or YAML is recommended.

module.exports = {
  extension: ['js'],
  ignore: ['app.e2e-spec.ts'],
  spec: ['test/**/*.test.js'], // the positional arguments!
  timeout: '2000', // same as 
};