const {Schema, model, Types, SchemaTypes, mongoose} = require('mongoose');

const schema = new Schema({
    login: {type: String, required: true, unique: true},
    firstName:{type: String},
    phone:{type: Number, required: true, unique: true},
    password:{type: String, required: true},
    contacts:[{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User"
    }],
    loans: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Loan"
    }]
    
},
//to fixed error
{writeConcern: {
        j: true,
        wtimeout: 1000
      }});

module.exports = model('User', schema);

