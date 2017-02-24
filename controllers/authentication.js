const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Token = mongoose.model('Token');

module.exports.register = (req, res) => {
  let user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.dob = req.body.dob;
  user.status = req.body.status;
  user.setPassword(req.body.password, function (hash) {
    user.passwordHash = hash;
    user.save((err) => {
      let token;
      token = user.generateJwt(user);
      res.status(200);
      res.json({
        "token": token
      });
    });
  });
};

module.exports.login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    let token;

    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      token = user.generateJwt(user);
      res.status(200);
      res.json({
        "token": token
      });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.logout = (req, res) => {
  let authTokenStr = req.headers.authorization;
  let authToken = authTokenStr.substr(authTokenStr.indexOf(' ') + 1);
  let token = new Token();
  token.token = authToken;
  token.save((err) => {
    if (err) {
      console.log('logout fail');
    }
    console.log('logged out');
    res.json({ 'msg': 'logged out' });
  })
};