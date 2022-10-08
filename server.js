const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
require('dotenv').config()
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const yargs = require('yargs/yargs')(process.argv.slice(2))
const { fork } = require('child_process')
const compression = require('compression');
const logger = require('./logger');
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
      mongoUrl: 'mongodb+srv://Nahuel_Maniaci:nahue123@cluster0.qvotb9b.mongodb.net/new',
      mongoOptions: advancedOptions
  }),
  
  secret: 'secreto',
  resave: false,
  saveUninitialized: false,
 /*  cookie: {
      maxAge: 60000
  } */
}))

app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session()); 
app.use(compression())
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

const argv = yargs
    .option('p', {
        alias: 'puerto',
        default: 8080
    })
    .option('m', {
        alias: 'mode',
        default: 'FORK',
        type: "string"
    })
    .argv


/* INFO */
app.get('/info', (req, res) => {
  let args;
  if (process.argv.slice(2).length === 0) {
    args = "Sin argumentos";
  } else {
    args = process.argv.slice(2);
  }
  const info = [
    args, 
    process.platform, 
    process.version, 
    process.memoryUsage().rss, 
    process.argv[0], 
    process.pid, 
    process.cwd(), 
    numCPUs
];
  console.log(info);
  res.json(info);
})

app.get('/infoZip', compression(), (req, res) => {
  let args;
  if (process.argv.slice(2).length === 0) {
    args = "Sin argumentos";
  } else {
    args = process.argv.slice(2);
  }
  const info = [
    args, 
    process.platform, 
    process.version, 
    process.memoryUsage().rss, 
    process.argv[0], 
    process.pid, 
    process.cwd(), 
    numCPUs
];
  logger.info(info);
  res.json(info);
})

/* RANDOM */
app.get('/api/random', (req, res) => {
  const { cant } = req.query;
  const forked = fork("./random.js");
  forked.send({ msg: "start", cant });
  forked.on("message", (msg) => {
    res.json({ msg });  
});
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

app.get('/warn', (req, res) => {
  res.send(
    logger.warn("warn")
  )
})
app.get('/infoo', (req, res) => {
  res.send(
    logger.info("info")
  )
})
app.get('/error', (req, res) => {
  res.send(
    logger.error("error")
  )
})


/* app.use(( req, res) => {
  res.status(404).json("Not found")
}); */

const portArgs = argv.puerto;
const PORT = portArgs || 8080;
const serverMode = argv.m || "FORK";

/* MASTER */
if (serverMode == "CUSTER"){
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++){
      cluster.fork()
    }
  
    cluster.on('exit', worker => {
      logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString());
      cluster.fork()
    })
  }
  /* LISTEN */
  else {
    const server = app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT} - PID WORKER: ${process.pid}`)
    })
    server.on("error", error => logger.error(`Error en servidor: ${error}`))
  }

}else {
  const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} - PID WORKER: ${process.pid}`)
  })
  server.on("error", error => logger.error(`Error en servidor: ${error}`))
}
