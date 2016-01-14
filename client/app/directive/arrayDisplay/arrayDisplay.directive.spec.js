'use strict';

describe('Directive: arrayDisplay', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/arrayDisplay/arrayDisplay.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<array-display></array-display>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the arrayDisplay directive');
  }));
});