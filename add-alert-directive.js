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
    compile: tElement => {
      const template = tElement.html();
      return (scope, element, attrs) => {
        element.remove();
        attrs.$observe('brAlertType', alertType => {
          if(alertType) {
            brAlertService.add(alertType, {html: template}, {scope: scope});
          }
        });
      };
    }
  };
}
