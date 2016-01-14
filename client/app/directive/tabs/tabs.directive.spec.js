'use strict';

describe('Directive: tabs', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/tabs/tabs.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tabs></tabs>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the tabs directive');
  }));
});