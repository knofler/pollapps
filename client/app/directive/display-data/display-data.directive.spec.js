'use strict';

describe('Directive: displayData', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/display-data/display-data.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<display-data></display-data>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the displayData directive');
  }));
});