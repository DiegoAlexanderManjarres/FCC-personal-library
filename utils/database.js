const { MongoClient: mongo } = require('mongodb')

let _db

exports.mongoConnect = async callback => {
   try {
      const client = await mongo.connect(process.env.DB, { useNewUrlParser: true })
      _db = client.db('exercise-tracker')
      callback()
   } catch (err) { console.log('Database err... ' + err) }
}

exports.getDb = () => {
   if (!_db) { throw 'Database err' }
   return _db
} 