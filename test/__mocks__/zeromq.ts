'use strict';
const zeromq = require('zeromq/v5-compat');
const mockzmq: typeof zeromq = jest.genMockFromModule('zeromq/v5-compat');

mockzmq.curveKeypair = function() {
  return {
    public: '',
    private: ''
  };
};

export { mockzmq, zeromq };
