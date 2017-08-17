# bedrock-angular-alert

An [AngularJS][] module that provides a service for managing alerts (errors,
warnings, feedback information, etc.) for [bedrock-angular][] and directives
for displaying those alerts.

## Quick Examples

```html
<!-- display all logged alerts -->
<div br-alerts br-fixed="true"></div>

<!-- custom directive that uses brAlertService -->
<my-directive></my-directive>
```

```js
angular.module('example', ['bedrock.alert']).directive('myDirective', factory);

/* @ngInject */
function factory(brAlertService) {
  return {
    restrict: 'E',
    scope: {},
    template: '<button ng-click="errorOccurred()">Error</button>',
    link: (scope, element) => {
      brAlertService.add('info', 'myDirective loaded.');

      scope.errorOccurred = function(err) {
        // add a feedback error; if the scope is destroyed, remove the error
        brAlertService.add('error', err, {scope: scope});
      };
    }
  };
}
```

## Setup

```
npm install bedrock-angular-alert
```

`bedrock-angular-alert` must be added to the `bedrock.browserDependencies` list
in the `package.json` file of the dependent package.

To manually add **bedrock-angular-alert** as a dependency:

```js
angular.module('myapp', ['bedrock.alert']);
```

## API

### brAlertService.category

An object that stores the available alert categories: `FEEDBACK` and
`BACKGROUND`.

### brAlertService.log

A categorized log of alerts. `brAlertService.log` is an object where each
entry has a key from `brAlertService.category` and a value that is an array of
alerts that have been added for that category.

### brAlertService.on(event, listener)

Adds a listener for the given type of event. The valid event types are:
`add`, `remove`, and `clear`. The `add` event is emitted when an alert is
added, `remove` is emitted when an alert is removed, and `clear` is emitted
when alerts of a particular type and/or category are cleared.

### brAlertService.removeListener(event, listener)

Removes a particular event listener.

### brAlertService.add(type, value, [options])

Adds an alert to the log.

The alert type may be `error`, `warning`, or `info`.

The value can be a string, an `Error` instance, or an object with an `html`
property set to custom `html` to be displayed, for example, by a
`br-alerts` directive.

If options are provided, they may include a `category` from
`brAlertService.category` and/or a `scope`. If no `category` is given, the
default, `brAlertService.category.FEEDBACK` will be used. If a `scope` is
given, then when the `scope` is destroyed, the alert will be removed. This
is useful for removing feedback generated from UI elements that can be
destroyed. For example, a modal that generates feedback alerts may be closed,
and if the alerts were added using the modal's scope, the alerts will be
automatically removed.

### brAlertService.remove(type, value)

Removes the given alert, regardless of which category it is in.

### brAlertService.clear([type], [category])

Clears all alerts of a given type or all alerts of a given type in a
particular category.

### brAlertService.clearFeedback([type])

Clears all feedback alerts or feedback alerts of a particular type.

[bedrock]: https://github.com/digitalbazaar/bedrock
[bedrock-angular]: https://github.com/digitalbazaar/bedrock-angular
[AngularJS]: https://github.com/angular/angular.js
