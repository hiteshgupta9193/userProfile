const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Available"
  }
});

userSchema.methods.setPassword = (password, cb) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      cb(hash);
    });
  });
};

userSchema.methods.validPassword = (password, userRef, cb) => {
  bcrypt.compare(password, userRef.passwordHash, function (err, res) {
    cb(res);
  });
};

userSchema.methods.generateJwt = (user) => {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    sub: user._id,
    email: user.email,
    name: user.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "HITESHGUPTA");
};

mongoose.model('User', userSchema);
