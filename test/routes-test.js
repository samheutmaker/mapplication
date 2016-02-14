const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Start server
require(__dirname + '/../server');

describe('The mapplication router', () => {
  it('Should return an event on a POST to /search', (done) => {

  })
})
