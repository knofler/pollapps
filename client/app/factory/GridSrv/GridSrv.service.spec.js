'use strict';

describe('Service: GridSrv', function () {

  // load the service's module
  beforeEach(module('poll'));

  // instantiate service
  var GridSrv;
  beforeEach(inject(function (_GridSrv_) {
    GridSrv = _GridSrv_;
  }));

  it('should do something', function () {
    expect(!!GridSrv).toBe(true);
  });

});
