/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const config = bedrock.config;
const path = require('path');

// config.protractor.config.suites['general'] =
//   path.join(__dirname, 'protractor', 'tests', '**', '*.js');

// default multiCapabilities, used with Sauce Labs
const caps = config.sauceLabs.capabilities;

// working suite of browsers
config.sauceLabs.multiCapabilities = [
  caps.osx1011.safari,
  caps.windows10.chrome,
  caps.windows10.edge,
  caps.windows10.firefox,
  caps.windows10.ie
];
