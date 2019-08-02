const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const { url } = require('./config/database');

//conectando a la base de datos
mongoose.connect(url, { useNewUrlParser: true });

//primero se define la configuracion de passport
require('./config/passport')(passport);

// se puede dividir el servidor a traves de:
// configuraciones (settings)
// middlewares
// routes
// static files


//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'faztwebtutorialnode',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes')(app, passport);

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () =>{
  //una vez que inicia el servidor que imprima
  console.log('server on port', app.get('port'));
});
