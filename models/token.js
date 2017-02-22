var mongoose = require( 'mongoose' );

var tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true
  }
});

mongoose.model('Token', tokenSchema);
