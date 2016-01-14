'use strict';

describe('Directive: dragndrop', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/dragndrop/dragndrop.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dragndrop></dragndrop>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the dragndrop directive');
  }));
});