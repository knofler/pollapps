'use strict';

describe('Directive: modals', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/modals/modals.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<modals></modals>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the modals directive');
  }));
});