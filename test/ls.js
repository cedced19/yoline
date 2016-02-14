var ls = require('../lib/ls');
var assert = require('assert');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

var contentPath = path.join(__dirname, '..', '/content');

describe('Test listing posts', () => {
    describe('when exectute function', function(){
      it('should be able to get informations', (done) => {
        var posts = ls(contentPath, true, fs.readdirSync(contentPath));
        expect(posts).to.be.an('array');
        assert.equal(posts.length, 2, 'should have two posts');
        expect(posts[1].attributes.title).to.be.a('string');
        assert.equal(posts[1].attributes.title, 'Learn Memory Static', 'should have a title');
        expect(posts[1].attributes.date).to.be.a('string');
        assert.equal(posts[1].attributes.date, 'Thursday, February 11th 2016', 'should have a date');
        expect(posts[1].body).to.be.a('string');
        done();
      });
    });
});
