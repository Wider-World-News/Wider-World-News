const request = require('supertest');
const server = 'http://localhost:3000/';

describe('routing tests', () => 
{
  describe('GET', () => 
  {
    describe('/', () => 
    {
      it('returns an html file', (done) => {
        request(server).get('/')
        .expect('text/html; charset=UTF-8');
        done();
      });
      
      it('returns with a status code of 200', (done) => {
        request(server).get('/')
        .send()
        .expect(200);
        done();
      });
    });
  });
});