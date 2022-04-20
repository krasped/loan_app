const {Schema, model} = require('mongoose');

const schema = new Schema({
    // userId: {type: String,required: true}
    login: {type: String, required: true},
    howMach:{type: Number, required: true},
    reason:{type: String, required: true},
    date: {
      type: Date, 
      default: () => Date.now()
    }
},
//to fixed error
{writeConcern: {
        j: true,
        wtimeout: 1000
      }});

module.exports = model('Loan', schema);

