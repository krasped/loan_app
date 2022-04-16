const app = require('./server.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const port = process.env.PORT || 6000;

mongoose.connect(
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

