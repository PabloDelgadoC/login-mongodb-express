//Esta es la manera de registrarnos de cualquier forma
//En este caso es de manera local
const LocalStrategy = require('passport-local').Strategy;

//Se define el modelo de usuario
const User = require('../app/model/user');

module.exports = (passport) => {
  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  //metodo que permite registrar
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    (req, email, password, done) => {
      User.findOne({'local.email': email}, (err, user) => {
        if (err){ return done(err);}
        if (user){
          return done(null, false, req.flash('signupMessage', 'The email is already taken'));
        }else{
          let newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save( (err) => {
            if (err) {throw err;}
            return done(null, newUser);
          });
        }
      });
    }
  ));

  //login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
    (req, email, password, done) => {
      User.findOne({'local.email': email}, (err, user) => {
        if (err){ return done(err);}
        if (!user){
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        }
        if (!user.validatePassword(password)){
          return done(null, false, req.falsh('loginMessage', 'Wrong password'));
        }
        return done(null, user);
      });
    }
  ));
}
