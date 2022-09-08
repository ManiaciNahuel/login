const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

//const FileStore = require('session-file-store')(session)
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())

const usuarios = []


app.use(session({
    //store: new FileStore({path: './sesiones', ttl: 60}),
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Nahuel_Maniaci:nahue123@cluster0.qvotb9b.mongodb.net/test',
        mongoOptions: advancedOptions
    }),
    
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 100000
    }
}))


passport.use('register', new LocalStrategy({
    passReqToCallback: true},
    (req, username, password, done) => {
      
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
    }
))
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
  
function registered(req, res, next) {
    if (req.isRegistered()) {
        next()
    } else {
        res.redirect('/login')    
    }
}


app.post('/login', registered, (req, res) => {
    let { name } = req.body
    req.session.name = name
    console.log(req.session);
    res.json(`BIENVENIDO ${req.session.name}`)
})

app.post('/registrer', (req, res) => {
    let { name } = req.body
    req.session.name = name
    console.log(req.session);
    res.json(`BIENVENIDO ${req.session.name}`)
})

app.get('/index',  registered, (req, res) => {
    if (req.session.name) {
        res.send('Estás logueado')
    } else {
        res.send('No estás logueado')
    }
})


app.get('/logOut', (req, res) => {
    let name = req.session.name
    req.session.destroy( err => {
            if (!err) res.json(`Unlogged! Hasta luego! ${name}`)
            else res.json({status: "Not unlogged - ERROR", body: err})
        })
})

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
})