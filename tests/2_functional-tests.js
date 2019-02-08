/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
 
suite('Functional Tests', function() {

   /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
   test('#example Test GET /api/books', function(done){
      chai.request(server)
         .get('/api/books')
         .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'comments');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount')

            done();
         });
   });
   /*
   * ----[END of EXAMPLE TEST]----
   */

   suite('Routing tests', function() {


      suite('POST /api/books with title => create book object/expect book object', function() {
         
         test('Test POST /api/books with title', function(done) {
            chai.request(server)
               .post('/api/books')
               .send({ title: 'Dante\'s inferno' })
               .end((err, res) => {
                  assert.equal(res.status, 200)
                  assert.property(res.body, '_id')
                  assert.property(res.body,'title')
                  assert.equal(res.body.title, 'Dante\'s inferno')
                  assert.isArray(res.body.comments)
                  assert.property(res.body, 'comments')
                  done()
               })
         });
         
         test('Test POST /api/books with no title given', function(done) {
            chai.request(server)
            .post('/api/books')
            .send({})
            .end((err, res) => {
               assert.equal(res.status, 422)
               assert.equal(res.text, 'missing title')               
               done()
            })
         });
         
      });


      suite('GET /api/books => array of books', function(){
         
         test('Test GET /api/books',  function(done){
            chai.request(server)
               .get('/api/books')
               .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.isArray(res.body, 'response should be an array');
                  assert.property(res.body[0], 'title');
                  assert.property(res.body[0], 'comments');
                  assert.property(res.body[0], '_id');
                  assert.property(res.body[0], 'commentcount')
                  done();
               });
         });      
         
      });


      suite('GET /api/books/[id] => book object with [id]', function(){
         
         test('Test GET /api/books/[id] with id not in db',  function(done){
            chai.request(server)
               .get('/api/books/5c5ccac21d6ba221293963af')               
               .end(function(err, res){
                  assert.equal(res.status, 200);
                  assert.equal(res.text, 'no book exists');
                  done();
               });
         });
         
         test('Test GET /api/books/[id] with valid id in db',  function(done){
            chai.request(server)
               .get('/api/books')
               .end((err, res) => {
                  const id = res.body[0]._id
                  chai.request(server)                  
                     .get('/api/books/'+ id)
                     .end((err, res) => {
                        assert.equal(res.status, 200)
                        assert.property(res.body, '_id')
                        assert.equal(res.body._id, id) 
                        assert.property(res.body,'title')
                        assert.isArray(res.body.comments)
                        assert.property(res.body, 'commentcount')

                     })
                     done()
               })
         });
         
      });


      suite('POST /api/books/[id] => add comment/expect book object with id', function(){
         
         test('Test POST /api/books/[id] with comment', function(done){
            chai.request(server)
               .get('/api/books')
               .end((err, res) => {
                  const id = res.body[0]._id
                  chai.request(server)                      
                     .post('/api/books/'+ id)
                     .send({ comment: 'test comment'})
                     .end((err, res) => {
                        assert.equal(res.status, 200)
                        assert.property(res.body, '_id')
                        assert.equal(res.body._id, id) 
                        assert.property(res.body,'title')
                        assert.isArray(res.body.comments)
                        assert.property(res.body, 'commentcount')
                     })
                     done()
               })                
               
         });
         
      });

      

   });

});