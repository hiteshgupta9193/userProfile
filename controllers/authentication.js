var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');

module.exports.register = function (req, res) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.dob = req.body.dob;
  user.status = req.body.status;
  user.setPassword(req.body.password);

  user.save(function (err) {
    var token;
    token = user.generateJwt();
    res.status(200);
    res.json({
      "token": token
    });
  });

};

module.exports.login = function (req, res) {
  passport.authenticate('local', function (err, user, info) {
    var token;

    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.logout = function (req, res) {
  var authTokenStr = req.headers.authorization;
  var authToken = authTokenStr.substr(authTokenStr.indexOf(' ') + 1);
  var token = new Token();
  token.token = authToken;
  token.save(function (err) {
    if (err) {
      console.log('logout fail');
    }
    console.log('logged out');
    res.json({'msg':'logged out'});
  })
};