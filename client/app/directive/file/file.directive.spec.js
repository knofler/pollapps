'use strict';

describe('Directive: file', function () {

  // load the directive's module
  beforeEach(module('poll'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<aws-file></aws-file>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the awsFile directive');
  }));
});