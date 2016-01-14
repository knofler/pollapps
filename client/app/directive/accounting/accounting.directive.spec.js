'use strict';

describe('Directive: accounting', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/accounting/accounting.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<accounting></accounting>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the accounting directive');
  }));
});