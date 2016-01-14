'use strict';

describe('Directive: d3Sunburst', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/d3_directives/d3-sunburst/d3-sunburst.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<d3-sunburst></d3-sunburst>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the d3Sunburst directive');
  }));
});