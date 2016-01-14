'use strict';

describe('Service: userInfo', function () {

  // load the service's module
  beforeEach(module('poll'));

  // instantiate service
  var userInfo;
  beforeEach(inject(function (_userInfo_) {
    userInfo = _userInfo_;
  }));

  it('should do something', function () {
    expect(!!userInfo).toBe(true);
  });

});
