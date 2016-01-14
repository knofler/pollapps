'use strict';

describe('Directive: photoMod', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/photo-mod/photo-mod.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<photo-mod></photo-mod>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the photoMod directive');
  }));
});