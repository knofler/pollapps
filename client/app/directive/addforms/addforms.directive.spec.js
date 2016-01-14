'use strict';

describe('Directive: addforms', function () {

  // load the directive's module and view
  beforeEach(module('poll'));
  beforeEach(module('app/directive/addforms/addforms.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<addforms></addforms>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the addforms directive');
  }));
});