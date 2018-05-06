const sinon = require('sinon');
const { expect } = require('chai');

function createExpect(respStub) {
  return {
    statusCode(code) {
      const [status] = respStub.status.firstCall.args;
      expect(status, `Expected response.status(${code}) to be called.`).to.equal(code);
      return respStub;
    },

    json(expected) {
      const [actual] = respStub.json.firstCall.args;
      expect(actual).to.equal(expected);
      return respStub;
    },

    send(expected) {
      const [actual] = respStub.send.firstCall.args;
      expect(actual).to.equal(expected);
      return respStub;
    },
  };
}

function createResponseStub() {
  const respStub = {};
  respStub.json = sinon.stub().returns(respStub);
  respStub.status = sinon.stub().returns(respStub);
  respStub.send = sinon.stub().returns(respStub);
  respStub.expect = createExpect(respStub);
  return respStub;
}

module.exports = createResponseStub;
