/*!
 * Add Alert directive. Allows for adding an html-based alert to the
 * brAlertService via transclusion.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
/* @ngInject */
export default function factory(brAlertService) {
  return {
    restrict: 'EA',
    compile: function(tElement) {
      var template = tElement.html();
      return function(scope, element, attrs) {
        element.remove();
        attrs.$observe('brAlertType', function(alertType) {
          if(alertType) {
            brAlertService.add(alertType, {html: template}, {scope: scope});
          }
        });
      };
    }
  };
}
