var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
const jwt = require("jsonwebtoken");

module.exports.profileRead = function (req, res) {
  validateToken(req, function (err, payload) {
    if (err) {
      res.status(401).json({
        "message": "UnauthorizedError: private profile"
      });
    } else {
      User
        .findById(payload.sub)
        .exec(function (err, user) {
          res.status(200).json(user);
        });
    }
  });
};

module.exports.updateProfile = function (req, res) {
  validateToken(req, function (err, payload) {
    if (err) {
       res.status(401).json({
        "message": "UnauthorizedError: private profile"
      });
    } else {
      User
        .findById(req.payload.sub)
        .exec(function (err, user) {
          user.status = req.body.status || user.status;
          user.dob = req.body.dob || user.dob;
          user.name = req.body.name || user.name;
          user.save(function (err) {
            if (err) throw err;
            console.log('User successfully updated!');
            res.status(200).json(user);
          });
        });
    }
  });
};

function validateToken(req, cb) {
  var authTokenStr = req.headers.authorization;
  var authToken = authTokenStr.substr(authTokenStr.indexOf(' ') + 1);
  Token.find({ token: authToken }, function (err, token) {
    if (token.length == 0) {
      // auth token valid
      jwt.verify(authToken, 'HITESHGUPTA', function (err, decoded) {
        cb(err, decoded);
      });
    } else {
      cb(new Error("invalid token"));
    }
  });
}
