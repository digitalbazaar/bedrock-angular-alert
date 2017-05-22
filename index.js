/*!
 * Alert module.
 *
 * Copyright (c) 2012-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
import angular from 'angular';
import AddAlertDirective from './add-alert-directive.js';
import AlertService from './alert-service.js';
import AlertsDirective from './alerts-directive.js';

var module = angular.module('bedrock.alert', ['bedrock.model']);

module.directive('brAddAlert', AddAlertDirective);
module.service('brAlertService', AlertService);
module.directive('brAlerts', AlertsDirective);
