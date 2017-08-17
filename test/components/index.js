/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import * as bedrock from 'bedrock-angular';
import TestHarnessComponent from './test-harness-component.js';

const module = angular.module('bedrock.alert-test', ['bedrock.alert']);

bedrock.setRootModule(module);

module.component('brTestHarness', TestHarnessComponent);

/* @ngInject */
module.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      title: 'Test Harness',
      template: '<br-test-harness></br-test-harness>'
    });
});
