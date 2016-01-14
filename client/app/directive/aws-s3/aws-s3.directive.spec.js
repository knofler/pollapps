'use strict';

describe('Directive: awsS3', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/aws-s3/aws-s3.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<aws-s3></aws-s3>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the awsS3 directive');
  }));
});