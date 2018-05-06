const sinon = require('sinon');
const { expect } = require('chai');

function chainableStub(context) {
  return sinon.stub().returns(context);
}

function createExpectationTests(respStub) {
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

class ResponseStub {
  constructor() {
    this.json = chainableStub(this);
    this.status = chainableStub(this);
    this.send = chainableStub(this);
    this.expect = createExpectationTests(this);
  }
}

module.exports = ResponseStub;
