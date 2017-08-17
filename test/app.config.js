/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const config = bedrock.config;
const path = require('path');

// add pseudo package for test harness
const dir = path.join(__dirname);
config.views.system.packages.push({
  path: path.join(dir, 'components'),
  manifest: path.join(dir, 'package.json')
});
