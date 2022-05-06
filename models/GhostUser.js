const {Schema, model} = require('mongoose');

const schema = new Schema({
    login: {type: String, required: true, unique: true},
},
//to fixed error
{writeConcern: {
        j: true,
        wtimeout: 1000
      }});

module.exports = model('GhostUser', schema);
