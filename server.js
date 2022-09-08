const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}


/* DATABASE */

const usuarios = []

/* PASSPORT */

passport.use('register', new LocalStrategy({
  passReqToCallback: true
}, (req, username, password, done) => {

  const { direccion } = req.body

  const usuario = usuarios.find(usuario => usuario.username == username)
  if (usuario) {
    return done('already registered')
  }

  const user = {
    username,
    password,
    direccion,
  }
  usuarios.push(user)

  return done(null, user)
}));

passport.use('login', new LocalStrategy((username, password, done) => {

  const user = usuarios.find(usuario => usuario.username == username)

  if (!user) {
    return done(null, false)
  }

  if (user.password != password) {
    return done(null, false)
  }

  user.contador = 0
  return done(null, user);
}));

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  const usuario = usuarios.find(usuario => usuario.username == username)
  done(null, usuario);
});

/* SERVER */

const app = express()

/* MIDDLEWARE */

app.use(session({
  store: MongoStore.create({
      mongoUrl: 'mongodb+srv://Nahuel_Maniaci:nahue123@cluster0.qvotb9b.mongodb.net/test',
      mongoOptions: advancedOptions
  }),
  
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 60000
  }
}))

app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* AUTH */

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* ROUTES */

/* REGISTER */
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', passport.authenticate(
  'register', { 
    failureRedirect: '/failregister',
    successRedirect: '/' 
  }
))

app.get('/failregister', (req, res) => {
  res.render('register-error');
})

/* LOGIN */
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate(
  'login', { 
    failureRedirect: '/faillogin', 
    successRedirect: '/datos' 
  }
))

app.get('/faillogin', (req, res) => {
  res.render('login-error');
})


/* DATOS */
app.get('/datos', isAuth, (req, res) => {
  if (!req.user.contador) {
    req.user.contador = 0
  }
  req.user.contador++

  res.render('datos', {
    datos: usuarios.find(usuario => usuario.username == req.user.username),
    contador: req.user.contador
  });
})

/* LOGOUT */
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})

/* INICIO */
app.get('/', isAuth, (req, res) => {
  res.redirect('/datos')
})

/* LISTEN */
const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on("error", error => console.log(`Error en servidor: ${error}`))