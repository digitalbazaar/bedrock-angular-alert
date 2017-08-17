/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
export default {
  bindings: {
    type: '@?brType'
  },
  controller: Ctrl,
  transclude: true,
  templateUrl: 'bedrock-angular-alert/alert-component.html'
};

/* @ngInject */
function Ctrl() {
  const self = this;

  // TODO: use css?
  const styles = {
    error: {'background-color': '#FFCDD2'},
    info: {'background-color': '#BBDEFB'},
    warning: {'background-color': '#FFF9C4'}
  };

  self.$onInit = () => {
    self.type = self.type || 'error';
    self.alertStyle = styles[self.type];
  };
}
