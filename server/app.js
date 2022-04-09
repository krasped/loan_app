const app = require('./server.js');
const dotenv = require('dotenv');
const mongodb = require('mongodb');
dotenv.config();
MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 6000;

MongoClient.connect(
  process.env.MONGO_URI, {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.catch(err => {
  console.error(err.stack);
  process.exit(1);
})
.then(async client => {
  app.listen(port, () => {
    console.log(`App has been started on port ${port}...`)
  });
})

