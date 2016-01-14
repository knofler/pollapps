'use strict';

describe('Directive: displayControl', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/display-control/display-control.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<display-control></display-control>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the displayControl directive');
  }));
});