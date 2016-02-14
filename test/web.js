process.env.NODE_ENV = 'production';
var app = require('../yoline');
var assert = require('assert');
var request = require('supertest').agent(app.listen());

describe('Test 404', () => {
    var url = '/' + Math.floor(Math.random() * 1000);
    describe('when GET ' + url, function(){
      it('should return the 404 page', (done) => {
        request
        .get(url)
        .expect(404)
        .expect(/Not Found/, done);
      });
    });
});

describe('Test index page', function(){
  describe('when GET /', function(){
    it('should have two post', function(done){
      request
      .get('/')
      .expect(200)
      .expect(function(res){
        assert.equal(/<strong>2<\/strong> posts/.test(res.text), true, 'should say there are two posts');
      })
      .end(done);
    });
  });
});

describe('Test post page', function(){
  describe('when GET /post/11-02-16', function(){
    it('should template with first article', function(done){
      request
      .get('/post/11-02-16')
      .expect(200)
      .expect(function(res){
        assert.equal(/<h1>Learn Memory Static<\/h1>/.test(res.text), true, 'should say the title');
        assert.equal(/<span class="time">Thursday, February 11th 2016<\/span>/.test(res.text), true, 'should say the date');
      })
      .end(done);
    });
  });
});
