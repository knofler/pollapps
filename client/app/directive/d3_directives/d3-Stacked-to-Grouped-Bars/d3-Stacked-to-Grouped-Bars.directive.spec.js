'use strict';

describe('Directive: d3StackedToGroupedBars', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/d3_directives/d3-Stacked-to-Grouped-Bars/d3-Stacked-to-Grouped-Bars.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<d3-stacked-to-grouped-bars></d3-stacked-to-grouped-bars>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the d3StackedToGroupedBars directive');
  }));
});