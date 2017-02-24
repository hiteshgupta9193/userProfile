var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'email'
},
  function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      user.validPassword(password, user, function (res) {
        if (!res) {
          return done(null, false, {
            message: 'Password is wrong'
          });
        } else {
          return done(null, user);
        }
      });
    })
  }));