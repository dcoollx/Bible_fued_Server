const app = require('../src/app');
describe('server response with 200 on all valid URL',()=>{
  it('resonse with a 200 code at root',()=>{
    return request(app).get('/').expect(200);
  });

  it('response at /join',()=>{
    return request(app).get('/join').expect(200);
  });
  it('response at /create',()=>{
    return request(app).get('/create').expect(200);
  });
  it('response at /questions',()=>{
    return request(app).get('/questions').expect(200);
  });
  
});

describe('each endpoint returns appropriate response',()=>{
  describe('/create',()=>{
    it('returns a random key',()=>{
      return request(app).get('/create').expect(200, {roomCode : 'Test123'});
    });
    it('returns an error if it cant create room',()=>{
      return request(app).get('/create').expect(400);
    });
  });
});