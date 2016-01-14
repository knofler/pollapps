'use strict';

describe('Directive: fileShare', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/file-share/file-share.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<file-share></file-share>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the fileShare directive');
  }));
});