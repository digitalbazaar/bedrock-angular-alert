/*!
 * Alerts directive.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
import angular from 'angular';

/* @ngInject */
export default function factory(brAlertService, $compile, $rootScope) {
  return {
    restrict: 'EA',
    scope: {
      alertCategory: '@?brAlertCategory',
      filterOrigin: '@?brFilterOrigin',
      fixed: '@?brFixed'
    },
    templateUrl: 'bedrock-angular-alert/alerts.html',
    link: Link
  };

  function Link(scope, element, attrs) {
    scope.app = $rootScope.app;
    attrs.brAlertCategory = attrs.brAlertCategory || 'all';

    var elements = {};
    for(var key in brAlertService.category) {
      var category = brAlertService.category[key];
      elements[category] = [];
      var log = brAlertService.log[category];
      log.forEach(addAlert);
    }

    scope.closeAlert = function(info) {
      brAlertService.remove(info.type, info.value);
    };

    scope.showCustomAlerts = function(category) {
      var area = element.find('.br-alert-area-' + category);
      angular.forEach(elements[category] || [], function(entry) {
        if(entry.element !== null) {
          return;
        }
        // transclude
        var info = entry.info;
        var value = info.value;
        var el = angular.element('<div class="alert"></div>');
        el.addClass('alert-' + info.type);
        el.append('<button type="button" class="close">&times;</button>');
        el.append(value.html);
        el.first().one('click', function() {
          scope.closeAlert(info);
          scope.$apply();
        });
        var transclusionScope = value.getScope ? value.getScope() : scope;
        $compile(el)(transclusionScope);
        entry.element = el;
        area.append(entry.element);
      });
      return true;
    };

    brAlertService
      .on('add', addAlert)
      .on('remove', removeAlert)
      .on('clear', clearAlerts);

    scope.$on('$destroy', function() {
      brAlertService
        .removeListener('add', addAlert)
        .removeListener('remove', removeAlert)
        .removeListener('clear', clearAlerts);
    });

    function addAlert(info) {
      var value = info.value;

      if(value.html) {
        // add entry for later population
        elements[info.category].push({
          info: info,
          element: null
        });
        return;
      }

      // form error
      if(value.type === 'ValidationError') {
        // select forms in open dialogs first, then any non-dialog visible
        // forms, then self
        var target;
        // TODO: should this be checking for deepest dialog, not just one
        // that is open?
        var dialog = angular.element(document.querySelector('dialog[open]'));
        if(dialog.length) {
          target = dialog.find('form');
          if(!target.length) {
            target = dialog;
          }
        } else {
          target = angular.element(Array.prototype.filter.call(
            document.querySelectorAll(':not(dialog) form'),
            // filter out forms that aren't visible
            function() {
              return this.offsetWidth > 0 || this.offsetHeight > 0;
            }));
        }
        if(!target.length) {
          target = element;
        }

        // clear previous feedback, add new
        target.find('[br-property-path]').removeClass('has-error');
        angular.forEach(value.details.errors, function(detailError) {
          var path = detailError.details.path;
          if(path) {
            // highlight element using br-property-path
            var el = target.find('[br-property-path="' + path + '"]');
            el.addClass('has-error');
            elements[info.category].push({
              info: info,
              target: el
            });
          }
        });
      }
    }

    function removeAlert(info) {
      // find info+element pairs and remove elements
      var list = elements[info.category];
      for(var i = 0; i < list.length;) {
        if(list[i].info === info) {
          if(list[i].element) {
            list[i].element.remove();
          } else if(list[i].target) {
            list[i].target.removeClass('has-error');
          }
          list.splice(i, 1);
        } else {
          ++i;
        }
      }
    }

    function clearAlerts(category, type) {
      var list = elements[category].slice();
      for(var i = 0; i < list.length; ++i) {
        if(!type || list[i].info.type === type) {
          removeAlert(list[i].info);
        }
      }
      element.find('.br-alert-area-' + category).empty();
      if(type) {
        // not all alerts were removed, so rebuild alert area
        var log = brAlertService.log[category];
        log.forEach(addAlert);
      }
    }
  }
}
