/*
*
*
*       Complete the API routing below
*       
*       
*/


const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const { getDb: db } = require('../utils/database')

//const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});


const deleteBook = async (id, res) => {
   try {
      if (!id || id.length !== 24) { throw 'unable to delete book'}

      const result = await db()
         .collection('books')
         .findOneAndDelete({ _id: new ObjectId(id) })
      if (!result.value) { throw 'unable to delete book'}  

      return res.status(200).type('text').send('delete successful')
     
   } catch (err) {
      console.log('==============\n', err, '\n=============')
      return res.status(422).type('text').send('unable to delete book')
   }
} 


module.exports = function (app) {

   app.route('/api/books')
      .get(async function (req, res){
         //response will be array of book objects
         //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
         try {
            const books = await db().collection('books').find().toArray()
            if (!books) { throw 'Unable to fetch books' } 
           
           const formatedBooks = books.map(book => {
             return {...book, commentcount: book.comments.length }
           })
            
            return res.status(200).json(formatedBooks)
           
         } catch (err) {
            console.log(err)
            return res.status(200).type('text').send('Unable to fetch books')
         }
      })
      

      .post(async function (req, res){
         try {
            const title = req.body.title;
            if (!title || title.length < 2 || title.length > 100) {
               return res.status(422).type('text').send('missing title')
            }
            const book = await db()
               .collection('books')
               .insertOne({ title, comments: [] })

               const [newBook] = book.ops
               
            return res.status(200).json({ ...newBook })
         } catch (err) { 
            return res.status(422).type('text').send('unable to post book')
         }
      })
      

      .delete(async function(req, res){        
         //const _id = req.body._id ? req.body._id.trim() : null
         //deleteBook(_id, res)
         //if successful response will be 'complete delete successful'
         try {
            const result = db().collection('books').deleteMany({})
            return res.status(200).type('text').send('complete delete successful')
         } catch (err) {
            return res.status(200).type('text').send('unable to delete books')
         }
      });



   app.route('/api/books/:id')
      .get(async function (req, res){
         try {
         const bookid = req.params.id ? req.params.id.trim() : null
         if (!bookid || bookid.length !== 24) { throw 'Invalid book id' }

         const book = await db()
            .collection('books')
            .findOne({ _id: new ObjectId(bookid) })
         if (!book) { throw 'Unable to fetch book' }
           
         const formatedBook = {...book, commentcount: book.comments.length }  

         return res.status(200).json(formatedBook)
         } catch (err) {
            console.log('============\n',err, '\n=============')
            return res.status(200).type('text').send('no book exists')
         }
         //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      })
      

      .post(async function(req, res){
         try {
            const bookid = req.params.id ? req.params.id.trim() : null
            if (!bookid || bookid.length !== 24) { throw 'Invalid book id' }
           
            const comment = req.body.comment ? req.body.comment.trim() : null 
            if (!(comment && comment.length > 0 && comment.length < 600)) {
               return res.status(200).type('text').send('comment field is required')
            }

            const addComment = await db()
               .collection('books')
               .findOneAndUpdate(
                  { _id: new ObjectId(bookid) }, 
                  { $push: { comments: comment } },
                  { returnOriginal: false }
                  )
            if (!addComment) { throw 'Unable to post comment' }
           
           const addedBookComment = { 
               ...addComment.value, 
               commentcount: addComment.value.comments.length            
           }
           
            return res.status(200).json(addedBookComment)
           
         } catch (err) {
            console.log('============\n',err, '\n=============')
            return res.status(200).type('text').send('Unable to post comment')
         }
         //json res format same as .get
      })
      
      .delete(function(req, res){
         const bookid = req.params.id ? req.params.id.trim() : null
         deleteBook(bookid, res)
         //if successful response will be 'delete successful'
      });
  
};