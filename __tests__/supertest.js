const request = require('supertest');
const app = require('../server/server');
const server = 'http://localhost:3000';


describe('routing tests', () => 
{
  describe('GET', () => 
  {
    describe('/', () => 
    {
      it('returns an html file', async () => {
        const response = await request(server).get('/');
        expect(response.headers['content-type']).toBe('text/html; charset=UTF-8');
      });
      
      it('returns with a status code of 200', (done) => {
        request(server).get('/')
        .expect(200);
        done();
      });
    });
  });
});