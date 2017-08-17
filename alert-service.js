/*!
 * Alert Service.
 *
 * Copyright (c) 2014-2017 Digital Bazaar, Inc. All rights reserved.
 *
 * @author Dave Longley
 */
import angular from 'angular';

/* @ngInject */
export default function factory($rootScope, brModelService) {
  const service = {};

  // defined categories
  service.category = {
    FEEDBACK: 'FEEDBACK',
    BACKGROUND: 'BACKGROUND'
  };

  // categorized log of alerts
  service.log = {};
  angular.forEach(service.category, c => service.log[c] = []);

  // the total number of alerts
  service.total = 0;

  // valid event types
  const eventTypes = ['add', 'remove', 'clear'];

  // alert listeners
  service.listeners = {};
  eventTypes.forEach(event => service.listeners[event] = []);

  /**
   * Adds a listener.
   *
   * @param event the type of event to listen for.
   * @param listener the listener to add.
   *
   * @return the service for chaining.
   */
  service.on = (event, listener) => {
    if(eventTypes.indexOf(event) === -1) {
      throw new Error('Unknown event type "' + event + '"');
    }
    service.listeners[event].push(listener);
    return service;
  };

  /**
   * Removes an event listener.
   *
   * @param event the event type.
   * @param listener the listener to remove.
   *
   * @return the service for chaining.
   */
  service.removeListener = (event, listener) => {
    if(eventTypes.indexOf(event) === -1) {
      throw new Error('Unknown event type "' + event + '"');
    }
    const listeners = service.listeners[event];
    const idx = listeners.indexOf(listener);
    if(idx !== -1) {
      listeners.splice(idx, 1);
    }
    return service;
  };

  /**
   * Emits an event to all listeners.
   *
   * @param event the event to emit.
   * @param data any data associated with the event.
   */
  const emit = (event, data) => {
    const listeners = service.listeners[event];
    listeners.forEach(listener => listener(data));
  };

  /**
   * Adds an alert to the log.
   *
   * @param type the type of alert ('error', 'warning', 'info').
   * @param value the alert to add.
   * @param options the options to use:
   *          [category] an optional category for the alert,
   *            default: service.category.FEEDBACK.
   *          [scope] a scope to attach a listener to destroy the alert
   *            when the scope is destroyed.
   *
   * @return the service for chaining.
   */
  service.add = (type, value, options) => {
    if(typeof value === 'string') {
      value = {message: value};
    }
    if(type === 'error' &&
      'stack' in value &&
      typeof console !== 'undefined') {
      const log = ('error' in console) ? console.error : console.log;
      log.call(console, 'Error value:', value);
      log.call(console, 'Error stack:', value.stack);
    }
    options = options || {};
    const category = options.category || service.category.FEEDBACK;
    const scope = options.scope || null;
    const info = {type: type, value: value, category: category};
    // remove alert when scope is destroyed
    if(scope) {
      // provide access to scope
      value.getScope = () => scope;
      scope.$on('$destroy', () => service.remove(type, value));
    }
    service.log[category].push(info);
    service.total += 1;
    emit('add', info);
    return service;
  };

  /**
   * Removes the given alert, regardless of which category it is in.
   *
   * @param type the alert type.
   * @param value the alert to remove.
   *
   * @return the service for chaining.
   */
  service.remove = (type, value) => {
    angular.forEach(service.log, list => {
      for(let i = 0; i < list.length; ++i) {
        const info = list[i];
        if(info.type === type && info.value === value) {
          list.splice(i, 1);
          service.total -= 1;
          emit('remove', info);
          break;
        }
      }
    });
    return service;
  };

  /**
   * Clears all alerts of a given type or all alerts of a given type in a
   * particular category.
   *
   * @param [type] the alert type, null for all.
   * @param [category] the category to clear, omit for all.
   *
   * @return the service for chaining.
   */
  service.clear = (type, category) => {
    if(category) {
      if(!(category in service.category)) {
        throw new Error('Invalid error category: ' + category);
      }
      service.total -= service.log[category].length;
      service.log[category].length = 0;
      emit('clear', category);
      return service;
    }

    // clear all categories
    angular.forEach(service.log, (list, category) => {
      if(!type) {
        service.total -= list.length;
        list.length = 0;
        emit('clear', category);
        return;
      }
      brModelService.removeAllFromArray(list, e => {
        if(e.type === type) {
          service.total -= 1;
          return true;
        }
        return false;
      });
      emit('clear', category, type);
    });

    return service;
  };

  /**
   * Clears all feedback alerts.
   *
   * @param [type] the alert type.
   *
   * @return the service for chaining.
   */
  service.clearFeedback = type => {
    if(type) {
      service.clear(type, service.category.FEEDBACK);
    } else {
      service.clear(null, service.category.FEEDBACK);
    }
    return service;
  };

  // expose service to scope
  // FIXME: remove this from the $rootScope
  $rootScope.app = $rootScope.app || {};
  $rootScope.app.services = $rootScope.app.services || {};
  $rootScope.app.services.alert = service;

  return service;
}
