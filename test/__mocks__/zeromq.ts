'use strict';
const zeromq = require('zeromq/v5-compat');
const mockzmq: typeof zeromq = {}; //jest.genMockFromModule('zeromq/v5-compat');

mockzmq.socket = function() {
  return {
    connect: () => jest.fn(),
    on: () => jest.fn(),
    send: jest.fn
  };
};

mockzmq.curveKeypair = function() {
  return {
    public: '',
    private: ''
  };
};

export { mockzmq, zeromq };
